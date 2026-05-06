# Reminder Extension

A professional Chrome/Brave extension for managing reminders with beautiful alert notifications. Built with design patterns, SOLID principles, and modern JavaScript architecture.

## Features

- ✅ **Add Reminders** - Create reminders with text and date/time
- ✅ **Beautiful Alerts** - Elegant popup notifications when reminders trigger
- ✅ **Cloud Sync** - Reminders sync across devices (requires Chrome sign-in)
- ✅ **Automatic Cleanup** - Reminders auto-delete after notification
- ✅ **Responsive UI** - Clean, intuitive interface
- ✅ **Professional Architecture** - Built with design patterns and SOLID principles

## Architecture

### Design Patterns

- **Factory Pattern** - `AlertWindowFactory` encapsulates window creation logic
- **Observer Pattern** - `AlarmService` implements event-driven architecture
- **Dependency Injection** - Services accept dependencies for testability
- **Separation of Concerns** - Each class has a single, well-defined responsibility

### SOLID Principles

- **Single Responsibility** - Each class handles one aspect (ReminderManager, AlarmService, PopupController)
- **Open/Closed** - Open for extension (new alert types), closed for modification
- **Liskov Substitution** - Services can be mocked/replaced for testing
- **Interface Segregation** - Minimal, focused public APIs
- **Dependency Inversion** - High-level modules depend on abstractions, not concrete implementations

### Project Structure

```
reminder-extension/
├── manifest.json              # Extension configuration
├── popup.html                 # Popup UI
├── alert.html                 # Alert window UI
├── alert.js                   # Alert window logic
├── styles.css                 # Global styles
├── images/                    # Extension icons
└── src/                       # Main application code
    ├── background.js          # Service Worker entry point
    ├── popup.js               # Popup controller (MVC)
    ├── ReminderManager.js     # Reminder business logic
    ├── AlarmService.js        # Alarm management
    └── AlertWindowFactory.js  # Window creation factory
```

## Installation

### Chrome / Brave

1. Open browser → `chrome://extensions/` (or `brave://extensions/`)
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `reminder-extension` folder
5. Extension icon will appear in toolbar

## Usage

### Creating a Reminder

1. Click extension icon in toolbar
2. Enter reminder text
3. Select date and time
4. Click **Add Reminder**

### Notification

When reminder time arrives:
- Beautiful popup alert appears
- Shows the reminder text
- Click **OK** to close
- Auto-closes after 30 seconds

### Managing Reminders

- **View** - All scheduled reminders listed with dates
- **Delete** - Click **Delete** button next to any reminder

## Class Documentation

### ReminderManager

Manages reminder storage operations. Implements SOLID's Single Responsibility Principle.

```javascript
const manager = new ReminderManager(chrome.storage.sync);
await manager.addReminder("Buy milk", Date.now() + 3600000);
```

**Methods:**
- `addReminder(text, timestamp)` - Add new reminder
- `getReminders()` - Get all reminders
- `deleteReminder(id)` - Delete reminder by ID
- `findReminder(id)` - Find reminder by ID

### AlarmService

Manages Chrome alarms and implements Observer Pattern for event handling.

```javascript
const service = new AlarmService(reminderManager);
service.onAlarmTriggered(async (reminder) => {
  console.log('Reminder triggered:', reminder.text);
});
```

**Methods:**
- `createAlarm(reminder)` - Create alarm for reminder
- `onAlarmTriggered(callback)` - Register alarm trigger callback
- `clearAlarm(reminderId)` - Clear alarm

### AlertWindowFactory

Factory for creating alert windows. Encapsulates popup creation logic.

```javascript
const windowId = await AlertWindowFactory.createAlertWindow(reminder);
```

**Methods:**
- `createAlertWindow(reminder)` - Create alert window for reminder

### PopupController

Manages popup UI and user interactions. Implements MVC pattern separation.

```javascript
// Automatically initializes when popup loads
const controller = new PopupController();
```

**Methods:**
- Internal UI management (private methods for better encapsulation)

## Technology Stack

- **JavaScript** - ES6+ with async/await
- **Chrome Extension API** - Manifest V3
- **CSS3** - Modern styling with flexbox
- **Chrome Storage API** - Cloud synchronization

## Development

### Requirements

- Chrome or Brave browser
- Node.js (optional, for development tools)

### Running Tests

Tests can be added for each service class:

```javascript
// Example test for ReminderManager
const manager = new ReminderManager(mockStorage);
const reminder = await manager.addReminder("Test", Date.now());
assert(reminder.id > 0);
```

### Code Style

- Use clear, descriptive variable names
- Add JSDoc comments for public methods
- Keep functions small and focused (Single Responsibility)
- Dependency injection for flexibility

## Future Enhancements

- [ ] Recurring reminders
- [ ] Notification sounds/vibration
- [ ] Dark mode
- [ ] Categories/tags
- [ ] Backup/export reminders
- [ ] Settings page
- [ ] Unit tests
- [ ] E2E tests

## Browser Support

- ✅ Chrome 90+
- ✅ Brave (Chromium-based)
- ✅ Edge (Chromium-based)
- ✅ Any Chromium browser with Manifest V3 support

## Known Limitations

- Reminders are deleted after notification appears
- System notifications may require permission in Windows settings
- Manifest V3 requires CSP-compliant code (no inline scripts)

## License

This project is open source and available for personal use.

## Contributing

Improvements and contributions are welcome. Please maintain:
- Design patterns and SOLID principles
- English documentation
- Professional code style
- Clear commit messages

---

Built with ❤️ using modern JavaScript and design principles.
