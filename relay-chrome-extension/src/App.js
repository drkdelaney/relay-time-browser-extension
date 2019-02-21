import React, { Component } from 'react';
import './App.css';
import ErrorMessage from './error-message';
import TaskSection from './task-section';

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
            <TaskSection />
        </div>;
    }
}

export default App;
