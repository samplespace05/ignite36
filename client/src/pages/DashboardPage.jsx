import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DownloadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> );
const BackIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> );

const Header = ({ onBack }) => (
    <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
             <img src="/innovation-garage-logo.png" alt="Innovation Garage Logo" className="h-10 sm:h-12" />
             <div className="border-l-2 border-gray-600 h-8"></div>
             <img src="/sih-logo.png" alt="Smart India Hackathon Logo" className="h-10 sm:h-12" />
        </div>
         <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200">
            <BackIcon />
            <span className="hidden sm:inline">Back to Login</span>
        </motion.button>
    </header>
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
        if (!email) return;
        try {
            const response = await fetch(`${apiBaseUrl}/api/certificates/download-all?email=${encodeURIComponent(email)}`);
            if (!response.ok) throw new Error('Download failed.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${data.teamInfo.name || 'team'}-certificates.zip`;
            document.body.appendChild(a);
a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            setError(err.message);
        }
    }, [email, apiBaseUrl, data.teamInfo.name]);

    const handleBack = () => navigate('/login');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <Header onBack={handleBack} />
            <AnimatePresence>
                <motion.main initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                    <div className="border-b border-gray-700 pb-6 mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {data.teamInfo.name || 'Team'}!</h2>
                        <p className="text-gray-400 mt-1">Certificates for {data.teamInfo.email}</p>
                    </div>
                    {isLoading ? ( <div className="text-center text-gray-400 py-16">Loading certificate data...</div> ) : 
                    error ? ( <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{`Error: ${error}`}</div> ) : 
                    (
                        <>
                            <div className="mb-8 text-center sm:text-left">
                                <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(99, 102, 241)" }} whileTap={{ scale: 0.95 }} onClick={handleDownloadAll} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <DownloadIcon />
                                    Download All as .ZIP
                                </motion.button>
                            </div>
                            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" variants={containerVariants} initial="hidden" animate="visible">
                                {data.certificates.map((cert, index) => (
                                    <motion.div key={cert.id || index} variants={itemVariants} className="bg-gray-700/50 p-5 rounded-lg flex items-center justify-between border border-transparent hover:border-indigo-500 transition-all duration-300">
                                        <span className="font-medium text-gray-300">{cert.name}</span>
                                        <span className="text-indigo-400 font-semibold text-sm bg-indigo-900/50 px-3 py-1 rounded-full">PDF</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </>
                    )}
                </motion.main>
            </AnimatePresence>
             <footer className="w-full max-w-5xl text-center text-gray-500 mt-8 text-sm">
                <p>&copy; 2025 Ignite 36 Hackathon. All Rights Reserved.</p>
            </footer>
        </div>
    );
}