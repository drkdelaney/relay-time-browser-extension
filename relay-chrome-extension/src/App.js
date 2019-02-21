import React, { Component } from 'react';
import './App.css';
import ErrorMessage from './error-message';
import TaskSection from './task-section';
import NotificationSection from './notification-section';

class App extends Component {
    state = {
        showError: false
    }

    handleCloseError = () => {
        this.setState({ showError: false });
    }

    render() {
        const { showError } = this.state;
        return <div>
            <ErrorMessage show={showError} onClose={this.handleCloseError} />
            <div className="container">
                <h1 className="title">Relay Time Options</h1>
                <TaskSection />
                <NotificationSection />
            </div>
        </div>;
    }
}

export default App;
