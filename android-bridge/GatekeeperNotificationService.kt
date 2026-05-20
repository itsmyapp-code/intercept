package com.itsmyapp.gatekeeper

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.content.Intent
import android.util.Log
import androidx.room.*
import android.os.Build
import androidx.annotation.RequiresApi

@Entity(tableName = "held_notifications")
data class HeldNotification(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val appName: String,
    val title: String?,
    val text: String?,
    val timestamp: Long
)

@Dao
interface HeldNotificationDao {
    @Insert
    fun insert(notification: HeldNotification)
}

@Database(entities = [HeldNotification::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun heldNotificationDao(): HeldNotificationDao
}

class GatekeeperNotificationService : NotificationListenerService() {
    private lateinit var db: AppDatabase
    private lateinit var dao: HeldNotificationDao
    private var blockedPackages: Set<String> = emptySet()

    override fun onCreate() {
        super.onCreate()
        db = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java, "gatekeeper-db"
        ).build()
        dao = db.heldNotificationDao()
        // TODO: Load blockedPackages from shared preferences or a config file
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName
        if (blockedPackages.contains(packageName)) {
            cancelNotification(sbn.key)
            val notification = sbn.notification
            val extras = notification.extras
            val title = extras.getCharSequence("android.title")?.toString()
            val text = extras.getCharSequence("android.text")?.toString()
            val held = HeldNotification(
                appName = packageName,
                title = title,
                text = text,
                timestamp = sbn.postTime
            )
            Thread { dao.insert(held) }.start()
        }
    }
}
