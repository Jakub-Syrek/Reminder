/**
 * Pure utility functions for reminder scheduling.
 * Extracted from popup/background controllers so they can be unit-tested
 * without depending on the `chrome.*` extension APIs or the DOM.
 *
 * @module reminderUtils
 */

const MS_PER_MINUTE = 60 * 1000;
const MIN_ALARM_DELAY_MINUTES = 1;

/**
 * Calculate the delay (in minutes) between now and a target timestamp.
 * The Chrome alarms API does not accept delays below 1 minute, so this
 * helper clamps the result.
 *
 * @description Convert an absolute future timestamp into a `delayInMinutes`
 *   value suitable for `chrome.alarms.create`.
 * @param {number} timestamp - Future timestamp in milliseconds since epoch.
 * @param {number} [now=Date.now()] - Reference "now" timestamp (injectable for tests).
 * @returns {number} Delay in minutes, never below {@link MIN_ALARM_DELAY_MINUTES}.
 */
export function calculateDelayInMinutes(timestamp, now = Date.now()) {
  const delayMs = timestamp - now;
  return Math.max(delayMs / MS_PER_MINUTE, MIN_ALARM_DELAY_MINUTES);
}

/**
 * Build the alarm name used internally to map a reminder to its alarm.
 *
 * @description Compose the canonical alarm name for a reminder id.
 * @param {number|string} reminderId - Unique reminder identifier.
 * @returns {string} Alarm name in the `reminder-<id>` form.
 */
export function buildAlarmName(reminderId) {
  return `reminder-${reminderId}`;
}

/**
 * Parse a reminder id back out of an alarm name produced by {@link buildAlarmName}.
 *
 * @description Reverse of {@link buildAlarmName}. Returns `NaN` when the
 *   alarm name does not follow the expected prefix.
 * @param {string} alarmName - Alarm name string produced by buildAlarmName.
 * @returns {number} Numeric reminder id, or `NaN` if it cannot be parsed.
 */
export function parseAlarmName(alarmName) {
  if (typeof alarmName !== 'string' || !alarmName.startsWith('reminder-')) {
    return NaN;
  }
  return Number.parseInt(alarmName.replace('reminder-', ''), 10);
}

/**
 * Validate the user-supplied reminder text and target date string.
 *
 * @description Trim text and ensure the timestamp lies strictly in the future.
 * @param {string} text - Raw reminder text from the form.
 * @param {string|number|Date} date - Datetime-local value or timestamp.
 * @param {number} [now=Date.now()] - Reference "now" timestamp (injectable for tests).
 * @returns {{ valid: boolean, error?: string, text?: string, timestamp?: number }}
 *   Validation result with normalised values when valid.
 */
export function validateReminderInput(text, date, now = Date.now()) {
  const trimmed = typeof text === 'string' ? text.trim() : '';
  if (!trimmed) {
    return { valid: false, error: 'Please fill in all fields' };
  }
  if (date === undefined || date === null || date === '') {
    return { valid: false, error: 'Please fill in all fields' };
  }
  const timestamp = date instanceof Date ? date.getTime() : new Date(date).getTime();
  if (Number.isNaN(timestamp)) {
    return { valid: false, error: 'Invalid date' };
  }
  if (timestamp <= now) {
    return { valid: false, error: 'Please select a date in the future' };
  }
  return { valid: true, text: trimmed, timestamp };
}

/**
 * Build the URL used by the alert window to display reminder text.
 *
 * @description Encode the text into a query string parameter so the
 *   alert page can render it without inline scripts.
 * @param {string} baseUrl - Base URL to the alert page (without query string).
 * @param {string} text - Reminder text to encode.
 * @returns {string} Full alert URL with the `text` query parameter populated.
 */
export function buildAlertUrl(baseUrl, text) {
  const encoded = encodeURIComponent(text ?? '');
  return `${baseUrl}?text=${encoded}`;
}

/**
 * Format a default datetime-local string for "now + N minutes".
 *
 * @description Produce a string in the `YYYY-MM-DDTHH:mm` format that
 *   `<input type="datetime-local">` accepts, using local time.
 * @param {Date} reference - Reference date (typically `new Date()`).
 * @param {number} [offsetMinutes=2] - Minutes to add to the reference.
 * @returns {string} Datetime-local formatted string in local time.
 */
export function formatDatetimeLocal(reference, offsetMinutes = 2) {
  const target = new Date(reference.getTime() + offsetMinutes * MS_PER_MINUTE);
  const pad = (n) => String(n).padStart(2, '0');
  const year = target.getFullYear();
  const month = pad(target.getMonth() + 1);
  const day = pad(target.getDate());
  const hours = pad(target.getHours());
  const minutes = pad(target.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Sort an array of reminders by ascending timestamp without mutating the input.
 *
 * @description Pure sort helper used by the popup to render upcoming reminders first.
 * @param {Array<{timestamp:number}>} reminders - Reminder list to sort.
 * @returns {Array<{timestamp:number}>} New array sorted ascending by timestamp.
 */
export function sortRemindersByTimestamp(reminders) {
  if (!Array.isArray(reminders)) {
    return [];
  }
  return [...reminders].sort((a, b) => a.timestamp - b.timestamp);
}
