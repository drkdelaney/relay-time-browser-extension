import React from 'react';

function TaskTotalsRow({ tasks }) {
    const total = tasks.reduce((sum, { ratio }) => sum + parseFloat(ratio || 0), 0);
    return (
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
                    value={total.toFixed(2)}
                    disabled
                />
            </td>
            <td />
        </tr>
    );
}

export default TaskTotalsRow;
