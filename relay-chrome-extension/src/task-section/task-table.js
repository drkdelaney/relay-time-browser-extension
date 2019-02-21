import React, { Component } from 'react';
import '../App.css';
import { get, update } from '../storage-helper';
import TaskRow from './task-row';
import AddTaskRow from './add-task-row';

class TaskTable extends Component {
    state = {
        tasks: []
    };

    componentDidMount() {
        get('tasks').then(({ tasks }) => {
            this.setState({ tasks });
        });
    }

    handleNewTask = newTask => {
        update('tasks', ({ tasks = [] }) => {
            return [...tasks, newTask];
        }).then(({ tasks }) => {
            this.setState({ tasks });
        });
    };

    handleDeleteTask = task => {
        const shouldDelete = confirm(`Are you sure you want to delete ${task.name.toUpperCase()}?`); // eslint-disable-line no-restricted-globals
        if (shouldDelete) {
            console.log('delete something');
        }
    };

    render() {
        const { tasks } = this.state;
        return (
            <table id="task-table" className="table mb-0">
                <thead>
                    <tr>
                        <th scope="col" />
                        <th scope="col">Activity</th>
                        <th scope="col">Ratio (1.0)</th>
                        <th scope="col" />
                    </tr>
                </thead>
                <tbody id="tasks">
                    {tasks.map(task => (
                        <TaskRow
                            task={task}
                            onDeleteTask={() => {
                                this.handleDeleteTask(task);
                            }}
                        />
                    ))}
                </tbody>
                <tbody id="add-more">
                    <tr>
                        <td />
                        <td className="task-total-row">
                            <input
                                type="text"
                                readonly
                                className="form-control-plaintext"
                                id="taskTotal"
                                value="Total"
                                tabindex="-1"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                id="inputTaskTotal"
                                value="0.0"
                                disabled
                            />
                        </td>
                        <td />
                    </tr>
                    <AddTaskRow onNewTask={this.handleNewTask} />
                </tbody>
            </table>
        );
    }
}

export default TaskTable;
