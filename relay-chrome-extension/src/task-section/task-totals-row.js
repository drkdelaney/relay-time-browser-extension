import React, { Component } from 'react';

class TaskTotalsRow extends Component {
    render() {
        const { tasks } = this.props;
        const total = tasks.reduce((sum, { ratio }) => sum + ratio, 0);
        return <tr>
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
                    value={total}
                    disabled
                />
            </td>
            <td />
        </tr>
    }
}

export default TaskTotalsRow;
