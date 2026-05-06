// Pobierz tekst przypomnienia z URL parametru
const params = new URLSearchParams(window.location.search);
const reminderText = params.get('text') || 'Reminder!';

document.getElementById('reminderText').textContent = reminderText;

document.getElementById('okBtn').addEventListener('click', () => {
  window.close();
});

// Automatycznie zamknij po 30 sekundach
setTimeout(() => {
  window.close();
}, 30000);
