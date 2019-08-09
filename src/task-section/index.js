import React from 'react';
import TaskTable from './task-table';

export function TaskSection() {
    return (
        <div className="section">
            <div className="d-flex align-items-center">
                <h3 className="sectionTitle mr-auto">Tasks</h3>
            </div>
            <TaskTable />
            <p className="text-left font-italic mb-0">
                * Tasks must be in the same order as your time sheet.
            </p>
        </div>
    );
}

export default TaskSection;
