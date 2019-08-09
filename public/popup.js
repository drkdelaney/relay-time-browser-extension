/* global browser */

const doneButton = document.getElementById('done-button');
doneButton.onclick = generateTimeSheetHours;

browser.storage.sync.get('tasks').then((data) => {
    if (Array.isArray(data.tasks)) {
        doneButton.disabled = false;
    } else {
        doneButton.disabled = true;
    }
});

browser.storage.sync.get('defaultDays').then((data) => {
    if (Array.isArray(data.defaultDays)) {
        populateDefaultDays(data.defaultDays);
    } else {
        populateDefaultDays();
    }
});

function populateDefaultDays(defaultDays = []) {
    document.getElementById('day-row').innerHTML = defaultDays
        .map(obj => (obj.checked ? `<th>${obj.day}</th>` : ''))
        .join('\n');
    document.getElementById('value-row').innerHTML = defaultDays
        .map(
            obj =>
                obj.checked
                    ? `<td><input class="form-control form-control-sm hours" type="text" value="${
                          obj.value
                      }"></td>`
                    : ''
        )
        .join('\n');
    document.getElementById('total-time').innerText = defaultDays.reduce(
        (a, obj) => {
            return a + Number(obj.value);
        },
        0
    );
    // set callbacks to calc totals
    const hourElements = document.querySelectorAll('.hours');
    for (const element of hourElements) {
        element.onkeyup = hourChange;
    }
}

function hourChange() {
    const hoursEle = document.querySelectorAll('.hours');
    let total = 0;
    for (const ele of hoursEle) {
        total += Number(ele.value);
    }
    document.getElementById('total-time').innerText = total;
}

function getTimeSheetHours(func) {
    const hours = document.querySelectorAll('.hours');
    browser.storage.sync.get(['tasks', 'defaultDays'], function(data) {
        const { tasks, defaultDays } = data;
        if ((Array.isArray(tasks), Array.isArray(defaultDays))) {
            const tableData = [];
            for (const task of tasks) {
                const row = [];
                for (let i = 0, j = 0; i < defaultDays.length; i++) {
                    if (defaultDays[i].checked) {
                        row.push(task.ratio * hours[j].value);
                        j++;
                    } else {
                        row.push(0);
                    }
                }
                tableData.push(row.join('\\t'));
            }
            func(tableData.join('\\n'));
        } else {
            console.error('Could not generate time sheet hours');
        }
    });
}

function generateTimeSheetHours() {
    getTimeSheetHours(timeSheetHours => {
        browser.tabs.query({ active: true }, function(tabs) {
            // Send a request to the content script.
            const tab = tabs.find(e => e.title === 'Edit Time Sheet');
            browser.tabs.sendMessage(
                tab.id,
                { action: 'setHours', timeSheetHours },
                {},
                function() {
                    window.close();
                }
            );
        });
    });
}
