/*global chrome*/

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

chrome.runtime.onInstalled.addListener(function({ reason }) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: 'ppm-nike.saas.microfocus.com' },
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
    if (reason === 'install') {
        chrome.runtime.openOptionsPage();
        chrome.storage.sync.set({
            tasks: defaultTasks,
            defaultDays: defaultDefaults,
            notifications: defaultNotifications,
            notificationTime: defaultNotificationTime,
        });
    } else if (reason === 'update') {
        chrome.alarms.clearAll();
    }
    chrome.storage.sync.get(['notificationTime'], ({ notificationTime }) => {
        if (notificationTime) {
            const [hour, minute] = notificationTime.split(':');
            createWeeklyAlarm(NOTIFICATION_DAY, hour, minute);
        } else {
            createWeeklyAlarm(NOTIFICATION_DAY, 11);
        }
    });
});

chrome.alarms.onAlarm.addListener(alarm => {
    showNotification();
});

chrome.notifications.onClicked.addListener(() => {
    goToRelay();
});

chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    chrome.notifications.clear(notificationId);
});

chrome.storage.onChanged.addListener(
    ({ notificationTime = {}, notifications = {} }) => {
        if (notificationTime.newValue) {
            chrome.alarms.clearAll();
            const [hour, minute] = notificationTime.newValue.split(':');
            createWeeklyAlarm(NOTIFICATION_DAY, hour, minute);
        }
        if (notifications.newValue === false) {
            chrome.alarms.clearAll();
        }
    }
);

function createWeeklyAlarm(day, hour, minute = 0) {
    chrome.alarms.create(TIME_SHEET_REMINDER, {
        periodInMinutes: 10080,
        when: nextOccurrenceOfDayAndTime(day, hour, minute).getTime(),
    });
}

function goToRelay() {
    chrome.tabs.create({ url: 'https://ppm-nike.saas.microfocus.com/' });
}

function showNotification() {
    const notificationOptions = {
        type: 'basic',
        iconUrl: 'images/relay_time_icon128.png',
        title: 'Relay Time!',
        message: "Don't forget to submit your time sheet!",
        requireInteraction: true,
    };
    chrome.notifications.create('reminder', notificationOptions);
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
