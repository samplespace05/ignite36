import React, { useState, useEffect, useCallback } from 'react';

// This helper function prepares API requests with the correct URL and auth token.
const getApiClient = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const token = localStorage.getItem('session_token');

    const makeRequest = async (url, options = {}) => {
        const headers = { 'Authorization': `Bearer ${token}`, ...options.headers };
        const response = await fetch(`${apiBaseUrl}${url}`, { ...options, headers });
        
        if (response.status === 401) {
             localStorage.removeItem('session_token');
             window.location.href = '/login'; // If token is invalid, force a logout
             throw new Error('Session expired.');
        }
        return response;
    };

    return {
        getCertificateData: async () => {
            const res = await makeRequest('/api/certificates');
            if (!res.ok) throw new Error('Failed to fetch certificate data.');
            return res.json();
        },
        downloadAllCertificates: async (teamName) => {
            const response = await makeRequest('/api/certificates/download-all');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${teamName}-certificates.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        }
    };
};

// SVG Icon Components
const DownloadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> );

// The Header component now receives the onLogout function as a prop.
const Header = ({ onLogout }) => (
    <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
             <img src="/innovation-garage-logo.png" alt="Innovation Garage Logo" className="h-10 sm:h-12" />
             <div className="border-l-2 border-gray-600 h-8"></div>
             <img src="/sih-logo.png" alt="Smart India Hackathon Logo" className="h-10 sm:h-12" />
        </div>
         <button 
            onClick={onLogout} // Use the passed-in onLogout function here.
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200">
            <LogoutIcon />
            <span className="hidden sm:inline">Logout</span>
        </button>
    </header>
);

// The DashboardPage now accepts onLogout and passes it down to the Header.
export default function DashboardPage({ onLogout }) {
    const [data, setData] = useState({ certificates: [], teamInfo: { name: '', email: '' } });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // We memoize the apiClient so it's not recreated on every render
    const apiClient = useCallback(getApiClient, [])();

    useEffect(() => {
        apiClient.getCertificateData()
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, [apiClient]);

    const handleDownloadAll = useCallback(() => {
        if (!data.teamInfo.name) return;
        apiClient.downloadAllCertificates(data.teamInfo.name).catch(err => setError(err.message));
    }, [apiClient, data.teamInfo.name]);

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <Header onLogout={onLogout} />
            <main className="w-full max-w-5xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                <div className="border-b border-gray-700 pb-6 mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {data.teamInfo.name || 'Team'}!</h2>
                    <p className="text-gray-400 mt-1">Certificates for {data.teamInfo.email}</p>
                </div>
                
                {isLoading ? ( <div className="text-center text-gray-400 py-8">Loading certificate data...</div> ) : 
                error ? ( <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{`Error: ${error}`}</div> ) : 
                (
                    <>
                        <div className="mb-8">
                            <button
                                onClick={handleDownloadAll}
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                <DownloadIcon />
                                Download All as .ZIP
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {data.certificates.map((cert, index) => (
                                <div key={cert.id || index} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between transition-shadow duration-300 hover:shadow-lg hover:shadow-indigo-900/20">
                                    <span className="font-medium">{cert.name}</span>
                                    <span className="text-indigo-400 font-semibold text-sm">PDF</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
             <footer className="w-full max-w-5xl text-center text-gray-500 mt-8 text-sm">
                <p>&copy; 2025 Ignite 36 Hackathon. All Rights Reserved.</p>
            </footer>
        </div>
    );
}