import { describe, it, expect } from 'vitest';
import {
  calculateDelayInMinutes,
  buildAlarmName,
  parseAlarmName,
  validateReminderInput,
  buildAlertUrl,
  formatDatetimeLocal,
  sortRemindersByTimestamp
} from '../src/lib/reminderUtils.js';

describe('calculateDelayInMinutes', () => {
  it('returns the exact delay in minutes when comfortably in the future', () => {
    const now = 1_700_000_000_000;
    const tenMinutesLater = now + 10 * 60 * 1000;
    expect(calculateDelayInMinutes(tenMinutesLater, now)).toBe(10);
  });

  it('clamps delays below one minute up to the Chrome minimum of 1', () => {
    const now = 1_700_000_000_000;
    expect(calculateDelayInMinutes(now + 5_000, now)).toBe(1);
    expect(calculateDelayInMinutes(now - 60_000, now)).toBe(1);
  });
});

describe('buildAlarmName / parseAlarmName', () => {
  it('round-trips a numeric reminder id', () => {
    const id = 1_700_000_001_234;
    expect(buildAlarmName(id)).toBe(`reminder-${id}`);
    expect(parseAlarmName(buildAlarmName(id))).toBe(id);
  });

  it('returns NaN when given an unrecognised alarm name', () => {
    expect(parseAlarmName('not-a-reminder')).toBeNaN();
    expect(parseAlarmName(null)).toBeNaN();
    expect(parseAlarmName(undefined)).toBeNaN();
  });
});

describe('validateReminderInput', () => {
  const now = new Date('2026-05-17T12:00:00Z').getTime();

  it('rejects empty text', () => {
    const result = validateReminderInput('   ', '2026-05-17T13:00:00Z', now);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/fill in all fields/i);
  });

  it('rejects a missing date', () => {
    const result = validateReminderInput('Take pills', '', now);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/fill in all fields/i);
  });

  it('rejects timestamps in the past', () => {
    const past = '2026-05-17T11:00:00Z';
    const result = validateReminderInput('Meeting', past, now);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/future/i);
  });

  it('rejects malformed dates', () => {
    const result = validateReminderInput('Meeting', 'not-a-date', now);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/invalid date/i);
  });

  it('accepts a future date and trims the text', () => {
    const future = '2026-05-17T13:00:00Z';
    const result = validateReminderInput('  Buy milk  ', future, now);
    expect(result.valid).toBe(true);
    expect(result.text).toBe('Buy milk');
    expect(result.timestamp).toBe(new Date(future).getTime());
  });
});

describe('buildAlertUrl', () => {
  it('URL-encodes the text parameter', () => {
    const url = buildAlertUrl('chrome-extension://abc/alert.html', 'Take pills & water');
    expect(url).toBe('chrome-extension://abc/alert.html?text=Take%20pills%20%26%20water');
  });

  it('treats nullish text as an empty string', () => {
    expect(buildAlertUrl('https://example/alert', null)).toBe('https://example/alert?text=');
  });
});

describe('formatDatetimeLocal', () => {
  it('pads single-digit month/day/hour/minute values', () => {
    const ref = new Date(2026, 0, 2, 3, 4); // local time, Jan 2 2026 03:04
    expect(formatDatetimeLocal(ref, 0)).toBe('2026-01-02T03:04');
  });

  it('applies the offset in minutes', () => {
    const ref = new Date(2026, 4, 17, 10, 30); // local May 17 2026 10:30
    expect(formatDatetimeLocal(ref, 2)).toBe('2026-05-17T10:32');
  });
});

describe('sortRemindersByTimestamp', () => {
  it('returns a new array sorted ascending by timestamp', () => {
    const input = [
      { id: 1, timestamp: 30 },
      { id: 2, timestamp: 10 },
      { id: 3, timestamp: 20 }
    ];
    const sorted = sortRemindersByTimestamp(input);
    expect(sorted.map((r) => r.id)).toEqual([2, 3, 1]);
    expect(input.map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it('returns an empty array when given a non-array input', () => {
    expect(sortRemindersByTimestamp(null)).toEqual([]);
    expect(sortRemindersByTimestamp(undefined)).toEqual([]);
  });
});
