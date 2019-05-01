# Relay Time Chrome Extension

[Install Extenstion](https://chrome.google.com/webstore/detail/relay-time/ominbkhiagfojcchnadpanlaimdhiolh?hl=en-US)

## Manual install
**Mac**
- [Download Extension](https://github.com/derekedelaney/relay-time-chrome-extension/raw/master/relay-chrome-extension.crx)
- Open Chrome extension settings (chrome://extensions/)
- Toggle developer mode in the top right corner
- Drag the extension file to the extension page

**Windows**
- Download the repo as a zip file and extract it
- Open Chrome extension settings (chrome://extensions/)
- Toggle developer mode in the top right corner
- Click on the button, `Load unpacked` and select the chrome extension folder.

## Initial Setup
The extension should open the Relay Time Options page on initial installation. There are three sections: tasks, defaults, and notifications.

**Tasks**

This section is where you add the list of tasks that are on your relay time sheet. The order of the tasks are important as that is the order the time gets imported. The left side is the name of the task and the right side is the ratio of the task. The sum of rations should equal 1. The total row will automatically sum up the entered ratios.

Example

| Name | Ratio |
|:---|:---:|
| Develop | 0.4 |
| Test | 0.3 |
| Design | 0.3 |
| Total | 1.0 |

**Notifications**

This section is where you set notifications. By default notifications are on and will notify you at 11:00.

## Relay Time Popup
When you install the chrome extension it will also add a button to your toolbar. The button is only enabled when you are on the Relay time sheet site. Given you are on the site, click the button on the to display the popup. It will have the times for each day populated with the defaults from the Options page. If you worked more or less hours you can change that in the popup. Clicking save will fill out the time sheet fields with the correct time based on the ratios and save the time sheet. If everything looks good, you may submit it. 

**Submitting Your Time Sheet**

1. Log in to Relay
2. Create New/Edit Time Sheet
3. Open the Relay Time Chrome extension popup
4. Click `Save`
5. If everything looks good Save & Submit!
6. Enjoy your extra 5 minutes
