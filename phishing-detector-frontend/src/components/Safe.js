import React, { useEffect, useState } from 'react';

function Safe() {
    const [safeContent, setSafeContent] = useState([]);

    useEffect(() => {
        const fetchSafeContent = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/get-safe-content', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setSafeContent(data.safeContent);
                } else {
                    console.error('Failed to fetch safe content:', data);
                }
            } catch (error) {
                console.error('Error fetching safe content:', error);
            }
        };

        fetchSafeContent();
    }, []);

    return (
        <div style={{ padding: '2em' }}>
            <h1>Safe Content</h1>
            <div>
                {safeContent.length === 0 ? (
                    <p>No safe content found.</p>
                ) : (
                    <ul>
                        {safeContent.map((item) => (
                            <li key={item.id}>
                                <strong>{item.subject}</strong> - {item.sender}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Safe;
