/* Defaults */
const defaultTasks = [];
const defaultDefaults = [
    { day: 'Mon', value: '8', checked: true },
    { day: 'Tue', value: '8', checked: true },
    { day: 'Wed', value: '8', checked: true },
    { day: 'Thu', value: '8', checked: true },
    { day: 'Fri', value: '8', checked: true },
    { day: 'Sat', value: '0', checked: true },
    { day: 'Sun', value: '0', checked: true }
];
const defaultNotifications = true;
const defaultNotificationTime = '11:00';
const defaultReminderTime = 14400000; // 4 hours

/* init load */
get([
    'tasks',
    'defaultDays',
    'notifications',
    'notificationTime',
    'reminderTime'
]).then(
    ({
        tasks = defaultTasks,
        defaultDays = defaultDefaults,
        notifications = defaultNotifications,
        notificationTime = defaultNotificationTime,
        reminderTime = defaultReminderTime
    }) => {
        save({
            tasks,
            defaultDays,
            notifications,
            notificationTime,
            reminderTime
        }).then(() => {
            generateAll(
                tasks,
                defaultDays,
                notifications,
                notificationTime,
                reminderTime
            );
        });
    }
);

const errorAlert = document.getElementById('error-alert');
errorAlert.hidden = true;
errorAlert.getElementsByTagName('button')[0].onclick = () => {
    errorAlert.hidden = true;
};

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
    calculateTotals();
}

function generateTaskRows(tasks) {
    const tasksTable = document.getElementById('tasks');
    tasksTable.innerHTML = tasks
        .map(
            (obj, i) =>
                `<tr draggable="true" class="dragon-drop">
                    <td class="delete-row-button"><i class="fas fa-minus-circle fa-md"></i></td>
                    <td>
                    <input type="text" readonly class="form-control-plaintext task-names" value="${
                        obj.name
                    }" tabindex="-1">
                    </td>
                    <td>
                    <input type="number" class="form-control ratio-values" value="${
                        obj.ratio
                    }" min="0" max="1" step="0.1">
                    </td>
                    <td class="grip-row-button"><i class="fas fa-grip-lines"></i></td>
                </tr>`
        )
        .join('\n');

    const dragonContainers = document.getElementsByClassName('dragon-drop');
    for (let i = 0; i < dragonContainers.length; i++) {
        const container = dragonContainers[i];
        container.addEventListener('dragover', dragover.bind(this, i));
        container.addEventListener('dragstart', dragstart.bind(this, i));
        container.addEventListener('dragleave', dragleave.bind(this, i));
        container.addEventListener('drop', drop.bind(this, i));
    }

    const elements = tasksTable.querySelectorAll('.ratio-values');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.onchange = calculateTotals;
        element.onblur = saveRatio.bind(this, i);
    }

    const deleteRowButtons = tasksTable.querySelectorAll('.delete-row-button');
    for (let i = 0; i < deleteRowButtons.length; i++) {
        const deleteRowButton = deleteRowButtons[i];
        deleteRowButton.onclick = handleDeleteTask.bind(this, i, tasks[i]);
    }
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

    const defaultDaysElements = document.querySelectorAll('.default-days');
    const defaultValue = document.querySelectorAll('.default-value');
    const defaultChecked = document.querySelectorAll('.default-checked');

    for (let i = 0; i < defaultDaysElements.length; i++) {
        defaultValue[i].onblur = handleDefaultValueBlur.bind(this, i);
        defaultChecked[i].onchange = handleDefaultCheckedChanged.bind(this, i);
    }
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

/* HELPER EVENT FUNCTIONS */
function dragover(i, e) {
    e.preventDefault();
    const dragonContainers = document.getElementsByClassName('dragon-drop');
    dragonContainers[i].className = 'dragon-drop dragover';
}

function dragstart(i, e) {
    e.dataTransfer.setData('dragIndex', i);
}

function dragleave(i, e) {
    const dragonContainers = document.getElementsByClassName('dragon-drop');
    dragonContainers[i].className = 'dragon-drop';
}

function drop(dropIndex, e) {
    const dragonContainers = document.getElementsByClassName('dragon-drop');
    dragonContainers[dropIndex].className = 'dragon-drop';

    const dragIndex = e.dataTransfer.getData('dragIndex');

    update('tasks', ({ tasks }) => {
        const updateTasks = [...tasks];
        let temp = updateTasks[dragIndex];
        updateTasks.splice(dragIndex, 1);
        updateTasks.splice(dropIndex, 0, temp);

        return updateTasks;
    })
        .then(({ tasks }) => {
            generateTaskRows(tasks);
        })
        .catch(showErrorAlert);
}

function calculateTotals() {
    const ratioValues = document.querySelectorAll('.ratio-values');
    const totalElement = document.getElementById('inputTaskTotal');
    let total = 0;
    for (let i = 0; i < ratioValues.length; i++) {
        const element = ratioValues[i];
        total += Number(element.value);
    }
    totalElement.value = parseFloat(Math.round(total * 100) / 100).toFixed(2);
}

function saveRatio(index, e) {
    const ratio = e.target.value;
    update('tasks', ({ tasks }) => {
        return tasks.map((task, i) => {
            if (i === index) {
                return { ...task, ratio };
            }
            return task;
        });
    }).catch(showErrorAlert);
}

function handleDeleteTask(index, task) {
    const shouldDelete = confirm(
        `Are you sure you want to delete ${task.name.toUpperCase()}?`
    );
    if (shouldDelete) {
        update('tasks', ({ tasks }) => {
            return tasks.filter((task, i) => i !== index);
        })
            .then(({ tasks }) => {
                generateTaskRows(tasks);
                calculateTotals();
            })
            .catch(showErrorAlert);
    }
}

function handleDefaultValueBlur(index, e) {
    const value = e.target.value;
    update('defaultDays', ({ defaultDays }) => {
        return defaultDays.map((defaultDay, i) => {
            if (i === index) {
                return { ...defaultDay, value };
            }
            return defaultDay;
        });
    }).catch(showErrorAlert);
}

function handleDefaultCheckedChanged(index, e) {
    const checked = e.target.checked;
    update('defaultDays', ({ defaultDays }) => {
        return defaultDays.map((defaultDay, i) => {
            if (i === index) {
                return { ...defaultDay, checked };
            }
            return defaultDay;
        });
    }).catch(showErrorAlert);
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
    const taskName = inputNewTaskName.value.trim().toLowerCase();
    update('tasks', ({ tasks }) => {
        return [...tasks, { name: taskName, ratio: 0.0 }];
    })
        .then(({ tasks }) => {
            generateTaskRows(tasks);
        })
        .catch(showErrorAlert);
    inputNewTaskName.value = '';
}

/* TOGGLE NOTIFICATIONS */
const notificationSwitch = document.getElementById('notification-switch');
notificationSwitch.onchange = function({ target: { checked } }) {
    showHideNotification(checked);
};
const notificationTimeElement = document.getElementById('notification-time');
notificationTimeElement.onblur = function(e) {
    const notificationTime = e.target.value;
    save({ notificationTime }).catch(showErrorAlert);
};
const reminderTimeElement = document.getElementById('reminder-time');
reminderTimeElement.onchange = function(e) {
    const reminderTime = e.target.value;
    save({ reminderTime }).catch(showErrorAlert);
};

function showHideNotification(bool) {
    save({ notifications: bool }).catch(showErrorAlert);

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

function showErrorAlert(error) {
    errorAlert.hidden = false;
    const errorList = document.getElementById('error-list');
    errorList.innerText = error.message;
}
