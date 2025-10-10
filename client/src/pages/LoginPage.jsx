import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => (
    <header className="w-full max-w-lg flex justify-around items-center space-x-4 mb-8">
        <img src="/innovation-garage-logo.png" alt="Innovation Garage Logo" className="h-16 sm:h-20" />
        <div className="border-l-2 border-gray-500 h-12"></div>
        <img src="/sih-logo.png" alt="Smart India Hackathon Logo" className="h-16 sm:h-20" />
    </header>
);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred.');
            
            if (data.exists) {
                if (data.hasSubmittedFeedback) {
                    navigate(`/dashboard/${encodeURIComponent(data.email)}`);
                } else {
                    navigate(`/feedback/${encodeURIComponent(data.email)}`);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('/ignite-poster.png')" }}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full flex flex-col justify-center items-center">
                <Header />
                <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Team Leader Portal</h1>
                    <p className="text-gray-300 text-center mb-6">Enter your registered email to get your certificates.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@college.edu" required className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Checking...' : 'Proceed'}
                        </motion.button>
                    </form>
                    {error && <div className="mt-4 text-center text-red-300 bg-red-900/50 p-3 rounded-lg">{error}</div>}
                </div>
                <footer className="w-full max-w-5xl text-center text-gray-300 mt-8 text-sm">
                    <p>&copy; 2025 Ignite 36 Hackathon. All Rights Reserved.</p>
                </footer>
            </motion.div>
        </div>
    );
}