chrome.alarms.onAlarm.addListener((alarm) => {
  const reminderId = alarm.name.replace('reminder-', '');

  chrome.storage.sync.get('reminders', (data) => {
    const reminders = data.reminders || [];
    const reminder = reminders.find(r => r.id === parseInt(reminderId));

    if (reminder) {
      showNotification(reminder);
      deleteReminder(parseInt(reminderId));
    }
  });
});

function showNotification(reminder) {
  const iconUrl = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect fill="%23007bff" width="128" height="128" rx="24"/><text x="64" y="80" font-size="60" font-weight="bold" text-anchor="middle" fill="white">R</text></svg>';

  chrome.notifications.create(`reminder-${reminder.id}`, {
    type: 'basic',
    iconUrl: iconUrl,
    title: 'Reminder',
    message: reminder.text,
    priority: 2
  }, (notificationId) => {
    console.log('Notification created:', notificationId);
  });
}

function deleteReminder(id) {
  chrome.storage.sync.get('reminders', (data) => {
    const reminders = (data.reminders || []).filter(r => r.id !== id);
    chrome.storage.sync.set({ reminders: reminders });
  });
}

chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.windows.getLastFocused((window) => {
    chrome.tabs.query({ windowId: window.id }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { active: true });
    });
  });
});
