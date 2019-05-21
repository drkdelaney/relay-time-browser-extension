import React, { Component } from 'react';
import TaskTable from './task-table';
import { ReactComponent as ExcelUp } from '../excel-upload.svg';
import { ReactComponent as ExcelDown } from '../excel-download.svg';

class TaskSection extends Component {
    handleUpload = () => {}

    handleDownload = () => {}

    render() {
        return (
            <div className="section">
                <div className="d-flex align-items-center">
                    <h3 className="sectionTitle mr-auto">Tasks</h3>
                    <ExcelUp className="excel-svg" onClick={this.handleUpload} />
                    <ExcelDown className="excel-svg" onClick={this.handleDownload} />
                 </div>
                <TaskTable />
                <p className="text-left font-italic mb-0">
                    * Tasks must be in the same order as your time sheet.
                </p>
            </div>
        );
    }
}

export default TaskSection;
