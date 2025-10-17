import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- THIS IS THE UPDATED HEADER ---
const Header = () => (
    <nav className="w-full p-4 sm:p-6 flex justify-between items-center text-brand-text">
        {/* SIH Logo in the top-left */}
        <img src="/sih-logo.png" alt="SIH Logo" className="h-10 sm:h-12" />

        {/* Centered navigation text */}
        <div className="hidden sm:flex items-center space-x-8 text-lg tracking-widest absolute left-1/2 -translate-x-1/2">
            <span>INNOVATE</span>
            <span>IDEATE</span>
            <span>INCUBATE</span>
        </div>
        
        {/* IG Logo and Text on the right */}
        <div className="flex items-center space-x-3">
            <img src="/innovation-garage-logo.png" alt="Innovation Garage Logo" className="h-10 sm:h-12" />
            <span className="font-bold text-xs sm:text-sm leading-tight text-right">CENTER FOR<br/>INNOVATION<br/>INCUBATION</span>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col font-pixel bg-brand-blue">
            <Header />
            <main className="flex-grow w-full flex flex-col justify-center items-center p-4 -mt-16"> {/* Negative margin to pull content up */}
                {/* --- THIS IS THE UPDATED MAIN CONTENT SECTION FOR PERFECT ALIGNMENT --- */}
                <div className="text-center">
                    <motion.h1 
                        initial={{ x: -20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ delay: 0.2 }} 
                        className="text-4xl sm:text-5xl bg-brand-offwhite px-4 py-2 rounded-md inline-block shadow-md tracking-widest"
                    >
                        INNOVATION GARAGE'S
                    </motion.h1>
                    <motion.h2 
                        initial={{ x: 20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ delay: 0.3 }} 
                        className="text-6xl sm:text-8xl bg-brand-pink px-6 py-2 rounded-full inline-block mt-4 shadow-md tracking-wider relative left-4 sm:left-8" // Offset to the right
                    >
                        IGNITE 36
                    </motion.h2>
                </div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4, duration: 0.5 }} 
                    className="w-full max-w-sm bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-200 mt-12"
                >
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter your registered email" 
                            required 
                            className="w-full text-lg px-4 py-2 bg-white border-2 border-brand-text rounded-md focus:outline-none focus:border-pink-400 placeholder:text-gray-500" 
                        />
                        <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }} 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full mt-4 text-xl bg-brand-text text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-gray-400"
                        >
                            {isLoading ? '...' : 'Proceed'}
                        </motion.button>
                    </form>
                    {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded-md text-lg">{error}</div>}
                </motion.div>
            </main>
            <footer className="w-full p-4 text-lg text-right">
                <a href="mailto:hello@toyfight.co" className="bg-yellow-300 px-2 rounded-sm hover:bg-yellow-400 transition-colors">hello@toyfight.co</a>
            </footer>
        </motion.div >
    );
}