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
  // Otwórz alert window
  const alertUrl = chrome.runtime.getURL('alert.html?text=' + encodeURIComponent(reminder.text));

  chrome.windows.create({
    url: alertUrl,
    type: 'popup',
    width: 550,
    height: 350,
    focused: true
  }, (window) => {
    if (chrome.runtime.lastError) {
      console.error('Window error:', chrome.runtime.lastError.message);
    } else {
      console.log('Alert window opened:', window.id);
    }
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
