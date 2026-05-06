/**
 * AlertWindowFactory - Creates and manages alert windows (Factory Pattern)
 * Implements Open/Closed Principle (open for extension, closed for modification)
 */
class AlertWindowFactory {
  static DEFAULT_WIDTH = 550;
  static DEFAULT_HEIGHT = 350;
  static DEFAULT_TYPE = 'popup';

  /**
   * Create and open an alert window for a reminder
   * @param {Object} reminder - Reminder object
   * @returns {Promise<number>} Window ID
   */
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

  /**
   * Build alert URL with reminder text parameter
   * @param {string} text - Reminder text
   * @returns {string} Alert URL
   */
  static buildAlertUrl(text) {
    const encodedText = encodeURIComponent(text);
    return chrome.runtime.getURL(`alert.html?text=${encodedText}`);
  }
}
