/* Defaults */
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
const defaultReminderTime = 14400000; // 4 hours

/* init load */
chrome.storage.sync.get(
    [
        'tasks',
        'defaultDays',
        'notifications',
        'notificationTime',
        'reminderTime',
    ],
    function({
        tasks = defaultTasks,
        defaultDays = defaultDefaults,
        notifications = defaultNotifications,
        notificationTime = defaultNotificationTime,
        reminderTime = defaultReminderTime,
    }) {
        chrome.storage.sync.set(
            {
                tasks,
                defaultDays,
                notifications,
                notificationTime,
                reminderTime,
            },
            function() {
                generateAll(
                    tasks,
                    defaultDays,
                    notifications,
                    notificationTime,
                    reminderTime
                );
            }
        );
    }
);

/* GENERATE AND POPULATE HTML FUNCTIONS */
function generateAll(
    tasks,
    defaultDays,
    notifications,
    notificationTime,
    reminderTime
) {
    generateTaskRows(tasks);
    populateDefaultDays(defaultDays);
    setNotificationArea(notifications, notificationTime, reminderTime);
}

function generateTaskRows(tasks) {
    const tasksTable = document.getElementById('tasks');
    tasksTable.innerHTML = tasks
        .map(
            obj =>
                `<tr>
                    <td>
                        <input type="text" readonly class="form-control-plaintext task-names" value="${
                            obj.name
                        }" tabindex="-1">
                    </td>
                    <td>
                        <input type="text" class="form-control ratio-values" value="${
                            obj.ratio
                        }">
                    </td>
                </tr>`
        )
        .join('\n');
}

function populateDefaultDays(defaults) {
    const days = document.getElementById('default-days-row');
    const value = document.getElementById('default-value-row');
    const checked = document.getElementById('default-checked-row');
    days.innerHTML = defaults
        .map(
            obj =>
                `<th scope="col"><input type="text" readonly class="form-control-plaintext default-days" value="${
                    obj.day
                }" tabindex="-1"></th>`
        )
        .join('\n');
    value.innerHTML = defaults
        .map(
            obj =>
                `<td><input type="text" class="form-control default-value" value="${
                    obj.value
                }"></td>`
        )
        .join('\n');
    checked.innerHTML = defaults
        .map(
            obj =>
                `<td><input type="checkbox" class="form-control default-checked" ${
                    obj.checked ? 'checked' : ''
                }></td>`
        )
        .join('\n');
}

function setNotificationArea(notifications, notificationTime, reminderTime) {
    const notificationSwitch = document.getElementById('notification-switch');
    const notificationTimeElement = document.getElementById(
        'notification-time'
    );
    const reminderTimeElement = document.getElementById('reminder-time');

    showHideNotification(notifications);

    notificationSwitch.checked = notifications;
    notificationTimeElement.value = notificationTime;
    reminderTimeElement.value = reminderTime;
}

/* CREATE NEW TASK NAME */
const inputNewTaskName = document.getElementById('inputNewTaskName');
const saveTaskName = document.getElementById('saveTaskName');
saveTaskName.onclick = addTaskName;
inputNewTaskName.onkeydown = e => {
    if (e.keyCode == 13) {
        addTaskName();
    }
};
function addTaskName() {
    const task = inputNewTaskName.value.trim().toLowerCase();
    addTaskRow(task);
    inputNewTaskName.value = '';
}

function addTaskRow(taskName) {
    const tasksTable = document.getElementById('tasks');
    const row = document.createElement('tr');
    row.innerHTML = `<td>
            <input type="text" readonly class="form-control-plaintext task-names" value="${taskName}" tabindex="-1">
        </td>
        <td>
            <input type="text" class="form-control ratio-values" value="0">
        </td>`;
    tasksTable.appendChild(row);
}

/* TOGGLE NOTIFICATIONS */
const notificationSwitch = document.getElementById('notification-switch');
notificationSwitch.onchange = function({ target: { checked } }) {
    showHideNotification(checked);
};

function showHideNotification(bool) {
    if (bool) {
        document
            .querySelectorAll('.notification')
            .forEach(e => e.classList.remove('hidden'));
    } else {
        document
            .querySelectorAll('.notification')
            .forEach(e => e.classList.add('hidden'));
    }
}

/* SAVE OPTIONS */
const saveOptions = document.getElementById('saveOptions');
saveOptions.onclick = () => {
    const taskNames = document.querySelectorAll('.task-names');
    const taskRatios = document.querySelectorAll('.ratio-values');
    const defaultDaysElements = document.querySelectorAll('.default-days');
    const defaultValue = document.querySelectorAll('.default-value');
    const defaultChecked = document.querySelectorAll('.default-checked');
    const notificationSwitch = document.getElementById('notification-switch');
    const notificationTimeElement = document.getElementById(
        'notification-time'
    );
    const reminderTimeElement = document.getElementById('reminder-time');

    const errors = [];
    let options = {};

    // tasks and ratios
    if (taskNames.length !== taskRatios.length) {
        errors.push('Invalid HTML for Tasks and Ratios');
    } else {
        const tasks = [];
        for (let i = 0; i < taskNames.length; i++) {
            tasks.push({
                name: taskNames[i].value,
                ratio: taskRatios[i].value,
            });
        }
        options = {
            ...options,
            tasks,
        };
    }

    // default days
    if (
        defaultDaysElements.length !== defaultValue.length &&
        defaultValue.length !== defaultChecked.length
    ) {
        errors.push('Invalid HTML for Default Days');
    } else {
        const defaultDays = [];
        for (let i = 0; i < defaultDaysElements.length; i++) {
            defaultDays.push({
                day: defaultDaysElements[i].value,
                value: defaultValue[i].value,
                checked: defaultChecked[i].checked,
            });
        }
        options = {
            ...options,
            defaultDays,
        };
    }

    // notifications
    const notifications = notificationSwitch.checked;
    const notificationTime = notificationTimeElement.value;
    const reminderTime = reminderTimeElement.value;
    options = {
        ...options,
        notifications,
        notificationTime,
        reminderTime,
    };

    chrome.storage.sync.set(options, () => {
        if (chrome.runtime.lastError) {
            if (chrome.runtime.lastError.message) {
                errors.push(message);
            } else {
                errors.push('An unknown error has occurred.');
            }
        }
        if (errors.length) {
            //display error message
        } else {
            // display success message
        }
    });
};

/* RESET OPTIONS */
const resetOptions = document.getElementById('resetOptions');
resetOptions.onclick = () => {
    generateAll(
        defaultTasks,
        defaultDefaults,
        defaultNotifications,
        defaultNotificationTime,
        defaultReminderTime
    );
};
