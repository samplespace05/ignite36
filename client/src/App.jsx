import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VerifyPage from './pages/VerifyPage';

const LoadingSpinner = () => (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

function App() {
    const [authState, setAuthState] = useState('checking');
    
    useEffect(() => {
        console.log(`%c[APP] Auth state changed to: ${authState}`, 'color: #00A8F7; font-weight: bold;');
    }, [authState]);

    useEffect(() => {
        console.log("[APP] Initial load: Checking for existing session token...");
        const token = localStorage.getItem('session_token');
        if (token) {
            console.log("[APP] Token found. Setting state to 'authenticated'.");
            setAuthState('authenticated');
        } else {
            console.log("[APP] No token found. Setting state to 'unauthenticated'.");
            setAuthState('unauthenticated');
        }
    }, []);

    const handleLoginSuccess = () => {
        console.log("[APP] handleLoginSuccess called! Setting auth state to 'authenticated'.");
        setAuthState('authenticated');
    };
    
    const handleLogout = () => {
        console.log("[APP] handleLogout called! Removing token and setting state to 'unauthenticated'.");
        localStorage.removeItem('session_token');
        setAuthState('unauthenticated');
    };

    if (authState === 'checking') {
        return <LoadingSpinner />;
    }

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={authState === 'authenticated' ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
                />
                <Route 
                    path="/verify/:token" 
                    element={<VerifyPage onLoginSuccess={handleLoginSuccess} />} 
                />
                <Route
                    path="/dashboard"
                    element={
                        authState === 'authenticated' ? (
                            <DashboardPage onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route 
                  path="*" 
                  element={<Navigate to={authState === 'authenticated' ? "/dashboard" : "/login"} replace />} 
                />
            </Routes>
        </Router>
    );
}

export default App;