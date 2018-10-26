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
    showNotification();
});

chrome.notifications.onClicked.addListener(() => {
    goToRelay();
});

chrome.notifications.onButtonClicked.addListener(
    (notificationId, buttonIndex) => {
        [dismissNotification, goToRelay][buttonIndex](notificationId);
    }
);

function createWeeklyAlarm(day, hour) {
    chrome.alarms.create('time_sheet_reminder', {
        periodInMinutes: 10080,
        when: nextOccurrenceOfDayAndTime(day, hour, 0).getTime(),
    });
}

function goToRelay() {
    chrome.tabs.create({ url: 'https://ppm-nike.saas.hpe.com/' });
}

function dismissNotification(notificationId) {
    chrome.notifications.clear(notificationId);
}

function showNotification() {
    chrome.notifications.create(
        'reminder',
        {
            type: 'basic',
            iconUrl: 'images/relay_time_icon128.png',
            title: 'Relay Time!',
            message: "Don't forget to submit your time sheet!",
            requireInteraction: true,
            buttons: [{ title: "I'll do it later" }, { title: "I'll do it now" }],
        },
        function(notificationId) {}
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
