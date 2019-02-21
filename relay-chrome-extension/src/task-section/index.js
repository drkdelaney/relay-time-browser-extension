import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import TaskTable from './task-table';

class TaskSection extends Component {
    render() {
        return (
            <div className="container">
                <h1 className="title">Relay Time Options</h1>
                <div className="section">
                    <h3 className="sectionTitle">Tasks</h3>
                    <TaskTable />
                    <p className="text-left font-italic mb-0">
                        * Tasks must be in the same order as your time sheet.
                    </p>
                </div>
            </div>
        );
    }
}

export default TaskSection;
