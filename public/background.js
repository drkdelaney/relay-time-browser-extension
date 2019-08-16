/* global browser */

const TIME_SHEET_REMINDER = 'TIME_SHEET_REMINDER';
const NOTIFICATION_DAY = 5;

const defaultTasks = [];
const defaultDefaults = [
    { day: 'Mon', value: '8', checked: true },
    { day: 'Tue', value: '8', checked: true },
    { day: 'Wed', value: '8', checked: true },
    { day: 'Thu', value: '8', checked: true },
    { day: 'Fri', value: '8', checked: true },
    { day: 'Sat', value: '0', checked: true },
    { day: 'Sun', value: '0', checked: true },
];
const defaultNotifications = true;
const defaultNotificationTime = '11:00';

browser.runtime.onInstalled.addListener(({ reason }) => {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (tab.url.match('ppm-nike.saas.microfocus.com')) {
            browser.pageAction.show(tabId);
        } else {
            browser.pageAction.hide(tabId);
        }
    });

    if (reason === 'install') {
        browser.storage.sync.get('tasks').then(results => {
            if (!results || !Array.isArray(results.tasks)) {
                browser.storage.sync.set({
                    tasks: defaultTasks,
                    defaultDays: defaultDefaults,
                    notifications: defaultNotifications,
                    notificationTime: defaultNotificationTime,
                });
            }
        }).catch(() => {
            browser.storage.sync.set({
                tasks: defaultTasks,
                defaultDays: defaultDefaults,
                notifications: defaultNotifications,
                notificationTime: defaultNotificationTime,
            });
        });
        browser.runtime.openOptionsPage();
    } else if (reason === 'update') {
        browser.alarms.clearAll();
    }
    browser.storage.sync.get('notificationTime').then(({ notificationTime }) => {
        if (notificationTime) {
            const [hour, minute] = notificationTime.split(':');
            createWeeklyAlarm(NOTIFICATION_DAY, hour, minute);
        } else {
            createWeeklyAlarm(NOTIFICATION_DAY, 11);
        }
    });
});

browser.pageAction.onClicked.addListener();

browser.alarms.onAlarm.addListener(alarm => {
    showNotification();
});

browser.notifications.onClicked.addListener(notificationId => {
    goToRelay();
    browser.notifications.clear(notificationId);
});

browser.notifications.onClosed.addListener((notificationId, byUser) => {
    browser.notifications.clear(notificationId);
});

browser.storage.onChanged.addListener(
    ({ notificationTime = {}, notifications = {} }) => {
        if (notificationTime.newValue) {
            browser.alarms.clearAll();
            const [hour, minute] = notificationTime.newValue.split(':');
            createWeeklyAlarm(NOTIFICATION_DAY, hour, minute);
        }
        if (notifications.newValue === false) {
            browser.alarms.clearAll();
        }
    }
);

function createWeeklyAlarm(day, hour, minute = 0) {
    browser.alarms.create(TIME_SHEET_REMINDER, {
        periodInMinutes: 10080,
        when: nextOccurrenceOfDayAndTime(day, hour, minute).getTime(),
    });
}

function goToRelay() {
    browser.tabs.create({ url: 'https://ppm-nike.saas.microfocus.com/' });
}

function showNotification() {
    const notificationOptions = {
        type: 'basic',
        iconUrl: 'images/relay_time_icon128.png',
        title: 'Relay Time!',
        message: "Don't forget to submit your time sheet!",
        requireInteraction: true,
    };
    browser.notifications.create('reminder', notificationOptions);
}

function nextOccurrenceOfDayAndTime(dayOfWeek, hour, minute) {
    let now = new Date();
    let result = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + ((dayOfWeek - now.getDay()) % 7),
        hour,
        minute
    );

    if (result < now) result.setDate(result.getDate() + 7);

    return result;
}
