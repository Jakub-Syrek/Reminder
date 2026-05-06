/**
 * Popup Controller - Manages popup UI and user interactions
 * Implements Separation of Concerns (UI logic separated from business logic)
 */

class PopupController {
  constructor() {
    this.reminderManager = new ReminderManager(chrome.storage.sync);
    this.alarmService = new AlarmService(this.reminderManager);
    this.setupEventListeners();
    this.setDefaultValues();
    this.loadReminders();
  }

  /**
   * Set default values for form inputs
   * Default text: "Alert!"
   * Default time: 2 minutes from now
   * @private
   */
  setDefaultValues() {
    const textElement = document.getElementById('reminderText');
    const dateElement = document.getElementById('reminderDate');

    if (textElement) {
      textElement.value = 'Alert!';
    }

    if (dateElement) {
      // Set to 2 minutes from now
      const now = new Date();
      const twoMinutesLater = new Date(now.getTime() + 2 * 60 * 1000);

      // Format: YYYY-MM-DDTHH:mm
      const year = twoMinutesLater.getFullYear();
      const month = String(twoMinutesLater.getMonth() + 1).padStart(2, '0');
      const day = String(twoMinutesLater.getDate()).padStart(2, '0');
      const hours = String(twoMinutesLater.getHours()).padStart(2, '0');
      const minutes = String(twoMinutesLater.getMinutes()).padStart(2, '0');

      dateElement.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  }

  /**
   * Setup event listeners for form
   * @private
   */
  setupEventListeners() {
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.handleAddReminder());
    }
  }

  /**
   * Handle add reminder button click
   * @private
   */
  async handleAddReminder() {
    const textElement = document.getElementById('reminderText');
    const dateElement = document.getElementById('reminderDate');

    const text = textElement?.value?.trim();
    const date = dateElement?.value;

    if (!text || !date) {
      this.showError('Please fill in all fields');
      return;
    }

    const timestamp = new Date(date).getTime();
    const now = new Date().getTime();

    if (timestamp <= now) {
      this.showError('Please select a date in the future');
      return;
    }

    try {
      // Add reminder to storage
      const reminder = await this.reminderManager.addReminder(text, timestamp);

      // Create alarm
      await this.alarmService.createAlarm(reminder);

      // Clear form and reload list
      textElement.value = '';
      dateElement.value = '';
      await this.loadReminders();

      console.log(`Reminder added: ${reminder.id}`);
    } catch (error) {
      this.showError('Error adding reminder: ' + error.message);
    }
  }

  /**
   * Load and display reminders
   * @private
   */
  async loadReminders() {
    try {
      const reminders = await this.reminderManager.getReminders();
      this.displayReminders(reminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  }

  /**
   * Display reminders in UI
   * @param {Array} reminders - Array of reminders
   * @private
   */
  displayReminders(reminders) {
    const remindersList = document.getElementById('remindersList');
    const emptyMessage = document.getElementById('emptyMessage');

    if (!remindersList) return;

    remindersList.innerHTML = '';

    if (reminders.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    // Sort by timestamp ascending
    const sorted = [...reminders].sort((a, b) => a.timestamp - b.timestamp);

    sorted.forEach((reminder) => {
      const li = this.createReminderElement(reminder);
      remindersList.appendChild(li);
    });
  }

  /**
   * Create reminder list item element
   * @param {Object} reminder - Reminder object
   * @returns {HTMLElement} List item element
   * @private
   */
  createReminderElement(reminder) {
    const li = document.createElement('li');
    li.className = 'reminder-item';

    const date = new Date(reminder.timestamp);
    const formattedDate = date.toLocaleString('en-US');

    const content = document.createElement('div');
    content.className = 'reminder-content';

    const text = document.createElement('div');
    text.className = 'reminder-text';
    text.textContent = reminder.text;

    const dateEl = document.createElement('div');
    dateEl.className = 'reminder-date';
    dateEl.textContent = formattedDate;

    content.appendChild(text);
    content.appendChild(dateEl);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'reminder-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => this.handleDeleteReminder(reminder.id));

    li.appendChild(content);
    li.appendChild(deleteBtn);

    return li;
  }

  /**
   * Handle delete reminder
   * @param {number} reminderId - Reminder ID
   * @private
   */
  async handleDeleteReminder(reminderId) {
    try {
      await this.reminderManager.deleteReminder(reminderId);
      await this.alarmService.clearAlarm(reminderId);
      await this.loadReminders();
      console.log(`Reminder deleted: ${reminderId}`);
    } catch (error) {
      this.showError('Error deleting reminder: ' + error.message);
    }
  }

  /**
   * Show error message to user
   * @param {string} message - Error message
   * @private
   */
  showError(message) {
    alert(message);
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
