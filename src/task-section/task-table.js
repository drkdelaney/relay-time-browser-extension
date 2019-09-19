import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { get, update, save } from '../storage-helper';
import TaskRow from './task-row';
import AddTaskRow from './add-task-row';
import TaskTotalsRow from './task-totals-row';

function TaskTable() {
    const [tasks, setTasks] = useState([]);
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);

    useEffect(function() {
        get('tasks').then(({ tasks = [] }) => {
            setTasks(tasks);
        });
    }, []);

    function handleNewTask(newTask) {
        update('tasks', ({ tasks = [] }) => [...tasks, newTask]).then(
            ({ tasks }) => {
                setTasks(tasks);
            }
        );
    }

    function handleDeleteTask(task, index) {
        // eslint-disable-next-line no-restricted-globals
        const shouldDelete = confirm(
            `Are you sure you want to delete ${task.name.toUpperCase()}?`
        );
        if (shouldDelete) {
            update('tasks', ({ tasks }) => {
                return tasks.filter((t, i) => i !== index);
            }).then(({ tasks }) => {
                setTasks(tasks);
            });
        }
    }

    function handleRatioBlur() {
        save({ tasks });
    }

    function handleRatioChange(newRatio, i) {
        const updatedTasks = tasks.map((task, index) => {
            if (i === index) {
                return { ...task, ratio: newRatio };
            }
            return task;
        });
        setTasks(updatedTasks);
    }

    function handleDragStart(i, e) {
        e.dataTransfer.setData('dragIndex', i);
        setTimeout(() => {
            setDraggedTaskId(i);
        }, 0);
    }

    function handleDragOver(i, e) {
        e.preventDefault();
        setDragOverId(i);
    }

    function handleDragEnter(e) {
        e.preventDefault();
    }

    function handleDragLeave() {
        setDragOverId(null);
    }

    function handleDragEnd() {
        setDraggedTaskId(null);
        setDragOverId(null);
    }

    function handleDrop(i, e) {
        const dragIndex = e.dataTransfer.getData('dragIndex');
        const result = Array.from(tasks);
        const [removed] = result.splice(dragIndex, 1);
        result.splice(i, 0, removed);

        save({ tasks: result });
        setTasks(result);
    }

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
                            handleDeleteTask(task, i);
                        }}
                        onRatioBlur={handleRatioBlur}
                        onRatioChange={newRatio => {
                            handleRatioChange(newRatio, i);
                        }}
                        dragClassName={cx(
                            draggedTaskId === i && 'invisible',
                            dragOverId === i && 'dragover'
                        )}
                        onDragStart={handleDragStart.bind(this, i)}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop.bind(this, i)}
                        onDragOver={handleDragOver.bind(this, i)}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                    />
                ))}
            </tbody>
            <tbody>
                <TaskTotalsRow tasks={tasks} />
                <AddTaskRow onNewTask={handleNewTask} />
            </tbody>
        </table>
    );
}

export default TaskTable;
