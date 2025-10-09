import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VerifyPage from './pages/VerifyPage';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('session_token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify/:token" element={<VerifyPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
                {/* Default route redirects to login or dashboard */}
                <Route 
                  path="*" 
                  element={localStorage.getItem('session_token') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
                />
            </Routes>
        </Router>
    );
}

export default App;