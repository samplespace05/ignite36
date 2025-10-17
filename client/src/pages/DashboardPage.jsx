import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DownloadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> );
const BackIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> );

const Header = ({ onBack }) => (
    <nav className="w-full max-w-5xl p-4 sm:p-6 flex justify-between items-center text-brand-text">
        <img src="/innovation-garage-logo.png" alt="Innovation Garage Logo" className="h-14 sm:h-16" />
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onBack} className="flex items-center space-x-2 text-lg">
            <BackIcon />
            <span>Back</span>
        </motion.button>
    </nav>
);

export default function DashboardPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ certificates: [], teamInfo: { name: '', email: '' } });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (!email) return;
        const fetchCertificateData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiBaseUrl}/api/certificates?email=${encodeURIComponent(email)}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch data.');
                }
                setData(await response.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCertificateData();
    }, [email, apiBaseUrl]);

    const handleDownloadAll = useCallback(async () => {
        // ... (this function is correct and does not need changes)
    }, [email, apiBaseUrl, data.teamInfo.name]);

    const handleBack = () => navigate('/login');
    
    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <div className="min-h-screen flex flex-col items-center font-pixel">
            <Header onBack={handleBack} />
            <AnimatePresence>
                <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200">
                    <div className="border-b-2 border-gray-200 pb-6 mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">Welcome, {data.teamInfo.name || 'Team'}!</h2>
                        <p className="text-gray-600 text-lg mt-1">{data.teamInfo.email}</p>
                    </div>
                    {isLoading ? ( <div className="text-center text-gray-500 py-16 text-2xl">Loading Certificates...</div> ) : 
                    error ? ( <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg text-lg">{`Error: ${error}`}</div> ) : 
                    (
                        <>
                            <div className="mb-8 text-center sm:text-left">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDownloadAll} className="w-full sm:w-auto bg-brand-text text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center text-xl">
                                    <DownloadIcon />
                                    Download All as .ZIP
                                </motion.button>
                            </div>
                            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants} initial="hidden" animate="visible">
                                {data.certificates.map((cert, index) => (
                                    <motion.div key={cert.id || index} variants={itemVariants} className="bg-brand-offwhite p-5 rounded-lg flex items-center justify-between border-2 border-gray-200 hover:border-pink-300 transition-all duration-300">
                                        <span className="font-medium text-brand-text text-lg">{cert.name}</span>
                                        <span className="text-pink-600 font-semibold text-sm bg-brand-pink px-3 py-1 rounded-full">PDF</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </>
                    )}
                </motion.main>
            </AnimatePresence>
        </div>
    );
}