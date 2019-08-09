import React from 'react';

function ErrorMessage({ show, errorList, onClose }) {
    return (
        show && (
            <div
                id="error-alert"
                className="alert alert-danger alert-dismissible fade show fixed-top"
                role="alert"
            >
                <strong>Save Failed!</strong> You have the following error(s):
                <span>{errorList}</span>
                <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        )
    );
}

export default ErrorMessage;
