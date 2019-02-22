import React, { Component } from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faGripLines } from '@fortawesome/free-solid-svg-icons';

class TaskRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratio: props.ratio || 0,
            className: null
        };
    }

    defaultProps = {
        onDragStart: () => {},
        onDrop: () => {},
    }

    handleRatioChange = e => {
        const value = e.target.value;
        const { onRatioChange } = this.props;
        onRatioChange(parseFloat(value));
    };

    handleDragOver = e => {
        e.preventDefault();
        setTimeout(() => {
            this.setState({ className: 'dragover' })
        }, 0)
        this.props.onDragOver(e);
    };
    
    handleDragLeave = e => {
        setTimeout(() => {
            this.setState({ className: null })
        }, 0)
    };

    render() {
        const {
            task: { name, ratio },
            onDeleteTask,
            onRatioBlur,
            dragClassName,
            onDragStart,
            onDrop
        } = this.props;
        const { className } = this.state;
        return (
            <tr
                draggable="true"
                className={cx('dragon-drop', dragClassName, className)}
                onDragStart={onDragStart}
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
                onDrop={onDrop}
            >
                <td className="delete-row-button">
                    <FontAwesomeIcon
                        icon={faMinusCircle}
                        onClick={onDeleteTask}
                    />
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
                        onChange={this.handleRatioChange}
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
}

export default TaskRow;
