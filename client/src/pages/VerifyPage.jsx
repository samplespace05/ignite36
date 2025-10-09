import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerifyPage({ onLoginSuccess }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your login link...');
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log("%c[VERIFY PAGE] Component has mounted. Starting verification process.", 'color: #9f7aea; font-weight: bold;');
        
        const verifyToken = async () => {
            if (!token) {
                console.error("❌ [VERIFY PAGE] FATAL: No token found in URL. Cannot proceed.");
                setError(true);
                setMessage('No verification token found. Please return to the login page.');
                setTimeout(() => navigate('/login', { replace: true }), 3000);
                return;
            }

            console.log(`-> [VERIFY PAGE] Found token in URL: ${token.substring(0,10)}...`);
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            
            try {
                console.log("-> [VERIFY PAGE] Sending token to backend for verification...");
                const response = await fetch(`${apiBaseUrl}/api/auth/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                console.log(`-> [VERIFY PAGE] Received response from backend with status: ${response.status}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed.');
                }
                
                console.log("-> [VERIFY PAGE] Verification successful. Saving session token to localStorage...");
                localStorage.setItem('session_token', data.token);
                
                console.log("-> [VERIFY PAGE] Token saved. Calling onLoginSuccess() to update App state...");
                onLoginSuccess();
                
                setMessage('Success! You are now logged in. Redirecting...');
                setError(false);

                // We navigate to the dashboard only AFTER the state has been updated.
                navigate('/dashboard', { replace: true });
                console.log("-> [VERIFY PAGE] Navigation to /dashboard initiated.");

            } catch (err) {
                console.error("❌ [VERIFY PAGE] An error occurred during verification:", err);
                setError(true);
                setMessage(err.message || "An unknown error occurred.");
            }
        };
        
        verifyToken();

    }, [token, navigate, onLoginSuccess]);

    return (
        <div className="bg-gray-900 min-h-screen flex justify-center items-center p-4">
            <div className={`w-full max-w-md text-center p-8 rounded-xl shadow-2xl ${error ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
                <h1 className="text-2xl font-bold">{message}</h1>
            </div>
        </div>
    );
}