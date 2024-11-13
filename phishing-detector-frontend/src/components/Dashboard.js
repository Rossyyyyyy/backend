import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div style={{ backgroundColor: '#D76C82', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{ backgroundColor: '#B03052', padding: '1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: 'white', margin: 0 }}>Email Phishing Detector</h1>
                <div>
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '1em' }}>Login</Link>
                    <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
                </div>
            </nav>

            {/* Main content */}
            <div style={{ flex: 1, padding: '2em', textAlign: 'center' }}>
                <h1>Dashboard</h1>
                <p>Welcome to the Dashboard!</p>
            </div>

            {/* Footer */}
            <footer style={{ backgroundColor: '#B03052', padding: '1em', textAlign: 'center', color: 'white' }}>
                Your safety, Our priority
            </footer>
        </div>
    );
}

export default Dashboard;
