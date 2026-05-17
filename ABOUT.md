# About Reminder

Reminder is a small, single-purpose Chrome Manifest V3 extension that turns the browser into a personal reminder queue. You enter a piece of text and a target date/time in the toolbar popup, and at the appointed moment a custom alert window slides in with your reminder, auto-dismissing after thirty seconds.

The project favours simplicity over feature creep. Storage is delegated to `chrome.storage.sync` so reminders follow the signed-in user across browsers; scheduling is delegated to `chrome.alarms` so reminders fire reliably even when the popup is closed; and the alert UI is a standalone HTML page rather than an OS notification, giving it a consistent look across Windows, macOS, and Linux. There are no host permissions and no telemetry — the extension never sees the pages the user is browsing.

Under the hood the code is split into small, single-responsibility classes (`ReminderManager`, `AlarmService`, `AlertWindowFactory`) wired together in a service worker. Pure helpers are factored into `src/lib/` and unit-tested with Vitest, and a GitHub Actions workflow handles semantic-version bumps and releases automatically from Conventional Commits.
