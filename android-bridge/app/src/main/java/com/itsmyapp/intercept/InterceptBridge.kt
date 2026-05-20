package com.itsmyapp.intercept

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import android.webkit.JavascriptInterface
import androidx.core.app.NotificationCompat
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import java.util.Calendar

class InterceptBridge(private val context: Context) {

    private val db = InterceptDatabase.getDatabase(context)
    private val gson = Gson()

    @JavascriptInterface
    fun loadState(): String {
        Log.d("InterceptBridge", "loadState() called from JavaScript")
        val sharedPrefs = context.getSharedPreferences("InterceptPrefs", Context.MODE_PRIVATE)
        val cachedState = sharedPrefs.getString("cached_state", null)

        // Parse existing cached state or create default
        val stateObj = if (!cachedState.isNullOrEmpty()) {
            try {
                gson.fromJson(cachedState, JsonObject::class.java)
            } catch (e: Exception) {
                JsonObject()
            }
        } else {
            JsonObject()
        }

        // Fetch real blocked alerts from Room
        try {
            val dbAlerts = db.blockedAlertDao().getAllBlockedAlerts()
            val jsonAlertsArray = JsonArray()
            dbAlerts.forEach { alert ->
                val alertJson = JsonObject()
                alertJson.addProperty("id", alert.id.toString())
                alertJson.addProperty("appKey", mapPackageToKey(alert.appPackage))
                alertJson.addProperty("title", alert.title ?: "")
                alertJson.addProperty("textBody", alert.textBody ?: "")
                alertJson.addProperty("timestamp", alert.timestamp)
                alertJson.addProperty("isReleased", alert.isReleased)
                alertJson.addProperty("isPostboxBatch", true) // Default true for native blocks
                jsonAlertsArray.add(alertJson)
            }
            stateObj.add("interceptedAlerts", jsonAlertsArray)
        } catch (e: Exception) {
            Log.e("InterceptBridge", "Error fetching Room alerts for loadState: $e")
        }

        // Return the merged state
        return gson.toJson(stateObj)
    }

    @JavascriptInterface
    fun saveState(stateJson: String) {
        Log.d("InterceptBridge", "saveState() called with JSON: $stateJson")
        val sharedPrefs = context.getSharedPreferences("InterceptPrefs", Context.MODE_PRIVATE)
        sharedPrefs.edit().putString("cached_state", stateJson).apply()

        try {
            val stateObj = gson.fromJson(stateJson, JsonObject::class.java)

            // 1. Sync engineEngaged to SharedPreferences for fast access
            val engineEngaged = stateObj.get("engineEngaged")?.asBoolean ?: true
            sharedPrefs.edit().putBoolean("engine_engaged", engineEngaged).apply()
            Log.d("InterceptBridge", "Engine engaged status: $engineEngaged")

            // 2. Sync appCustomisations to Room
            val customisations = stateObj.getAsJsonObject("appCustomisations")
            if (customisations != null) {
                Thread {
                    customisations.keySet().forEach { key ->
                        val packageId = mapKeyToPackage(key)
                        if (packageId != null) {
                            val modeObj = customisations.getAsJsonObject(key)
                            val mode = modeObj?.get("mode")?.asString ?: "ALWAYS_ALLOW"
                            db.interceptionRuleDao().insertOrUpdateRule(
                                InterceptionRule(appPackage = packageId, exclusionMode = mode)
                            )
                        }
                    }
                    Log.d("InterceptBridge", "Room Interception Rules updated successfully.")
                }.start()
            }

            // 3. Sync deliveryTimes schedules & trigger alarms
            val deliveryTimes = stateObj.getAsJsonArray("deliveryTimes")
            if (deliveryTimes != null) {
                Thread {
                    // Clear existing schedules in Room first
                    val existingSchedules = db.deliveryScheduleDao().getAllSchedules()
                    existingSchedules.forEach {
                        db.deliveryScheduleDao().deleteSchedule(it.id)
                    }

                    // Save new schedules and register alarms
                    val activeSchedules = mutableListOf<DeliverySchedule>()
                    deliveryTimes.forEach { element ->
                        val timeObj = element.asJsonObject
                        val isEnabled = timeObj.get("isEnabled")?.asBoolean ?: false
                        if (isEnabled) {
                            val hour = timeObj.get("hour")?.asInt ?: 0
                            val minute = timeObj.get("minute")?.asInt ?: 0
                            val schedule = DeliverySchedule(
                                deliveryHour = hour,
                                deliveryMinute = minute,
                                isEnabled = true
                            )
                            db.deliveryScheduleDao().insertSchedule(schedule)
                            activeSchedules.add(schedule)
                        }
                    }
                    
                    // Reprogram alarms using AlarmManager
                    setupAlarms(activeSchedules)
                    Log.d("InterceptBridge", "Room Delivery Schedules updated and alarms configured.")
                }.start()
            }

            // 4. Sync interceptedAlerts (releases and deletions)
            val jsonAlerts = stateObj.getAsJsonArray("interceptedAlerts")
            if (jsonAlerts != null) {
                Thread {
                    val dbAlerts = db.blockedAlertDao().getAllBlockedAlerts()
                    val jsonIds = jsonAlerts.map { it.asJsonObject.get("id").asString }.toSet()

                    // Handle deletions (alerts present in DB but missing in JSON)
                    dbAlerts.forEach { alert ->
                        if (!jsonIds.contains(alert.id.toString())) {
                            db.blockedAlertDao().deleteBlockedAlert(alert.id)
                            Log.d("InterceptBridge", "Deleted alert ID ${alert.id} from Room (user deleted it in UI)")
                        }
                    }

                    // Handle releases (alerts marked isReleased = true in JSON but not in Room)
                    jsonAlerts.forEach { element ->
                        val alertJson = element.asJsonObject
                        val idStr = alertJson.get("id").asString
                        val isReleasedJson = alertJson.get("isReleased")?.asBoolean ?: false

                        if (isReleasedJson) {
                            val dbId = idStr.toLongOrNull()
                            if (dbId != null) {
                                val dbAlert = dbAlerts.find { it.id == dbId }
                                if (dbAlert != null && !dbAlert.isReleased) {
                                    // Post/repost the notification to the tray
                                    repostNotification(dbAlert)
                                    // Mark as released in Room
                                    db.blockedAlertDao().markAsReleased(dbId)
                                    Log.d("InterceptBridge", "Released alert ID $dbId to system notification tray")
                                }
                            }
                        }
                    }
                }.start()
            }

        } catch (e: Exception) {
            Log.e("InterceptBridge", "Error parsing state JSON inside saveState: $e")
        }
    }

