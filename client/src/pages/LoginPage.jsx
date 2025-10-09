import React, { useState, useEffect } from 'react'; // <-- Make sure to import useEffect

const Header = () => (
    <header className="w-full max-w-md flex justify-center items-center space-x-4 mb-8">
        <img src="/innovation-garage-logo.png" alt="Innovation Garage Logo" className="h-12 sm:h-14" />
        <div className="border-l-2 border-gray-500 h-10"></div>
        <img src="/sih-logo.png" alt="Smart India Hackathon Logo" className="h-12 sm:h-14" />
    </header>
);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // --- THIS IS THE NEW HEALTH CHECK CODE ---
    useEffect(() => {
        const checkServerHealth = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            console.log(`Attempting to contact server at: ${apiBaseUrl}`);
            try {
                const response = await fetch(`${apiBaseUrl}/api/health`);
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                const data = await response.json();
                console.log('✅ SUCCESS: Server health check passed!', data);
            } catch (error) {
                console.error('❌ FAILED: Could not connect to the backend server. Check the VITE_API_URL and CORS settings.', error);
            }
        };
        checkServerHealth();
    }, []);
    // ------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred.');
            }
            setMessage(data.message);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center p-4 bg-cover bg-center"
            style={{ backgroundImage: "url('/ignite-poster.png')" }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 w-full flex flex-col justify-center items-center">
                <Header />
                <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Team Leader Login</h1>
                    <p className="text-gray-300 text-center mb-6">Enter your registered email to receive a magic link.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@college.edu"
                                required
                                className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Magic Link'}
                        </button>
                    </form>

                    {message && <div className="mt-4 text-center text-green-300 bg-green-900/50 p-3 rounded-lg">{message}</div>}
                    {error && <div className="mt-4 text-center text-red-300 bg-red-900/50 p-3 rounded-lg">{error}</div>}
                </div>
                 <footer className="w-full max-w-5xl text-center text-gray-300 mt-8 text-sm">
                    <p>&copy; 2025 Ignite 36 Hackathon. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    );
}