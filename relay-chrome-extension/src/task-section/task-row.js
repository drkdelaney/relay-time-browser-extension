import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faGripLines } from '@fortawesome/free-solid-svg-icons';

class TaskRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratio: props.ratio || 0
        }
    }

    handleRatioChange = (e) => {
        const value = e.target.value;
        const { onRatioChange } = this.props;
        onRatioChange(parseFloat(value));
    }

    render() {
        const {
            task: { name, ratio },
            onDeleteTask,
            onRatioBlur
        } = this.props;
        return (
            <tr draggable="true" className="dragon-drop">
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
