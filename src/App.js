import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './App.css';
import ErrorMessage from './error-message';
import TaskSection from './task-section';
import NotificationSection from './notification-section';
import WhatsNew from './whats-new';

function App() {
    const [showError, setShowError] = useState(false);
    const [whatsNew, setWhatsNew] = useState(false);

    function handleCloseError() {
        setShowError(false);
    }

    useEffect(() => {
        const parsedUrl = queryString.parse(document.location.search);
        if (parsedUrl.whatsNew === 'true') setWhatsNew(true);
    }, []);

    return (
        <div>
            <ErrorMessage show={showError} onClose={handleCloseError} />
            {whatsNew && (
                <WhatsNew
                    onClose={() => {
                        setWhatsNew(false);
                    }}
                />
            )}
            <div className="container">
                <img
                    className="main-help"
                    src="images/question.svg"
                    alt="question"
                    title="What's New"
                    onClick={() => { setWhatsNew(true); }}
                />
                <h1 className="title-text">Relay Time Options</h1>
                <TaskSection />
                <NotificationSection />
            </div>
        </div>
    );
}

export default App;
