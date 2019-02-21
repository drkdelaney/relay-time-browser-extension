import React, { Component } from 'react';
import { get, update, save } from '../storage-helper';
import TaskRow from './task-row';
import AddTaskRow from './add-task-row';
import TaskTotalsRow from './task-totals-row';

class TaskTable extends Component {
    state = {
        tasks: []
    };

    componentDidMount() {
        get('tasks').then(({ tasks = [] }) => {
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

    handleDeleteTask = (task, index) => {
        // eslint-disable-next-line no-restricted-globals
        const shouldDelete = confirm(
            `Are you sure you want to delete ${task.name.toUpperCase()}?`
        );
        if (shouldDelete) {
            update('tasks', ({ tasks }) => {
                return tasks.filter((t, i) => i !== index);
            }).then(({ tasks }) => {
                this.setState({ tasks });
            });
        }
    };

    handleRatioBlur = () => {
        save({ tasks: this.state.tasks });
    };

    handleRatioChange = (newRatio, i) => {
        this.setState(({ tasks }) => {
            const updatedTasks = tasks.map((task, index) => {
                if (i === index) {
                    return { ...task, ratio: newRatio };
                }
                return task;
            });
            return { tasks: updatedTasks };
        });
    };

    render() {
        const { tasks } = this.state;
        return (
            <table className="table mb-0">
                <thead>
                    <tr>
                        <th scope="col" />
                        <th scope="col">Activity</th>
                        <th scope="col">Ratio (1.0)</th>
                        <th scope="col" />
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, i) => (
                        <TaskRow
                            task={task}
                            onDeleteTask={() => {
                                this.handleDeleteTask(task, i);
                            }}
                            onRatioBlur={this.handleRatioBlur}
                            onRatioChange={newRatio => {
                                this.handleRatioChange(newRatio, i);
                            }}
                        />
                    ))}
                </tbody>
                <tbody>
                    <TaskTotalsRow tasks={tasks} />
                    <AddTaskRow onNewTask={this.handleNewTask} />
                </tbody>
            </table>
        );
    }
}

export default TaskTable;
