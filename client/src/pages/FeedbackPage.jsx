import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FeedbackPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        valuableAspects: '',
        improvementAreas: '',
        overallExperience: '',
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        try {
            const response = await fetch(`${apiBaseUrl}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, ...formData }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to submit feedback.');
            }
            navigate(`/dashboard/${encodeURIComponent(email)}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = !formData.valuableAspects || !formData.improvementAreas || !formData.overallExperience;

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-2xl">
                <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Event Feedback</h1>
                    <p className="text-gray-400 text-center mb-8">Please share your thoughts before proceeding.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="valuableAspects" className="block text-sm font-medium text-gray-300 mb-2">🧩 What aspects of the hackathon did you find most valuable?</label>
                            <textarea id="valuableAspects" name="valuableAspects" rows="3" value={formData.valuableAspects} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="improvementAreas" className="block text-sm font-medium text-gray-300 mb-2">⚙️ Were there any challenges or areas for improvement?</label>
                            <textarea id="improvementAreas" name="improvementAreas" rows="3" value={formData.improvementAreas} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="overallExperience" className="block text-sm font-medium text-gray-300 mb-2">📈 How would you rate your overall experience, and would you participate again?</label>
                            <textarea id="overallExperience" name="overallExperience" rows="3" value={formData.overallExperience} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading || isSubmitDisabled} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {isLoading ? 'Submitting...' : 'Submit & Go to Downloads'}
                        </motion.button>
                    </form>
                    {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
                </div>
            </motion.div>
        </div>
    );
}