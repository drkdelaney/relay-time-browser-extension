import React, { Component } from 'react';
import { get, save } from '../storage-helper';

class NotificationSection extends Component {
    state = {
        notifications: null,
        notificationTime: null,
    };

    componentDidMount() {
        get(['notifications', 'notificationTime']).then(
            ({ notifications, notificationTime }) => {
                this.setState({ notifications, notificationTime });
            }
        );
    }

    handleSwitch = (e) => {
        const value =  e.target.checked;
        save({ notifications: value }).then(() => {
            this.setState({ notifications: value });
        })
    };

    handleNotificationTimeChange = (e) => {
        const value = e.target.value;
        save({ notificationTime: value }).then(() => {
            this.setState({ notificationTime: value });
        });
    };

    render() {
        const { notifications, notificationTime, reminderTime } =this.state;

        return (
            <div class="section">
                <h3 class="sectionTitle">Notifications</h3>
                <div class="d-inline-flex align-items-center">
                    <div>
                        <label class="switch mb-0">
                            <input type="checkbox" checked={notifications} onChange={this.handleSwitch}/>
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
                        onChange={this.handleNotificationTimeChange}
                        value={notificationTime}
                    />
                </div>
            </div>
        );
    }
}

export default NotificationSection;
