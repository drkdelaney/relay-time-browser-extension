const doneButton = document.getElementById('done-button');

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
    document.getElementById('day-row').innerHTML = defaultDays.map(
        obj => obj.checked ? `<th>${obj.day}</th>` : ''
    ).join('\n');
    document.getElementById('value-row').innerHTML = defaultDays.map(
        obj =>
            obj.checked ?
            `<td><input class="form-control form-control-sm hours" type="text" value="${
                obj.value
            }"></td>` : ''
    ).join('\n');
    document.getElementById('total-time').innerText = defaultDays.reduce(
        (a, obj) => {
            return a + Number(obj.value);
        }, 0);
}
