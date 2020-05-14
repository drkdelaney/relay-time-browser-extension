import React from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faGripLines } from '@fortawesome/free-solid-svg-icons';

function TaskRow(props) {
    const {
        task: { name, ratio },
        onDeleteTask,
        onRatioBlur,
        dragClassName,
        onDragStart,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
        onDragEnter,
    } = props;

    function handleRatioChange(e) {
        const value = e.target.value;
        props.onRatioChange(parseFloat(value));
    }

    return (
        <tr
            draggable="true"
            className={cx('dragon-drop', dragClassName)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
        >
            <td className="delete-row-button">
                <FontAwesomeIcon icon={faMinusCircle} onClick={onDeleteTask} />
            </td>
            <td>
                <input
                    type="text"
                    readonly
                    className="form-control-plaintext task-names"
                    value={name}
                    tabindex="-1"
                />
            </td>
            <td>
                <input
                    type="number"
                    className="form-control ratio-values"
                    value={ratio}
                    onChange={handleRatioChange}
                    onBlur={onRatioBlur}
                    min="0"
                    max="1"
                    step="0.1"
                />
            </td>
            <td className="grip-row-button">
                <FontAwesomeIcon icon={faGripLines} />
            </td>
        </tr>
    );
}

export default TaskRow;
