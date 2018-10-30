const TIME_SHEET_REMINDER = 'TIME_SHEET_REMINDER';
const TIME_SHEET_REMINDER_LATER = 'TIME_SHEET_REMINDER_LATER';
const NOTIFICATION_DAY = 5;

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: 'ppm-nike.saas.hpe.com' },
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
    chrome.runtime.openOptionsPage();
    chrome.storage.sync.get(['notificationTime'], function({ notificationTime }) {
        if (notificationTime) {
            const [hour, minute] = notificationTime.split(':');
            createWeeklyAlarm(NOTIFICATION_DAY, hour, minute);
        } else {
            createWeeklyAlarm(NOTIFICATION_DAY, 11);
        }
    });
});

chrome.alarms.onAlarm.addListener(alarm => {
    showNotification(alarm.name === TIME_SHEET_REMINDER_LATER);
});

chrome.notifications.onClicked.addListener(() => {
    goToRelay();
});

chrome.notifications.onButtonClicked.addListener(
    (notificationId, buttonIndex) => {
        [goToRelay, dismissNotification][buttonIndex](notificationId);
    }
);

chrome.storage.onChanged.addListener(({ notificationTime }) => {
    chrome.alarms.clearAll();
    if (notificationTime.newValue) {
        const [hour, minute] = notificationTime.newValue.split(':');
        createWeeklyAlarm(NOTIFICATION_DAY, hour, minute);
    }
});

function createWeeklyAlarm(day, hour, minute = 0) {
    chrome.alarms.create(TIME_SHEET_REMINDER, {
        periodInMinutes: 10080,
        when: nextOccurrenceOfDayAndTime(day, hour, minute).getTime(),
    });
}

function createTempAlarm(jsTime) {
    chrome.alarms.create(TIME_SHEET_REMINDER_LATER, {
        when: jsTime,
    });
}

function goToRelay() {
    chrome.tabs.create({ url: 'https://ppm-nike.saas.hpe.com/' });
}

function dismissNotification(notificationId) {
    chrome.notifications.clear(notificationId);
    chrome.storage.sync.get('reminderTime', function({ reminderTime }) {
        const jsTime = Date.now() + Number(reminderTime);
        createTempAlarm(jsTime);
    });
    
}

function showNotification(isLater) {
    const notificationOptions = {
            type: 'basic',
            iconUrl: 'images/relay_time_icon128.png',
            title: 'Relay Time!',
            message: "Don't forget to submit your time sheet!",
            requireInteraction: true,
            buttons: isLater ? [{ title: "I'll do it now" }] : [{ title: "I'll do it now" }, { title: "I'll do it later" }],
        };
    chrome.notifications.create(
        'reminder',
        notificationOptions,
        function(notificationId) {
            if (isLater) {
                chrome.alarms.clear(TIME_SHEET_REMINDER_LATER);
            }
        }
    );
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
