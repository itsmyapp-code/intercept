package com.itsmyapp.intercept

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.content.Context
import android.util.Log
import androidx.room.*
import java.util.Calendar

// UK English: BlockedAlert represents blocked alerts intercepted by the background service
@Entity(tableName = "blocked_alerts")
data class BlockedAlert(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "app_package") val appPackage: String,
    @ColumnInfo(name = "title") val title: String?,
    @ColumnInfo(name = "text_body") val textBody: String?,
    @ColumnInfo(name = "timestamp") val timestamp: Long,
    @ColumnInfo(name = "is_released") val isReleased: Boolean = false
)

// UK English: InterceptionRule defines rules for customisation of app notification blocking
@Entity(tableName = "interception_rules")
data class InterceptionRule(
    @PrimaryKey @ColumnInfo(name = "app_package") val appPackage: String,
    @ColumnInfo(name = "exclusion_mode") val exclusionMode: String // "ALWAYS_ALLOW", "ALWAYS_BLOCK", "POSTBOX"
)

// UK English: DeliverySchedule defines the custom delivery batches for Postbox mode
@Entity(tableName = "delivery_schedules")
data class DeliverySchedule(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "delivery_hour") val deliveryHour: Int,
    @ColumnInfo(name = "delivery_minute") val deliveryMinute: Int,
    @ColumnInfo(name = "is_enabled") val isEnabled: Boolean = true
)

@Dao
interface BlockedAlertDao {
    @Insert
    fun insertAlert(alert: BlockedAlert)

    @Query("SELECT * FROM blocked_alerts ORDER BY timestamp DESC")
    fun getAllBlockedAlerts(): List<BlockedAlert>

    @Query("SELECT * FROM blocked_alerts WHERE is_released = 0 ORDER BY timestamp DESC")
    fun getUnreleasedAlerts(): List<BlockedAlert>

    @Query("UPDATE blocked_alerts SET is_released = 1 WHERE id = :id")
    fun markAsReleased(id: Long)

    @Query("UPDATE blocked_alerts SET is_released = 1 WHERE is_released = 0")
    fun releaseAllBatches()

    @Query("DELETE FROM blocked_alerts WHERE id = :id")
    fun deleteBlockedAlert(id: Long)

    @Query("DELETE FROM blocked_alerts")
    fun clearAllBlockedAlerts()
}

@Dao
interface InterceptionRuleDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertOrUpdateRule(rule: InterceptionRule)

    @Query("SELECT * FROM interception_rules WHERE app_package = :appPackage")
    fun getRuleForPackage(appPackage: String): InterceptionRule?

    @Query("SELECT * FROM interception_rules")
    fun getAllRules(): List<InterceptionRule>
}

@Dao
interface DeliveryScheduleDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertSchedule(schedule: DeliverySchedule)

    @Query("DELETE FROM delivery_schedules WHERE id = :id")
    fun deleteSchedule(id: Long)

    @Query("SELECT * FROM delivery_schedules ORDER BY delivery_hour ASC, delivery_minute ASC")
    fun getAllSchedules(): List<DeliverySchedule>
}

@Database(
    entities = [BlockedAlert::class, InterceptionRule::class, DeliverySchedule::class],
    version = 2,
    exportSchema = false
)
abstract class InterceptDatabase : RoomDatabase() {
    abstract fun blockedAlertDao(): BlockedAlertDao
    abstract fun interceptionRuleDao(): InterceptionRuleDao
    abstract fun deliveryScheduleDao(): DeliveryScheduleDao

    companion object {
        @Volatile
        private var INSTANCE: InterceptDatabase? = null

        fun getDatabase(context: Context): InterceptDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    InterceptDatabase::class.java,
                    "intercept_database"
                )
                .fallbackToDestructiveMigration() // Facilitate updates during development
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}

class InterceptListenerService : NotificationListenerService() {
    private lateinit var database: InterceptDatabase
    private lateinit var alertDao: BlockedAlertDao
    private lateinit var ruleDao: InterceptionRuleDao
    private lateinit var scheduleDao: DeliveryScheduleDao

    override fun onCreate() {
        super.onCreate()
        Log.d("InterceptService", "Initialising InterceptListenerService background listener.")
        database = InterceptDatabase.getDatabase(applicationContext)
        alertDao = database.blockedAlertDao()
        ruleDao = database.interceptionRuleDao()
        scheduleDao = database.deliveryScheduleDao()
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val appPackage = sbn.packageName
        if (appPackage == this.packageName) {
            return // Avoid intercepting notifications from our own application
        }

        val extras = sbn.notification.extras
        val title = extras.getCharSequence("android.title")?.toString()
        val textBody = extras.getCharSequence("android.text")?.toString()
        val timestamp = sbn.postTime

        Log.d("InterceptService", "Processing incoming notification from package: $appPackage")

        // Perform rule evaluation on a background thread
        Thread {
            val rule = ruleDao.getRuleForPackage(appPackage)
            val isExcluded = shouldExclude(appPackage, rule)

            if (isExcluded) {
                // Cancel notification (kill tray alert)
                cancelNotification(sbn.key)
                Log.i("InterceptService", "Notification cancelled and diverted to Vault: $appPackage")

                // Save to Room database log
                val alert = BlockedAlert(
                    appPackage = appPackage,
                    title = title,
                    textBody = textBody,
                    timestamp = timestamp,
                    isReleased = false
                )
                alertDao.insertAlert(alert)
                Log.d("InterceptService", "Intercepted notification saved to persistence log.")
            } else {
                Log.d("InterceptService", "Notification allowed to display based on prioritised allowances.")
            }
        }.start()
    }

    private fun shouldExclude(appPackage: String, rule: InterceptionRule?): Boolean {
        if (rule == null) {
            // Default behaviour: if no customisation rule exists, we do not block/exclude.
            return false
        }

        return when (rule.exclusionMode) {
            "ALWAYS_BLOCK" -> {
                Log.d("InterceptService", "Rule evaluation: ALWAYS_BLOCK matched.")
                true
            }
            "ALWAYS_ALLOW" -> {
                Log.d("InterceptService", "Rule evaluation: ALWAYS_ALLOW matched.")
                false
            }
            "POSTBOX" -> {
                // In Postbox mode, all alerts are intercepted and held in the Vault database.
                // The batch delivery times trigger the release of notifications to the tray.
                Log.d("InterceptService", "Rule evaluation: POSTBOX mode matched. Redirecting alert to Vault.")
                true
            }
            else -> false
        }
    }
}
