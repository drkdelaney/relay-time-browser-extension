import React, { Component } from 'react';

class AddTaskRow extends Component {
    state = {
        activityName: ''
    }

    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ activityName: value });
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            const { onNewTask } = this.props;
            onNewTask(this.createNewTask());
            this.resetInput();
        }
    }

    handleClick = () => {
        const { onNewTask } = this.props;
        onNewTask(this.createNewTask());
        this.resetInput();
    }

    createNewTask = () => {
        const { activityName } = this.state;
        const taskName = activityName.trim().toLowerCase();
        const newTask = { name: taskName, ratio: 0.0 };

        return newTask;
    }

    resetInput = () => {
        this.setState({ activityName: '' });
    }

    render() {
        const { activityName } = this.state;
        return (
            <tr>
                <td />
                <td colspan="2" className="new-task-row">
                    <div className="form-inline">
                        <div className="form-group input-group-sm">
                            <input
                                type="text"
                                readonly
                                className="form-control-plaintext"
                                value="New Activity:"
                                tabindex="-1"
                            />
                        </div>
                        <div className="input-group input-group-sm">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Activity"
                                value={activityName}
                                onChange={this.handleChange}
                                onKeyDown={this.handleKeyDown}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-secondary btn-sm" onClick={this.handleClick}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
                <td />
            </tr>
        );
    }
}

export default AddTaskRow;
