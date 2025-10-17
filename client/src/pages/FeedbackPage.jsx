import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FeedbackPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ valuableAspects: '', improvementAreas: '', overallExperience: '' });

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
            if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Failed to submit feedback.'); }
            navigate(`/dashboard/${encodeURIComponent(email)}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = !formData.valuableAspects || !formData.improvementAreas || !formData.overallExperience;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 font-pixel bg-brand-blue">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-bold text-brand-text text-center mb-2 tracking-wider">EVENT FEEDBACK</h1>
                <p className="text-gray-600 text-center text-lg mb-8">Your thoughts help us improve.</p>
                <form onSubmit={handleSubmit} className="space-y-6 text-lg">
                    <div>
                        <label htmlFor="valuableAspects" className="block font-medium text-brand-text mb-2">🧩 Most Valuable Aspects?</label>
                        <textarea id="valuableAspects" name="valuableAspects" rows="3" value={formData.valuableAspects} onChange={handleChange} required className="w-full px-4 py-2 bg-white border-2 border-brand-text rounded-md focus:outline-none focus:border-pink-400" />
                    </div>
                    <div>
                        <label htmlFor="improvementAreas" className="block font-medium text-brand-text mb-2">⚙️ Areas for Improvement?</label>
                        <textarea id="improvementAreas" name="improvementAreas" rows="3" value={formData.improvementAreas} onChange={handleChange} required className="w-full px-4 py-2 bg-white border-2 border-brand-text rounded-md focus:outline-none focus:border-pink-400" />
                    </div>
                    <div>
                        <label htmlFor="overallExperience" className="block font-medium text-brand-text mb-2">📈 Overall Experience / Would you participate again?</label>
                        <textarea id="overallExperience" name="overallExperience" rows="3" value={formData.overallExperience} onChange={handleChange} required className="w-full px-4 py-2 bg-white border-2 border-brand-text rounded-md focus:outline-none focus:border-pink-400" />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading || isSubmitDisabled} className="w-full text-xl bg-brand-text text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-gray-400">
                        {isLoading ? '...' : 'Submit & Get Certificates'}
                    </motion.button>
                </form>
                {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded-md">{error}</div>}
            </motion.div>
        </div>
    );
}