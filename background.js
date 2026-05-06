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
  chrome.notifications.create(`reminder-${reminder.id}`, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('images/icon-128.png'),
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
