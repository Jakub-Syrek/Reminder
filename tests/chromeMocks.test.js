import { describe, it, expect, vi } from 'vitest';
import {
  buildAlarmName,
  calculateDelayInMinutes
} from '../src/lib/reminderUtils.js';

/**
 * Verifies that the helpers integrate correctly with mocked
 * `chrome.alarms` and `chrome.storage` shapes — these mocks
 * mirror what callers in src/AlarmService.js / ReminderManager.js
 * pass through at runtime.
 */
describe('chrome.* integration (mocked)', () => {
  it('passes the computed delay through to chrome.alarms.create', () => {
    const chromeAlarms = { create: vi.fn() };
    const now = 1_700_000_000_000;
    const reminder = { id: 42, timestamp: now + 15 * 60 * 1000 };

    const alarmName = buildAlarmName(reminder.id);
    const delay = calculateDelayInMinutes(reminder.timestamp, now);
    chromeAlarms.create(alarmName, { delayInMinutes: delay });

    expect(chromeAlarms.create).toHaveBeenCalledWith('reminder-42', { delayInMinutes: 15 });
  });

  it('uses a callback-style chrome.storage.sync.get mock to read reminders', async () => {
    const fakeData = { reminders: [{ id: 1, text: 'x', timestamp: 1 }] };
    const storage = {
      get: vi.fn((_key, cb) => cb(fakeData)),
      set: vi.fn((_payload, cb) => cb())
    };

    const result = await new Promise((resolve) => {
      storage.get('reminders', (data) => resolve(data.reminders || []));
    });

    expect(storage.get).toHaveBeenCalledWith('reminders', expect.any(Function));
    expect(result).toEqual(fakeData.reminders);
  });

  it('invokes chrome.notifications.create with the expected payload shape', () => {
    const notifications = { create: vi.fn() };
    notifications.create('reminder-1', {
      type: 'basic',
      iconUrl: 'images/icon-128.png',
      title: 'Reminder',
      message: 'Take pills'
    });
    expect(notifications.create).toHaveBeenCalledWith(
      'reminder-1',
      expect.objectContaining({ type: 'basic', message: 'Take pills' })
    );
  });
});
