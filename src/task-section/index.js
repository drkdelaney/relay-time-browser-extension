import React, { Component } from 'react';
import TaskTable from './task-table';

class TaskSection extends Component {
    render() {
        return (
            <div className="section">
                <h3 className="sectionTitle">Tasks</h3>
                <TaskTable />
                <p className="text-left font-italic mb-0">
                    * Tasks must be in the same order as your time sheet.
                </p>
            </div>
        );
    }
}

export default TaskSection;
