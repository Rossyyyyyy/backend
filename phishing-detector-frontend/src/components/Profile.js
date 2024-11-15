import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Retrieve token or user identifier from localStorage
                const token = localStorage.getItem('authToken');
                const email = localStorage.getItem('email');

                if (!token || !email) {
                    throw new Error("User is not logged in.");
                }

                // Set up authorization headers
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Fetch user data
                const response = await axios.get(`http://localhost:8000/users/${email}`, config);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data. Please try again.');
            }
        };

        fetchUserData();
    }, []);

    return (
        <div style={{ backgroundColor: '#D76C82', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{ backgroundColor: '#B03052', padding: '1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: 'white', margin: 0 }}>User Profile</h1>
                <div>
                    <Link to="/account-dash" style={{ color: 'white', textDecoration: 'none', marginRight: '1em', padding: '0.75em', backgroundColor: '#B03052', borderRadius: '4px' }}>Home</Link>
                    <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '1em', padding: '0.75em', backgroundColor: '#B03052', borderRadius: '4px' }}>Profile</Link>
                    <Link to="/history" style={{ color: 'white', textDecoration: 'none', marginRight: '1em', padding: '0.75em', backgroundColor: '#B03052', borderRadius: '4px' }}>History</Link>
                    {/* Dropdown for email */}
                    <div className="dropdown" style={{ display: 'inline-block' }}>
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            {userData ? userData.email : 'Loading...'}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li>
                                <button className="dropdown-item" onClick={() => {
                                    localStorage.removeItem('authToken');
                                    localStorage.removeItem('email');
                                    window.location.href = '/login';
                                }}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2em' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <h2 className="text-center mb-4">User Details</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    {userData ? (
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <p><strong>Username:</strong> {userData.username}</p>
                                <p><strong>First Name:</strong> {userData.first_name}</p>
                                <p><strong>Last Name:</strong> {userData.last_name}</p>
                                <p><strong>Email:</strong> {userData.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center">Loading user data...</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer style={{ backgroundColor: '#B03052', padding: '1em', textAlign: 'center', color: 'white' }}>
                Your safety, Our priority
            </footer>
        </div>
    );
}

export default Profile;
