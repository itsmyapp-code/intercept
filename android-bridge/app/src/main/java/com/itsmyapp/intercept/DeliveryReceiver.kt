package com.itsmyapp.intercept

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import java.util.Calendar

class DeliveryReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        Log.d("DeliveryReceiver", "Batch delivery schedule triggered!")

        val pendingResult = goAsync()
        Thread {
            try {
                val db = InterceptDatabase.getDatabase(context)
                val alertDao = db.blockedAlertDao()
                val ruleDao = db.interceptionRuleDao()

                // Fetch all unreleased alerts
                val unreleasedAlerts = alertDao.getUnreleasedAlerts()
                Log.d("DeliveryReceiver", "Found ${unreleasedAlerts.size} unreleased alerts in database.")

                var releaseCount = 0
                unreleasedAlerts.forEach { alert ->
                    // Only release alerts that are in POSTBOX mode (calls cannot be reposted, always block is blocked)
                    val rule = ruleDao.getRuleForPackage(alert.appPackage)
                    if (rule != null && rule.exclusionMode == "POSTBOX") {
                        repostNotification(context, alert)
                        alertDao.markAsReleased(alert.id)
                        releaseCount++
                    }
                }
                Log.d("DeliveryReceiver", "Successfully released $releaseCount Postbox notification(s).")

                // Reschedule the alarms to run tomorrow at the same time
                rescheduleAlarms(context, db)

            } catch (e: Exception) {
                Log.e("DeliveryReceiver", "Error releasing batch delivery: $e")
            } finally {
                pendingResult.finish()
            }
        }.start()
    }

    private fun repostNotification(context: Context, alert: BlockedAlert) {
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
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        notificationManager.notify(alert.id.toInt(), builder.build())
    }

    private fun rescheduleAlarms(context: Context, db: InterceptDatabase) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val schedules = db.deliveryScheduleDao().getAllSchedules()

        schedules.forEachIndexed { index, schedule ->
            if (schedule.isEnabled) {
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

                // Push to tomorrow since this alarm has just fired
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
                Log.d("DeliveryReceiver", "Rescheduled alarm for slot $index at ${schedule.deliveryHour}:${schedule.deliveryMinute}")
            }
        }
    }
}
