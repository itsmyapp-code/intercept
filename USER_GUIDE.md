# Intercept User Guide

## Overview
Intercept is a privacy-first notification manager and control dashboard, designed for both web and Android. It allows you to filter, hold, and release notifications based on your own rules, with full compliance and transparency.

## Installation
- **PWA:** On your mobile or desktop browser, tap the “Install App” button or use your browser’s “Add to Home Screen” option.
- **Android Bridge:** Advanced users can install the GatekeeperNotificationService on Android for system-level notification control (see project docs).

## Dashboard Usage
- **Header:** Shows app status, logo, and Android connection badge.
- **Control Engine:** Master toggle to enable/disable filtering. “Current Mode” shows which rule set is active.
- **Rules Matrix:** Set each app (Gmail, WhatsApp, Slack, SMS) to Always Allow, Always Block, or Schedule Based.
- **The Vault:** View held notifications, release them to your system tray, or clear the log in Admin Settings.
- **Admin Settings:** Import/export your rules as JSON, or clear all held notifications.

## Compliance & Privacy
- Cookie consent banner appears on first visit. You can accept or reject all non-essential cookies with equal prominence.
- All compliance documents (Terms, Privacy, Cookies, Accessibility) are available in the footer.
- Contact: [hello@itsmyapp.co.uk](mailto:hello@itsmyapp.co.uk)

## Android Bridge (Advanced)
- Install the GatekeeperNotificationService on your Android device for system-level notification filtering.
- Configure package rules to match your dashboard settings.
- All blocked notifications are logged locally and can be synced to the web dashboard.
