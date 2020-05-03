/* global chrome */

const TIME_SHEET_REMINDER = 'TIME_SHEET_REMINDER';
const NOTIFICATION_DAY = 5;

const defaultTasks = [];
const defaultDefaults = [
    { day: 'Mon', value: '8' },
    { day: 'Tue', value: '8' },
    { day: 'Wed', value: '8' },
    { day: 'Thu', value: '8' },
    { day: 'Fri', value: '8' },
    { day: 'Sat', value: '0' },
    { day: 'Sun', value: '0' },
];
const defaultNotifications = true;
const defaultNotificationTime = '11:00';

chrome.runtime.onInstalled.addListener(({ reason }) => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {
                            hostEquals: 'ppm-nike.saas.microfocus.com',
                        },
                    }),
                ],
                actions: [
                    new chrome.declarativeContent.ShowPageAction(),
                ],
            },
        ]);
    });

    if (reason === 'install') {
        chrome.storage.sync.get('tasks',
            data => {
                if (!data || !Array.isArray(data.tasks)) {
                    chrome.storage.sync.set({
                        tasks: defaultTasks,
                        defaultDays: defaultDefaults,
                        notifications: defaultNotifications,
                        notificationTime: defaultNotificationTime,
                    });
                }
                chrome.runtime.openOptionsPage();
            });
    } else if (reason === 'update') {
        chrome.alarms.clearAll();
        goToWhatsNew();
    }

    chrome.storage.sync.get('notificationTime', ({ notificationTime }) => {
        if (notificationTime) {
            const [hour, minute] = notificationTime.split(':');
            createWeeklyAlarm(NOTIFICATION_DAY, hour, minute);
        } else {
            createWeeklyAlarm(NOTIFICATION_DAY, 11);
        }
    });
});

chrome.contextMenus.create({
    id: 'OPEN_DASHBOARD',
    title: 'Open Dashboard',
    contexts: ['page_action'],
    type: 'normal',
});
chrome.contextMenus.create({
    id: 'SETTINGS',
    title: 'Settings',
    contexts: ['page_action'],
    type: 'normal',
});
chrome.contextMenus.create({
    id: 'WHATS_NEW',
    title: 'What\'s New',
    contexts: ['page_action'],
    type: 'normal',
});
chrome.contextMenus.create({
    id: 'VIEW_SOURCE',
    title: 'View Source',
    contexts: ['page_action'],
    type: 'normal',
});
chrome.contextMenus.onClicked.addListener(info => {
    switch (info.menuItemId) {
        case 'OPEN_DASHBOARD':
            goToDashboard();
            break;
        case 'SETTINGS':
            chrome.runtime.openOptionsPage();
            break;
        case 'WHATS_NEW':
            goToWhatsNew();
            break;
        case 'VIEW_SOURCE':
            goToGithub();
            break;
        default:
            break;
    }
});

chrome.alarms.onAlarm.addListener(alarm => {
    if(alarm.name === TIME_SHEET_REMINDER) {
        showNotification();
    }
});

chrome.notifications.onClicked.addListener(notificationId => {
    goToRelay();
    chrome.notifications.clear(notificationId);
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

function goToDashboard() {
    chrome.tabs.create({ url: 'https://ppm-nike.saas.microfocus.com/itg/dashboard/app/portal/PageView.jsp' });
}

function goToWhatsNew() {
    chrome.tabs.create({ url: '/index.html?whatsNew=true' });
}

function goToGithub() {
    chrome.tabs.create({ url: 'https://github.com/derekedelaney/relay-time-browser-extension/tree/chrome' });
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
