/**
 * Alert Window Script
 * Displays reminder text from URL parameter
 */

// Extract reminder text from URL parameter
const params = new URLSearchParams(window.location.search);
const reminderText = params.get('text') || 'Reminder!';

// Display reminder text in the alert container
document.getElementById('reminderText').textContent = reminderText;

// Handle OK button click
document.getElementById('okBtn').addEventListener('click', () => {
  window.close();
});

// Auto-close alert after 30 seconds
setTimeout(() => {
  window.close();
}, 30000);