    private fun setupAlarms(schedules: List<DeliverySchedule>) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        
        // Cancel all existing alarms first (by sending clean PendingIntents)
        for (i in 0..10) { // Cancel general slots
            val intent = Intent(context, DeliveryReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context, i, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            alarmManager.cancel(pendingIntent)
        }

        // Set new alarms
        schedules.forEachIndexed { index, schedule ->
            val intent = Intent(context, DeliveryReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context, index, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val calendar = Calendar.getInstance().apply {
                timeInMillis = System.currentTimeMillis()
                set(Calendar.HOUR_OF_DAY, schedule.deliveryHour)
                set(Calendar.MINUTE, schedule.deliveryMinute)
                set(Calendar.SECOND, 0)
            }

            // If time has already passed today, schedule for tomorrow
            if (calendar.timeInMillis <= System.currentTimeMillis()) {
                calendar.add(Calendar.DAY_OF_YEAR, 1)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            }
            Log.d("InterceptBridge", "Alarm set for slot $index at ${schedule.deliveryHour}:${schedule.deliveryMinute}")
        }
    }

    private fun repostNotification(alert: BlockedAlert) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "intercepted_notifications"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Intercept Released Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Shows notifications released from Intercept batch delivery"
            }
            notificationManager.createNotificationChannel(channel)
        }

        // Map appPackage to a human-readable title prefix
        val appName = when (alert.appPackage) {
            "com.microsoft.office.outlook" -> "Outlook"
            "com.whatsapp" -> "WhatsApp"
            "com.facebook.orca" -> "Messenger"
            "com.google.android.apps.messaging" -> "SMS"
            "com.google.android.gm" -> "Gmail"
            "android.telecom.sim1" -> "SIM 1 Call"
            "android.telecom.sim2" -> "SIM 2 Call"
            else -> "Notification"
        }

        val contentTitle = if (alert.title.isNullOrEmpty()) appName else "[$appName] ${alert.title}"

        val builder = NotificationCompat.Builder(context, channelId)
            .setContentTitle(contentTitle)
            .setContentText(alert.textBody)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // System info icon as fallback
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        notificationManager.notify(alert.id.toInt(), builder.build())
    }

    // Maps Next.js frontend state AppKey to Android Package Name
    private fun mapKeyToPackage(key: String): String? {
        return when (key) {
            "outlook" -> "com.microsoft.office.outlook"
            "whatsapp" -> "com.whatsapp"
            "messenger" -> "com.facebook.orca"
            "sms" -> "com.google.android.apps.messaging"
            "gmail" -> "com.google.android.gm"
            "calls_sim1" -> "android.telecom.sim1"
            "calls_sim2" -> "android.telecom.sim2"
            else -> null
        }
    }

    // Maps Android Package Name back to Next.js state AppKey
    private fun mapPackageToKey(packageName: String): String {
        return when (packageName) {
            "com.microsoft.office.outlook" -> "outlook"
            "com.whatsapp" -> "whatsapp"
            "com.facebook.orca" -> "messenger"
            "com.google.android.apps.messaging" -> "sms"
            "com.google.android.gm" -> "gmail"
            "android.telecom.sim1" -> "calls_sim1"
            "android.telecom.sim2" -> "calls_sim2"
            else -> "outlook" // Fallback
        }
    }
}
