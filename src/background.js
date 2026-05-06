/**
 * Background Service Worker
 * Entry point for reminder extension
 * Implements Dependency Injection for testability
 */

// Initialize services
const reminderManager = new ReminderManager(chrome.storage.sync);
const alarmService = new AlarmService(reminderManager);

// Setup event listeners
alarmService.onAlarmTriggered(handleReminderTriggered);

/**
 * Handle when reminder alarm is triggered
 * @param {Object} reminder - Triggered reminder
 */
async function handleReminderTriggered(reminder) {
  try {
    // Show alert window
    await AlertWindowFactory.createAlertWindow(reminder);

    // Delete reminder after showing
    await reminderManager.deleteReminder(reminder.id);

    console.log(`Reminder triggered and deleted: ${reminder.id}`);
  } catch (error) {
    console.error('Error handling reminder:', error);
  }
}
