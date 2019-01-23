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
The extension should open the Relay Time Options page. There are two sections: tasks and defaults.

**Tasks**

This section is where you add the list of tasks that are on your relay time sheet. The order of the tasks are important as that is the order the time gets imported. The left side is the name of the task and the right side is the ratio of the task. The sum of rations should equal 1.

Example

| Name | Ratio |
|:---|:---:|
| Develop | 0.4 |
| Test | 0.3 |
| Design | 0.3 |

**Defaults**

This section is where you set the defaults for the Relay Time popup. Use the input boxes to set the hours you would typically work. This is initially set up to be 8 hrs Mon - Fri. The checkboxes allow you to show/hide the day of the week in the Relay Time popup.

**Notifications**

This section is where you set notifications and reminders.

**DON'T FORGET TO SAVE THE CHANGES WHEN YOU ARE DONE!**

## Relay Time Popup
When you install the chrome extension it will also add a button to your toolbar. The button is only enabled when you are on the Relay time sheet site. Given you are on the site, click the button on the to display the popup. It will have the times for each day populated with the defaults from the Options page. If you worked more or less hours you can change that in the popup. Clicking done will fill out the time sheet fields with the correct time based on the ratios. 

**Submitting Your Time Sheet**

1. Log in to Relay
2. Create New/Edit Time Sheet
3. Open the Relay Time Chrome extension popup
4. Click `Done`
5. Save your time sheet to verify hour totals
6. If everything looks good Save & Submit!
7. Enjoy your extra 5 minutes
