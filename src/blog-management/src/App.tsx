import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Routes from './routes';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes />
        </Router>
    );
};

export default App;