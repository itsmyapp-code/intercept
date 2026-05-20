package com.itsmyapp.intercept

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.telecom.Call
import android.telecom.CallScreeningService
import android.telecom.PhoneAccountHandle
import android.telephony.SubscriptionInfo
import android.telephony.SubscriptionManager
import android.content.Context
import android.util.Log
import androidx.room.*
import java.util.Calendar

// ─────────────────────────────────────────────
// Room Entities
// ─────────────────────────────────────────────

/** Represents a notification alert that was intercepted and held in the Vault. */
@Entity(tableName = "blocked_alerts")
data class BlockedAlert(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "app_package")  val appPackage: String,
    @ColumnInfo(name = "title")        val title: String?,
    @ColumnInfo(name = "text_body")    val textBody: String?,
    @ColumnInfo(name = "timestamp")    val timestamp: Long,
    @ColumnInfo(name = "is_released")  val isReleased: Boolean = false
)

/** Stores the user's notification-routing rule for each app package. */
@Entity(tableName = "interception_rules")
data class InterceptionRule(
    @PrimaryKey @ColumnInfo(name = "app_package") val appPackage: String,
    // Modes: "ALWAYS_ALLOW", "ALWAYS_BLOCK", "POSTBOX"
    @ColumnInfo(name = "exclusion_mode") val exclusionMode: String
)

/** Custom batch-delivery time slot for Postbox mode. */
@Entity(tableName = "delivery_schedules")
data class DeliverySchedule(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "delivery_hour")   val deliveryHour: Int,
    @ColumnInfo(name = "delivery_minute") val deliveryMinute: Int,
    @ColumnInfo(name = "is_enabled")      val isEnabled: Boolean = true
)

/**
 * Stores the active SIM subscription details detected at start-up.
 * subscriptionId  — Android SubscriptionManager ID.
 * simSlot         — Physical SIM slot index (0 = SIM 1, 1 = SIM 2).
 * displayName     — Carrier / user-set display name for the SIM.
 * callRule        — Routing rule applied to inbound calls on this SIM.
 *                   Values: "ALWAYS_ALLOW", "ALWAYS_BLOCK", "POSTBOX"
 */
@Entity(tableName = "sim_rules")
data class SimRule(
    @PrimaryKey @ColumnInfo(name = "subscription_id") val subscriptionId: Int,
    @ColumnInfo(name = "sim_slot")     val simSlot: Int,
    @ColumnInfo(name = "display_name") val displayName: String,
    @ColumnInfo(name = "call_rule")    val callRule: String = "ALWAYS_ALLOW"
)

// ─────────────────────────────────────────────
// DAOs
// ─────────────────────────────────────────────

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

@Dao
interface SimRuleDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun upsertSimRule(simRule: SimRule)

    @Query("SELECT * FROM sim_rules ORDER BY sim_slot ASC")
    fun getAllSimRules(): List<SimRule>

    @Query("SELECT * FROM sim_rules WHERE subscription_id = :subscriptionId")
    fun getSimRule(subscriptionId: Int): SimRule?

    @Query("UPDATE sim_rules SET call_rule = :rule WHERE subscription_id = :subscriptionId")
    fun updateCallRule(subscriptionId: Int, rule: String)
}

// ─────────────────────────────────────────────
// Room Database
// ─────────────────────────────────────────────

@Database(
    entities = [BlockedAlert::class, InterceptionRule::class, DeliverySchedule::class, SimRule::class],
    version = 3,
    exportSchema = false
)
abstract class InterceptDatabase : RoomDatabase() {
    abstract fun blockedAlertDao(): BlockedAlertDao
    abstract fun interceptionRuleDao(): InterceptionRuleDao
    abstract fun deliveryScheduleDao(): DeliveryScheduleDao
    abstract fun simRuleDao(): SimRuleDao

