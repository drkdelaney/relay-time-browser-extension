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

chrome.storage.sync.get(['tasks', 'defaultDays'], function({
    tasks,
    defaultDays,
}) {
    if (Array.isArray(tasks)) {
        generateTaskRows(tasks);
    } else {
        chrome.storage.sync.set({ tasks: defaultTasks }, function() {
            generateTaskRows(defaultTasks);
        });
    }
    if (Array.isArray(defaultDays)) {
        populateDefaultDays(defaultDays);
    } else {
        chrome.storage.sync.set({ defaultDays: defaultDefaults }, function() {
            populateDefaultDays(defaultDefaults);
        });
    }
});

/* GET & SAVE FUNCTIONS */
function getTasks(func) {
    chrome.storage.sync.get('tasks', function(data) {
        let { tasks } = data;
        if (!Array.isArray(tasks)) {
            tasks = [];
        }
        func(tasks);
    });
}

function saveTask(task) {
    if (!task) return;
    chrome.storage.sync.get('tasks', function(data) {
        let { tasks } = data;
        if (!Array.isArray(tasks)) {
            tasks = [];
        }
        tasks.push({ name: task, ratio: 0 });
        chrome.storage.sync.set({ tasks }, function() {
            generateTaskRows(tasks);
        });
    });
}

function saveTasks(tasks) {
    if (!Array.isArray(tasks)) return;
    chrome.storage.sync.set({ tasks }, function() {
        generateTaskRows(tasks);
    });
}

function getDefaultDays(func) {
    chrome.storage.sync.get('defaultDays', function(data) {
        let { defaultDays } = data;
        if (!Array.isArray(defaultDays)) {
            defaultDays = [];
        }
        func(defaultDays);
    });
}

function saveDefaultDays(defaultDays) {
    if (!Array.isArray(defaultDays)) return;
    chrome.storage.sync.set({ defaultDays }, function() {
        populateDefaultDays(defaultDays);
    });
}

/* GENERATE HTML FUNCTIONS */
function generateTaskRows(tasks) {
    const tasksTable = document.getElementById('tasks');
    tasksTable.innerHTML = tasks
        .map(
            obj =>
                `<tr>
                    <td>
                        ${obj.name}
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
    days.innerHTML = defaults
        .map(obj => `<th scope="col">${obj.day}</th>`)
        .join('\n');
    const value = document.getElementById('default-value-row');
    value.innerHTML = defaults
        .map(
            obj =>
                `<td><input type="text" class="form-control default-value" value="${
                    obj.value
                }"></td>`
        )
        .join('\n');
    const checked = document.getElementById('default-checked-row');
    checked.innerHTML = defaults
        .map(
            obj =>
                `<td><input type="checkbox" class="form-control default-checked" ${
                    obj.checked ? 'checked' : ''
                }></td>`
        )
        .join('\n');
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
    saveTask(task);
    inputNewTaskName.value = '';
}

/* SAVE OPTIONS */
const saveOptions = document.getElementById('saveOptions');
saveOptions.onclick = () => {
    const taskRatios = document.querySelectorAll('.ratio-values');
    const defaultValue = document.querySelectorAll('.default-value');
    const defaultChecked = document.querySelectorAll('.default-checked');
    getTasks(tasks => {
        if (tasks.length !== taskRatios.length) {
            console.error('Something went wrong. Can not save Tasks.');
        } else {
            const updatedTasks = tasks.map((t, i) => ({
                name: t.name,
                ratio: taskRatios[i].value,
            }));
            saveTasks(updatedTasks);
        }
    });
    getDefaultDays(defaultDays => {
        if (defaultDays.length !== defaultValue.length) {
            console.error('Something went wrong. Can not save defaults.');
        } else {
            const updatedDefaults = defaultDays.map((d, i) => ({
                day: d.day,
                value: defaultValue[i].value,
                checked: defaultChecked[i].checked,
            }));
            saveDefaultDays(updatedDefaults);
        }
    });
    saveNotificationSettings();
};

/* RESET OPTIONS */
const resetOptions = document.getElementById('resetOptions');
resetOptions.onclick = () => {
    chrome.storage.sync.set({ tasks: defaultTasks }, function() {
        generateTaskRows(defaultTasks);
    });
    chrome.storage.sync.set({ defaultDays: defaultDefaults }, function() {
        populateDefaultDays(defaultDefaults);
    });
};

/* NOTIFICATIONS */
const notificationSwitch = document.getElementById('notification-switch');
const notificationTimeElement = document.getElementById('notification-time');
const reminderTimeElement = document.getElementById('reminder-time');

chrome.storage.sync.get(
    ['notifications', 'notificationTime', 'reminderTime'],
    function({ notifications, notificationTime, reminderTime }) {
        notificationSwitch.checked = !!notifications;
        showHideNotification(!!notifications);
        if (!notificationTime) {
            notificationTimeElement.value = '11:00';
        } else {
            notificationTimeElement.value = notificationTime;
        }
        if (!reminderTime) {
            reminderTimeElement.value = '14400000';
        } else {
            reminderTimeElement.value = reminderTime;
        }
    }
);

notificationSwitch.onchange = function({ target: { checked } }) {
    showHideNotification(checked);
};

function saveNotificationSettings() {
    const checked = notificationSwitch.checked;
    const time = notificationTimeElement.value;
    const reminder = reminderTimeElement.value;
    chrome.storage.sync.set({
        notifications: checked,
        notificationTime: time,
        reminderTime: reminder,
    });
}

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
