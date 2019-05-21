import React, { Component } from 'react';
import XLSX from 'xlsx';
import TaskTable from './task-table';
import { ReactComponent as ExcelUp } from '../excel-upload.svg';
import { ReactComponent as ExcelDown } from '../excel-download.svg';
import { get } from '../storage-helper';

class TaskSection extends Component {
    handleUpload = () => {}

    handleDownload = async () => {
        const { tasks } = await get('tasks');
        const arrayTasks = tasks.map(a => ([a.name, a.ratio]));
        const data = [
            ['Activity', 'Ratio'],
            ...arrayTasks
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'timesheets');
        XLSX.writeFile(workbook, 'relay_time.xlsx');
    }

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
