import React, { Component } from 'react';
import cx from 'classnames';
import { get, update, save } from '../storage-helper';
import TaskRow from './task-row';
import AddTaskRow from './add-task-row';
import TaskTotalsRow from './task-totals-row';

class TaskTable extends Component {
    state = {
        tasks: [],
        draggedTaskId: null,
        dragOverId: null
    };

    componentDidMount() {
        get('tasks').then(({ tasks = [] }) => {
            this.setState({ tasks });
        });
    }

    handleNewTask = newTask => {
        update('tasks', ({ tasks = [] }) => (
            [...tasks, newTask]
        )).then(({ tasks }) => {
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

    handleDragStart = (i, e) => {
        e.dataTransfer.setData('dragIndex', i);
        setTimeout(() => {
            this.setState({ draggedTaskId: i });
        }, 0);
    };

    handleDragOver = (i, e) => {
        e.preventDefault();
        this.setState({ dragOverId: i });
    };

    handleDragEnter = (e) => {
        e.preventDefault();
    };

    handleDragLeave = () => {
        this.setState({ dragOverId: null });
    };

    handleDragEnd = () => {
        this.setState({ draggedTaskId: null, dragOverId: null });
    };

    handleDrop = (i, e) => {
        const dragIndex = e.dataTransfer.getData('dragIndex');
        this.setState(({ tasks }) => {
            const result = Array.from(tasks);
            const [removed] = result.splice(dragIndex, 1);
            result.splice(i, 0, removed);

            save({ tasks: result })
            return { tasks: result };
        });
    };

    render() {
        const { tasks, draggedTaskId, dragOverId } = this.state;
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
                            dragClassName={cx(draggedTaskId === i && 'invisible', dragOverId === i && 'dragover')}
                            onDragStart={this.handleDragStart.bind(this, i)}
                            onDragEnd={this.handleDragEnd}
                            onDrop={this.handleDrop.bind(this, i)}
                            onDragOver={this.handleDragOver.bind(this, i)}
                            onDragEnter={this.handleDragEnter}
                            onDragLeave={this.handleDragLeave}
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
