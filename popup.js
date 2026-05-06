document.addEventListener('DOMContentLoaded', () => {
  loadReminders();

  const addBtn = document.getElementById('addBtn');
  const reminderText = document.getElementById('reminderText');
  const reminderDate = document.getElementById('reminderDate');

  addBtn.addEventListener('click', addReminder);
});

function addReminder() {
  const text = reminderText.value.trim();
  const date = reminderDate.value;

  if (!text || !date) {
    alert('Please fill in all fields');
    return;
  }

  const reminderTime = new Date(date).getTime();
  const now = new Date().getTime();

  if (reminderTime <= now) {
    alert('Please select a date in the future');
    return;
  }

  const reminder = {
    id: Date.now(),
    text: text,
    date: date,
    timestamp: reminderTime
  };

  chrome.storage.sync.get('reminders', (data) => {
    const reminders = data.reminders || [];
    reminders.push(reminder);
    chrome.storage.sync.set({ reminders: reminders }, () => {
      reminderText.value = '';
      reminderDate.value = '';
      loadReminders();
      setupAlarm(reminder);
    });
  });
}

function loadReminders() {
  chrome.storage.sync.get('reminders', (data) => {
    const reminders = (data.reminders || []).sort((a, b) => a.timestamp - b.timestamp);
    const remindersList = document.getElementById('remindersList');
    const emptyMessage = document.getElementById('emptyMessage');

    remindersList.innerHTML = '';

    if (reminders.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    emptyMessage.style.display = 'none';

    reminders.forEach((reminder) => {
      const li = document.createElement('li');
      li.className = 'reminder-item';

      const date = new Date(reminder.date);
      const formattedDate = date.toLocaleString('en-US');

      li.innerHTML = `
        <div class="reminder-content">
          <div class="reminder-text">${escapeHtml(reminder.text)}</div>
          <div class="reminder-date">${formattedDate}</div>
        </div>
        <button class="reminder-delete" data-id="${reminder.id}">Delete</button>
      `;

      li.querySelector('.reminder-delete').addEventListener('click', () => {
        deleteReminder(reminder.id);
      });

      remindersList.appendChild(li);
    });
  });
}

function deleteReminder(id) {
  chrome.storage.sync.get('reminders', (data) => {
    const reminders = (data.reminders || []).filter(r => r.id !== id);
    chrome.storage.sync.set({ reminders: reminders }, () => {
      loadReminders();
      chrome.alarms.clear(`reminder-${id}`);
    });
  });
}

function setupAlarm(reminder) {
  const alarmName = `reminder-${reminder.id}`;
  const alarmTime = new Date(reminder.date).getTime();
  const delayInMinutes = (alarmTime - new Date().getTime()) / (1000 * 60);

  chrome.alarms.create(alarmName, { delayInMinutes: delayInMinutes });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
