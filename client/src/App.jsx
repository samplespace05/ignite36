import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VerifyPage from './pages/VerifyPage';

// The main App component now manages the authentication state.
function App() {
    // This state is the single source of truth for whether a user is logged in.
    // We initialize it by checking localStorage for a token from a previous session.
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('session_token'));

    // This function is passed to VerifyPage and is called on a successful login.
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    
    // This function is passed to DashboardPage for the logout button.
    const handleLogout = () => {
        localStorage.removeItem('session_token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                {/* If the user is authenticated, they can't go to the login page. */}
                <Route 
                    path="/login" 
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
                />

                {/* The VerifyPage gets the function to call upon success. */}
                <Route 
                    path="/verify/:token" 
                    element={<VerifyPage onLoginSuccess={handleLoginSuccess} />} 
                />

                {/* The new, simpler PrivateRoute logic. It uses the state variable, not localStorage. */}
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <DashboardPage onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                
                {/* A catch-all route that sends users to the correct page based on their auth state. */}
                <Route 
                  path="*" 
                  element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
                />
            </Routes>
        </Router>
    );
}

export default App;