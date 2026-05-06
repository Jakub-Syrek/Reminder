/**
 * ReminderManager - Manages reminder storage and retrieval (Single Responsibility)
 * Implements dependency injection for flexibility
 */
class ReminderManager {
  constructor(storage = chrome.storage.sync) {
    this.storage = storage;
  }

  /**
   * Add a new reminder
   * @param {string} text - Reminder text
   * @param {number} timestamp - Reminder timestamp in milliseconds
   * @returns {Promise<Object>} Created reminder object
   */
  async addReminder(text, timestamp) {
    if (!text || !timestamp) {
      throw new Error('Text and timestamp are required');
    }

    const reminder = {
      id: Date.now(),
      text,
      timestamp,
      createdAt: new Date().toISOString()
    };

    const reminders = await this.getReminders();
    reminders.push(reminder);

    return new Promise((resolve, reject) => {
      this.storage.set({ reminders }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(reminder);
        }
      });
    });
  }

  /**
   * Get all reminders
   * @returns {Promise<Array>} Array of reminders
   */
  async getReminders() {
    return new Promise((resolve) => {
      this.storage.get('reminders', (data) => {
        resolve(data.reminders || []);
      });
    });
  }

  /**
   * Delete reminder by ID
   * @param {number} id - Reminder ID
   * @returns {Promise<void>}
   */
  async deleteReminder(id) {
    const reminders = await this.getReminders();
    const filtered = reminders.filter(r => r.id !== id);

    return new Promise((resolve, reject) => {
      this.storage.set({ reminders: filtered }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Find reminder by ID
   * @param {number} id - Reminder ID
   * @returns {Promise<Object|null>} Reminder object or null
   */
  async findReminder(id) {
    const reminders = await this.getReminders();
    return reminders.find(r => r.id === id) || null;
  }
}
