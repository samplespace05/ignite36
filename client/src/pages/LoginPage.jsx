import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => (
    <nav className="w-full p-4 sm:p-6 flex justify-between items-center text-brand-text">
        <div className="text-lg">T:</div>
        <div className="hidden sm:flex items-center space-x-6 text-lg">
            <span>INNOVATE</span>
            <span>IDEATE</span>
            <span>INCUBATE</span>
        </div>
        <div className="flex items-center space-x-2">
            <img src="/sih-logo.png" alt="SIH Logo" className="h-10" />
            <span className="font-bold text-sm leading-tight">CENTER FOR<br/>INNOVATION<br/>INCUBATION</span>
        </div>
    </nav>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col font-pixel">
            <Header />
            <main className="flex-grow flex flex-col justify-center items-center p-4">
                <img src="/innovation-garage-logo.png" alt="Innovation Garage Logo" className="h-24 sm:h-32 mb-8" />
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl bg-brand-offwhite px-4 py-2 rounded-md inline-block shadow-md">INNOVATION GARAGE'S</h1>
                    <h2 className="text-6xl sm:text-8xl bg-brand-pink px-4 py-1 rounded-full inline-block mt-4 shadow-md">IGNITE 36</h2>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="w-full max-w-sm bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-200">
                    <p className="text-center text-lg mb-4">Enter your registered email to proceed.</p>
                    <form onSubmit={handleSubmit}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@college.edu" required className="w-full text-lg px-4 py-2 bg-white border-2 border-brand-text rounded-md focus:outline-none focus:border-pink-400" />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="w-full mt-4 text-xl bg-brand-text text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-gray-400">
                            {isLoading ? 'Checking...' : 'Proceed'}
                        </motion.button>
                    </form>
                    {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded-md">{error}</div>}
                </motion.div>
            </main>
            <footer className="w-full p-4 text-lg flex justify-between items-center">
                <span>Press / for ?</span>
                <a href="mailto:hello@toyfight.co" className="bg-yellow-300 px-2 rounded-sm">hello@toyfight.co</a>
            </footer>
        </div >
    );
}