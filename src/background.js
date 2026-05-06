/**
 * ReminderManager - Manages reminder storage and retrieval
 */
class ReminderManager {
  constructor(storage = chrome.storage.sync) {
    this.storage = storage;
  }

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

  async getReminders() {
    return new Promise((resolve) => {
      this.storage.get('reminders', (data) => {
        resolve(data.reminders || []);
      });
    });
  }

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

  async findReminder(id) {
    const reminders = await this.getReminders();
    return reminders.find(r => r.id === id) || null;
  }
}

/**
 * AlarmService - Manages Chrome alarms and notification triggers
 */
class AlarmService {
  constructor(reminderManager) {
    this.reminderManager = reminderManager;
    this.listeners = [];
  }

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

  calculateDelayInMinutes(timestamp) {
    const now = new Date().getTime();
    const delayMs = timestamp - now;
    return Math.max(delayMs / (1000 * 60), 1);
  }

  onAlarmTriggered(callback) {
    this.listeners.push(callback);
    this.setupAlarmListener();
  }

  setupAlarmListener() {
    if (this.listenerSetup) return;

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

  async clearAlarm(reminderId) {
    return new Promise((resolve) => {
      chrome.alarms.clear(`reminder-${reminderId}`, () => {
        resolve();
      });
    });
  }
}

/**
 * AlertWindowFactory - Creates alert windows
 */
class AlertWindowFactory {
  static DEFAULT_WIDTH = 550;
  static DEFAULT_HEIGHT = 350;
  static DEFAULT_TYPE = 'popup';

  static async createAlertWindow(reminder) {
    if (!reminder || !reminder.text) {
      throw new Error('Invalid reminder object');
    }

    const url = this.buildAlertUrl(reminder.text);

    return new Promise((resolve, reject) => {
      chrome.windows.create({
        url,
        type: this.DEFAULT_TYPE,
        width: this.DEFAULT_WIDTH,
        height: this.DEFAULT_HEIGHT,
        focused: true
      }, (window) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(window.id);
        }
      });
    });
  }

  static buildAlertUrl(text) {
    const encodedText = encodeURIComponent(text);
    return chrome.runtime.getURL(`alert.html?text=${encodedText}`);
  }
}

/**
 * Background Service Worker - Entry point
 */

const reminderManager = new ReminderManager(chrome.storage.sync);
const alarmService = new AlarmService(reminderManager);

alarmService.onAlarmTriggered(handleReminderTriggered);

async function handleReminderTriggered(reminder) {
  try {
    await AlertWindowFactory.createAlertWindow(reminder);
    await reminderManager.deleteReminder(reminder.id);
    console.log(`Reminder triggered and deleted: ${reminder.id}`);
  } catch (error) {
    console.error('Error handling reminder:', error);
  }
}
