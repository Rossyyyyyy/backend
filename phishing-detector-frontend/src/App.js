import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PhishingDetector from './components/PhishingDetector';
import AccountDash from './components/AccountDash';
import Profile from './components/Profile'; // Import the Profile component
import History from './components/History'; // Import the History component

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} /> {/* Default route */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/detect" element={<PhishingDetector />} />
                <Route path="/account-dash" element={<AccountDash />} />
                <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
                <Route path="/history" element={<History />} /> {/* Add history route */}

            </Routes>
        </Router>
    );
}

export default App;
