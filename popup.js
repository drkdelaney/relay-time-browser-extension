const doneButton = document.getElementById('done-button');
doneButton.onclick = generateTimeSheetHours;

chrome.storage.sync.get('tasks', function(data) {
    if (Array.isArray(data.tasks)) {
        doneButton.disabled = false;
    } else {
        doneButton.disabled = true;
    }
});

chrome.storage.sync.get('defaultDays', function(data) {
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
}

function getTimeSheetHours(func) {
    const hours = document.querySelectorAll('.hours');
    chrome.storage.sync.get('tasks', function(data) {
        const { tasks } = data;
        if (Array.isArray(tasks)) {
            const tableData = [];
            for (const task of tasks) {
                const row = [];
                for (let hourElement of hours) {
                    row.push(task.ratio * hourElement.value);
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
        chrome.tabs.query({active: true}, function(tabs) {
            // Send a request to the content script.
            const tab = tabs.find(e => e.title === 'Edit Time Sheet');
            chrome.tabs.sendMessage(tab.id, { action: 'setHours', timeSheetHours }, {}, function(response) {
                console.log(response);
            });
        });
    });
}
