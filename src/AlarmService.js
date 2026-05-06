/**
 * AlarmService - Manages Chrome alarms and notification triggers
 * Implements Observer Pattern (alarms as events)
 */
class AlarmService {
  constructor(reminderManager) {
    this.reminderManager = reminderManager;
    this.listeners = [];
  }

  /**
   * Create an alarm for a reminder
   * @param {Object} reminder - Reminder object with timestamp
   * @returns {Promise<void>}
   */
  async createAlarm(reminder) {
    if (!reminder || !reminder.timestamp) {
      throw new Error('Invalid reminder: timestamp is required');
    }

    const delayInMinutes = this.calculateDelayInMinutes(reminder.timestamp);
    const alarmName = `reminder-${reminder.id}`;

    return new Promise((resolve) => {
      chrome.alarms.create(alarmName, { delayInMinutes });
      resolve();
    });
  }

  /**
   * Calculate delay in minutes from timestamp
   * @param {number} timestamp - Reminder timestamp in milliseconds
   * @returns {number} Delay in minutes
   */
  calculateDelayInMinutes(timestamp) {
    const now = new Date().getTime();
    const delayMs = timestamp - now;
    return Math.max(delayMs / (1000 * 60), 1); // Minimum 1 minute
  }

  /**
   * Register alarm listener
   * @param {Function} callback - Callback function when alarm triggers
   */
  onAlarmTriggered(callback) {
    this.listeners.push(callback);
    this.setupAlarmListener();
  }

  /**
   * Setup Chrome alarm listener
   * @private
   */
  setupAlarmListener() {
    if (this.listenerSetup) return; // Only setup once

    chrome.alarms.onAlarm.addListener(async (alarm) => {
      const reminderId = parseInt(alarm.name.replace('reminder-', ''));
      const reminder = await this.reminderManager.findReminder(reminderId);

      if (reminder) {
        for (const listener of this.listeners) {
          await listener(reminder);
        }
      }
    });

    this.listenerSetup = true;
  }

  /**
   * Clear alarm
   * @param {number} reminderId - Reminder ID
   * @returns {Promise<void>}
   */
  async clearAlarm(reminderId) {
    return new Promise((resolve) => {
      chrome.alarms.clear(`reminder-${reminderId}`, () => {
        resolve();
      });
    });
  }
}
