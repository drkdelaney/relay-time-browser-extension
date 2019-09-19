import React, { useState } from 'react';

function AddTaskRow({ onNewTask }) {
    const [activityName, updateActivityName] = useState('');

    function createNewTask() {
        const taskName = activityName.trim().toLowerCase();
        const newTask = { name: taskName, ratio: 0.0 };

        return newTask;
    }

    function resetInput() {
        updateActivityName('');
    }

    function handleChange(e) {
        const value = e.target.value;
        updateActivityName(value);
    }

    function handleClick() {
        onNewTask(createNewTask());
        resetInput();
    }

    function handleKeyDown(e) {
        if (e.keyCode === 13) {
            handleClick();
        }
    }

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
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-secondary btn-sm" onClick={handleClick}>
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

export default AddTaskRow;
