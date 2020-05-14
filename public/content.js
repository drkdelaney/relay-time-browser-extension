/*global chrome*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'setHours') {
        if (message.timeSheetHours) {
            setTimeSheetHours(message.timeSheetHours, message.eventType);
        }
        sendResponse();
    }
});

function setTimeSheetHours(timeSheetHours = '', eventType = 'SAVE') {
    const rows = timeSheetHours.split('\\n');
    const inputs = document.getElementsByClassName(
        'ipad-time-field field-value-nopad field-right-aligned'
    );
    const saveLink = document.getElementById('save_top');
    const saveSubmitLink = document.getElementById('release_top');
    if (inputs.length > 0) {
        let k = 0;
        for (let row of rows) {
            const cells = row.split('\\t');
            for (let cell of cells) {
                inputs[k].value = cell;
                k++;
            }
        }
        switch (eventType) {
            case 'SAVE':
                saveLink.click();
                break;
            case 'SAVE_SUBMIT':
                saveSubmitLink.click();
                break;
            default:
                console.error(`Unknown eventType: ${eventType}`);
                break;
        }
    } else {
        console.error('Can not set time sheet hours');
    }
}
