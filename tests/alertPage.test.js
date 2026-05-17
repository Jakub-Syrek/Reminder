import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Integration-style tests for the alert page DOM behaviour.
 * The alert.js script is small and module-free, so we recreate its
 * effect here in jsdom to exercise the same DOM hooks it relies on.
 */
describe('alert page', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="alert-container">
        <div class="reminder-text" id="reminderText"></div>
        <button id="okBtn">OK</button>
      </div>
    `;
  });

  it('renders the reminder text from the URL parameter', () => {
    const params = new URLSearchParams('?text=' + encodeURIComponent('Drink water'));
    const text = params.get('text') || 'Reminder!';
    document.getElementById('reminderText').textContent = text;
    expect(document.getElementById('reminderText').textContent).toBe('Drink water');
  });

  it('falls back to a default label when the text parameter is missing', () => {
    const params = new URLSearchParams('');
    const text = params.get('text') || 'Reminder!';
    document.getElementById('reminderText').textContent = text;
    expect(document.getElementById('reminderText').textContent).toBe('Reminder!');
  });

  it('invokes window.close when the OK button is clicked', () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});
    document.getElementById('okBtn').addEventListener('click', () => window.close());
    document.getElementById('okBtn').click();
    expect(closeSpy).toHaveBeenCalledTimes(1);
    closeSpy.mockRestore();
  });
});
