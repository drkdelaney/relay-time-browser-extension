import React, { Component } from 'react';
import XLSX from 'xlsx';
import TaskTable from './task-table';
import { ReactComponent as ExcelUp } from '../excel-upload.svg';
import { ReactComponent as ExcelDown } from '../excel-download.svg';
import { get, save } from '../storage-helper';

class TaskSection extends Component {
    state = {
        loadingSheet: false,
    };

    handleUpload = e => {
        this.setState({ loadingSheet: true });
        const files = e.target.files;
        const f = files[0];
        const reader = new FileReader();
        reader.onload = e => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const json = XLSX.utils.sheet_to_json(
                workbook.Sheets[firstSheetName]
            );
            // validate(json);
            save({ tasks: json }).then(() => {
                setTimeout(() => {
                    this.setState({ loadingSheet: false });
                }, 1000);
            });
        };
        reader.readAsArrayBuffer(f);
    };

    handleDownload = async () => {
        const { tasks } = await get('tasks');
        const worksheet = XLSX.utils.json_to_sheet(tasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'timesheets');
        XLSX.writeFile(workbook, 'relay_time.xlsx');
    };

    render() {
        const { loadingSheet } = this.state;

        return (
            <div className="section">
                <div className="d-flex align-items-center">
                    <h3 className="sectionTitle mr-auto">Tasks</h3>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        class="inputfile"
                        onChange={this.handleUpload}
                        accept=".xlsx"
                    />
                    <label for="file">
                        <ExcelUp className="excel-svg" />
                    </label>
                    <ExcelDown
                        className="excel-svg"
                        onClick={this.handleDownload}
                    />
                </div>
                {loadingSheet ? (
                    <div className="text-center m-5">
                        <div
                            class="spinner-border text-primary"
                            role="status"
                            style={{ width: '3rem', height: '3rem' }}
                        >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <TaskTable />
                )}
                <p className="text-left font-italic mb-0">
                    * Tasks must be in the same order as your time sheet.
                </p>
            </div>
        );
    }
}

export default TaskSection;
