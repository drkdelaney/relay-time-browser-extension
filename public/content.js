/*global browser*/

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'setHours') {
        if (message.timeSheetHours) {
            setTimeSheetHours(message.timeSheetHours);
        }
        sendResponse();
    }
});

function setTimeSheetHours(timeSheetHours = '') {
    const rows = timeSheetHours.split('\\n');
    const inputs = document.getElementsByClassName(
        'ipad-time-field field-value-nopad field-right-aligned'
    );
    const saveLink = document.getElementById('save_top');
    if (inputs.length > 0) {
        let k = 0;
        for (let row of rows) {
            const cells = row.split('\\t');
            for (let cell of cells) {
                inputs[k].value = cell;
                k++;
            }
        }
        saveLink.click();
    } else {
        console.error('Can not set time sheet hours');
    }
}
