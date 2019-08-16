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

async function getTimeSheetHours() {
    const hours = document.querySelectorAll('.hours');
    const data = await browser.storage.sync.get(['tasks', 'defaultDays']);
    const { tasks, defaultDays } = data;
    return new Promise((resolve, reject) => {
        if (!Array.isArray(tasks) || tasks.length < 1) {
            reject('No tasks found');
        }
        if ((Array.isArray(tasks) && Array.isArray(defaultDays))) {
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
            resolve(tableData.join('\\n'));
        } else {
            reject('Could not generate time sheet hours');
        }
    });
}

async function generateTimeSheetHours() {
    try {
        const timeSheetHours = await getTimeSheetHours();
        browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
            // Send a request to the content script.
            browser.tabs.sendMessage(tabs[0].id, { action: 'setHours', timeSheetHours }).then(() => {
                window.close()
            });
        });
    } catch(error) {
        console.error(error);
    }

}
