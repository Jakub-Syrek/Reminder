# Reminder Extension

A Chrome extension for managing reminders with desktop notifications.

## Features

- ✅ Add new reminders with text and date/time
- ✅ Cloud storage (syncs across devices)
- ✅ Desktop notifications at scheduled time
- ✅ Delete reminders
- ✅ Sorted by date

## Installation

### Steps:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right corner)
3. Click "Load unpacked"
4. Select the folder with this project
5. Done! The icon will appear in your toolbar

## Project Structure

- `manifest.json` - Extension configuration
- `popup.html` - User interface
- `popup.js` - Popup logic
- `background.js` - Service Worker handling alarms and notifications
- `styles.css` - Styling

## Usage

1. Click the extension icon in your toolbar
2. Enter reminder text
3. Select date and time
4. Click "Add Reminder"
5. You'll receive a notification at the scheduled time

## Notes

- Reminders are synced across all devices (requires Chrome sign-in)
- You can have unlimited reminders
- After notification is shown, the reminder is automatically deleted
