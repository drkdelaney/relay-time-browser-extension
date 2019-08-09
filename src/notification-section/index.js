import React, { useState, useEffect } from 'react';
import { get, save } from '../storage-helper';

function NotificationSection() {
    const [notifications, setNotifications] = useState(false);
    const [notificationTime, setNotificationTime] = useState('');

    useEffect(() => {
        get(['notifications', 'notificationTime']).then(
            ({ notifications, notificationTime }) => {
                setNotifications(notifications);
                setNotificationTime(notificationTime);
            }
        );
    }, []);

    function handleSwitch(e) {
        const value = e.target.checked;
        save({ notifications: value }).then(() => {
            setNotifications(value);
        });
    }

    function handleNotificationTimeChange(e) {
        const value = e.target.value;
        save({ notificationTime: value }).then(() => {
            setNotificationTime(value);
        });
    };

    return (
        <div class="section">
            <h3 class="sectionTitle">Notifications</h3>
            <div class="d-inline-flex align-items-center">
                <div>
                    <label class="switch mb-0">
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={handleSwitch}
                        />
                        <span class="slider round" />
                        <span class="on-text">On</span>
                        <span class="off-text">Off</span>
                    </label>
                </div>
                <input
                    type="text"
                    readonly
                    class="form-control-plaintext text-right notification mr-2"
                    value="Every Friday At"
                    tabindex="-1"
                />
                <input
                    type="time"
                    class="form-control notification"
                    name="timePicker"
                    onChange={handleNotificationTimeChange}
                    value={notificationTime}
                />
            </div>
        </div>
    );
}

export default NotificationSection;
