import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// The component now accepts a prop to notify the parent App component of a successful login.
export default function VerifyPage({ onLoginSuccess }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your login link...');
    const [error, setError] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            try {
                const response = await fetch(`${apiBaseUrl}/api/auth/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed.');
                }
                
                // 1. Still save the token for future page reloads.
                localStorage.setItem('session_token', data.token);
                
                // 2. CRITICAL FIX: Call the function from App.jsx to update the central state.
                onLoginSuccess();
                
                setMessage('Success! Redirecting to your dashboard...');
                setError(false);

                // 3. Navigate after a short delay to ensure state has updated.
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 1000);

            } catch (err) {
                setError(true);
                setMessage(err.message);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setError(true);
            setMessage('No verification token found. Please return to the login page.');
            setTimeout(() => navigate('/login', { replace: true }), 3000);
        }
    }, [token, navigate, onLoginSuccess]);

    return (
        <div className="bg-gray-900 min-h-screen flex justify-center items-center p-4">
            <div className={`w-full max-w-md text-center p-8 rounded-xl shadow-2xl ${error ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
                <h1 className="text-2xl font-bold">{message}</h1>
            </div>
        </div>
    );
}