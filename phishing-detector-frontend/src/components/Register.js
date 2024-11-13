import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/axiosConfig';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { username, email, password };

        try {
            await registerUser(data);
            setSuccess('Registration successful!');
            setError(null);
            window.alert('Account registered successfully'); // Show success alert
            navigate('/login'); // Redirect to login page
        } catch (err) {
            setError('Registration failed: ' + (err.response?.data?.detail || err.message));
            setSuccess(null);
        }
    };

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
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2em' }}>
                <div style={{ backgroundColor: 'white', padding: '2em', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
                    <h2 className="text-center mb-4">Create an Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '0.75em', backgroundColor: '#B03052', color: 'white', border: 'none', borderRadius: '4px' }}>Register</button>
                    </form>
                    {error && <p className="text-danger mt-3" style={{ color: 'red' }}>{error}</p>}
                    {success && <p className="text-success mt-3" style={{ color: 'green' }}>{success}</p>}
                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login" style={{ color: '#B03052' }}>Login here</Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ backgroundColor: '#B03052', padding: '1em', textAlign: 'center', color: 'white' }}>
                Your safety, Our priority
            </footer>
        </div>
    );
}

export default Register;
