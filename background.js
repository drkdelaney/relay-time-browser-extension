const TIME_SHEET_REMINDER = 'TIME_SHEET_REMINDER';
const TIME_SHEET_REMINDER_TEMP = 'TIME_SHEET_REMINDER_TEMP';

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
    createWeeklyAlarm(5, 11);
});

chrome.alarms.onAlarm.addListener(alarm => {
    showNotification(alarm.name === TIME_SHEET_REMINDER_TEMP);
});

chrome.notifications.onClicked.addListener(() => {
    goToRelay();
});

chrome.notifications.onButtonClicked.addListener(
    (notificationId, buttonIndex) => {
        [goToRelay, dismissNotification][buttonIndex](notificationId);
    }
);

function createWeeklyAlarm(day, hour) {
    chrome.alarms.create(TIME_SHEET_REMINDER, {
        periodInMinutes: 10080,
        when: nextOccurrenceOfDayAndTime(day, hour, 0).getTime(),
    });
}

function createTempAlarm(day, hour) {
    chrome.alarms.create(TIME_SHEET_REMINDER_TEMP, {
        when: nextOccurrenceOfDayAndTime(day, hour, 0).getTime(),
    });
}

function goToRelay() {
    chrome.tabs.create({ url: 'https://ppm-nike.saas.hpe.com/' });
}

function dismissNotification(notificationId) {
    chrome.notifications.clear(notificationId);
    createTempAlarm(5, 15);
    
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
                chrome.alarms.clear(TIME_SHEET_REMINDER_TEMP);
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
