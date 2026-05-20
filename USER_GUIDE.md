# Intercept User Guide

## Overview
Intercept is a privacy-first, ultra-minimalist notification filter and control dashboard designed to run as a Next.js Progressive Web Application (PWA) synchronised with a native Android background service. It helps you manage digital wellbeing by intercepting, holding, and batch-delivering notifications based on customisable scheduling rules.

---

## Supported Applications
The control panel manages notification routing for the following critical communication platforms:
- **Outlook** (`com.microsoft.office.outlook`)
- **WhatsApp** (`com.whatsapp`)
- **Messenger** (`com.facebook.orca`)
- **Text Messages (SMS)** (`com.google.android.apps.messaging`)
- **Gmail** (`com.google.android.gm`)

---

## Interception Modes
For each application, you can independently configure one of three routing modes:
1. **Always Allow**: Notifications bypass the filter and display immediately in the system tray.
2. **Always Block**: Notifications are permanently silenced and logged directly to **The Vault**.
3. **Postbox**: Notifications are intercepted and held in the Vault, then batch-delivered at your custom-scheduled times.

---

## Postbox Batch Delivery Customisation
You can configure a custom schedule of delivery times for your Postbox app notifications.

- **Add Custom Times**: Use the time selector in the **Postbox Customisation** card and click `Add` to insert custom delivery hours.
- **Quick Preset Profiles**:
  - *Minimalist*: Restricts delivery to twice daily (08:00 and 20:00).
  - *Deep Work*: Restricts delivery to four times daily (09:00, 13:00, 17:00, 21:00).
  - *Hourly Batch*: Delivers every hour on the hour during typical work hours (09:00 to 18:00).
- **Deliver Batches Now**: Click this action button to trigger an immediate manual release of all queued Postbox notifications to the system tray.

---

## The Vault
The Vault acts as a chronological registry of all intercepted and blocked notifications:
- **Release Alert**: Instantly forwards the held notification to your device's system tray.
- **Delete Alert Log**: Removes the log record from the Vault registry.
- **Clear Vault**: Deletes all log records at once.

---

## Sandbox Simulator
Use the built-in Sandbox Simulator to test your notification rules without needing a connected Android device:
1. Select the source app from the dropdown menu.
2. Enter a simulated sender and message text.
3. Click **Simulate Incoming Notification**.
4. View the result and routing reasoning in the **Simulator Log Stream**.

---

## Privacy & Local Persistence
- **Zero Cloud Storage**: All configurations, logs, and rules save instantly to the browser's `window.localStorage`.
- **UK English Spelling**: Used consistently across the entire dashboard interface, service logs, and code configurations.
- **PWA Installation**: Click the install button in the interface header to add Intercept directly to your device home screen.
