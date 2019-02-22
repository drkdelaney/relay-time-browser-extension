import React, { Component } from 'react';
import cx from 'classnames';
import { get, update, save } from '../storage-helper';
import TaskRow from './task-row';
import AddTaskRow from './add-task-row';
import TaskTotalsRow from './task-totals-row';

class TaskTable extends Component {
    state = {
        tasks: [],
        draggedTask: null
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

    handleDragStart = (i, e) => {
        e.dataTransfer.setData('dragIndex', i);
        setTimeout(() => {
            this.setState({ draggedTask: i });
        }, 0);
    };

    handleDragOver = (i, e) => {
        const dragIndex = this.state.draggedTask;
        
    };

    handleDrop = (i, e) => {
        const dragIndex = e.dataTransfer.getData('dragIndex');
        this.setState(({ tasks }) => {
            const result = Array.from(tasks);
            const [removed] = result.splice(dragIndex, 1);
            result.splice(i, 0, removed);

            return { tasks: result, draggedTask: null };
        });
        console.log('drop', dragIndex, i);
    };

    render() {
        const { tasks, draggedTask } = this.state;
        console.log();
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
                            dragClassName={cx(draggedTask === i && 'invisible')}
                            onDragStart={e => {
                                this.handleDragStart(i, e);
                            }}
                            onDragOver={e => {
                                this.handleDragOver(i, e);
                            }}
                            onDrop={e => {
                                this.handleDrop(i, e);
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