    companion object {
        @Volatile private var INSTANCE: InterceptDatabase? = null

        fun getDatabase(context: Context): InterceptDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    InterceptDatabase::class.java,
                    "intercept_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}

// ─────────────────────────────────────────────
// Notification Listener Service
// ─────────────────────────────────────────────

class InterceptListenerService : NotificationListenerService() {

    private lateinit var database: InterceptDatabase
    private lateinit var alertDao: BlockedAlertDao
    private lateinit var ruleDao: InterceptionRuleDao
    private lateinit var scheduleDao: DeliveryScheduleDao
    private lateinit var simRuleDao: SimRuleDao

    override fun onCreate() {
        super.onCreate()
        Log.d("InterceptService", "Initialising InterceptListenerService background listener.")
        database     = InterceptDatabase.getDatabase(applicationContext)
        alertDao     = database.blockedAlertDao()
        ruleDao      = database.interceptionRuleDao()
        scheduleDao  = database.deliveryScheduleDao()
        simRuleDao   = database.simRuleDao()

        // Detect and register active SIM subscriptions
        registerActiveSimSubscriptions()
    }

    private fun registerActiveSimSubscriptions() {
        try {
            val subscriptionManager =
                getSystemService(SubscriptionManager::class.java) ?: return
            val activeSims: List<SubscriptionInfo> =
                subscriptionManager.activeSubscriptionInfoList ?: emptyList()

            Log.i("InterceptService", "Detected ${activeSims.size} active SIM(s).")

            Thread {
                activeSims.forEach { info ->
                    val existing = simRuleDao.getSimRule(info.subscriptionId)
                    if (existing == null) {
                        val simRule = SimRule(
                            subscriptionId = info.subscriptionId,
                            simSlot        = info.simSlotIndex,
                            displayName    = info.displayName?.toString()
                                             ?: "SIM ${info.simSlotIndex + 1}",
                            callRule       = "ALWAYS_ALLOW"
                        )
                        simRuleDao.upsertSimRule(simRule)
                        Log.i("InterceptService",
                            "Registered new SIM: slot=${info.simSlotIndex} " +
                            "name=${simRule.displayName} id=${info.subscriptionId}")
                    } else {
                        Log.d("InterceptService",
                            "SIM already registered: slot=${info.simSlotIndex} " +
                            "rule=${existing.callRule}")
                    }
                }
            }.start()
        } catch (e: SecurityException) {
            Log.w("InterceptService",
                "READ_PHONE_STATE permission not granted — SIM detection skipped. $e")
        }
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val appPackage = sbn.packageName
        if (appPackage == this.packageName) return

        // 1. Check if the engine is engaged
        val sharedPrefs = applicationContext.getSharedPreferences("InterceptPrefs", Context.MODE_PRIVATE)
        val engineEngaged = sharedPrefs.getBoolean("engine_engaged", true)
        if (!engineEngaged) {
            Log.d("InterceptService", "Engine is disengaged. Allowing notification from $appPackage")
            return
        }

        val extras   = sbn.notification.extras
        val title    = extras.getCharSequence("android.title")?.toString()
        val textBody = extras.getCharSequence("android.text")?.toString()
        val timestamp = sbn.postTime

        Log.d("InterceptService", "Processing incoming notification from: $appPackage")

        Thread {
            val rule      = ruleDao.getRuleForPackage(appPackage)
            val isExcluded = shouldExclude(rule)

            if (isExcluded) {
                cancelNotification(sbn.key)
                Log.i("InterceptService", "Notification cancelled and diverted to Vault: $appPackage")

                alertDao.insertAlert(
                    BlockedAlert(
                        appPackage = appPackage,
                        title      = title,
                        textBody   = textBody,
                        timestamp  = timestamp,
                        isReleased = false
                    )
                )
            } else {
                Log.d("InterceptService", "Notification allowed through: $appPackage")
            }
        }.start()
    }

    private fun shouldExclude(rule: InterceptionRule?): Boolean {
        if (rule == null) return false
        return when (rule.exclusionMode) {
            "ALWAYS_BLOCK" -> { Log.d("InterceptService", "Rule: ALWAYS_BLOCK"); true  }
            "ALWAYS_ALLOW" -> { Log.d("InterceptService", "Rule: ALWAYS_ALLOW"); false }
            "POSTBOX"      -> { Log.d("InterceptService", "Rule: POSTBOX — redirecting to Vault"); true }
            else           -> false
        }
    }
}

// ─────────────────────────────────────────────
// Call Screening Service (Android 7+)
// ─────────────────────────────────────────────

class InterceptCallScreeningService : CallScreeningService() {

    override fun onScreenCall(callDetails: Call.Details) {
        val callerNumber = callDetails.handle?.schemeSpecificPart ?: "Unknown"

        // 1. Check if the engine is engaged
        val sharedPrefs = applicationContext.getSharedPreferences("InterceptPrefs", Context.MODE_PRIVATE)
        val engineEngaged = sharedPrefs.getBoolean("engine_engaged", true)
        if (!engineEngaged) {
            Log.i("InterceptCallScreening", "Engine is disengaged. Allowing call from $callerNumber")
            val response = CallResponse.Builder()
                .setDisallowCall(false)
                .setSilenceCall(false)
                .build()
            respondToCall(callDetails, response)
            return
        }

        val database    = InterceptDatabase.getDatabase(applicationContext)
        val simRuleDao  = database.simRuleDao()
        val alertDao    = database.blockedAlertDao()

        val phoneAccountHandle: PhoneAccountHandle? = callDetails.accountHandle
        val subscriptionId = resolveSubscriptionId(phoneAccountHandle)

        Thread {
            val simRule = if (subscriptionId != null) {
                simRuleDao.getSimRule(subscriptionId)
            } else null

            val callRule = simRule?.callRule ?: "ALWAYS_ALLOW"
            val simLabel     = simRule?.displayName ?: "Unknown SIM"
            val targetAppPackage = if (simRule?.simSlot == 1) "android.telecom.sim2" else "android.telecom.sim1"

            Log.i("InterceptCallScreening",
                "Inbound call on $simLabel (sub=$subscriptionId) from $callerNumber → rule=$callRule")

            val response = when (callRule) {
                "ALWAYS_BLOCK" -> {
                    alertDao.insertAlert(
                        BlockedAlert(
                            appPackage = targetAppPackage,
                            title      = "Blocked Call – $simLabel",
                            textBody   = "From: $callerNumber",
                            timestamp  = System.currentTimeMillis(),
                            isReleased = false
                        )
                    )
                    CallResponse.Builder()
                        .setDisallowCall(true)
                        .setRejectCall(true)
                        .setSkipNotification(true)
                        .build()
                }
                "POSTBOX" -> {
                    alertDao.insertAlert(
                        BlockedAlert(
                            appPackage = targetAppPackage,
                            title      = "Postbox Call – $simLabel",
                            textBody   = "From: $callerNumber",
                            timestamp  = System.currentTimeMillis(),
                            isReleased = false
                        )
                    )
                    CallResponse.Builder()
                        .setDisallowCall(false)
                        .setSilenceCall(true)
                        .setSkipCallLog(false)
                        .build()
                }
                else -> {
                    CallResponse.Builder()
                        .setDisallowCall(false)
                        .setSilenceCall(false)
                        .build()
                }
            }

            respondToCall(callDetails, response)
        }.start()
    }

    private fun resolveSubscriptionId(handle: PhoneAccountHandle?): Int? {
        if (handle == null) return null
        return try {
            val subscriptionManager = getSystemService(SubscriptionManager::class.java)
            subscriptionManager
                ?.activeSubscriptionInfoList
                ?.firstOrNull { info ->
                    info.iccId == handle.id || info.simSlotIndex.toString() == handle.id
                }
                ?.subscriptionId
        } catch (e: SecurityException) {
            Log.w("InterceptCallScreening", "Cannot resolve subscription ID: $e")
            null
        }
    }
}
