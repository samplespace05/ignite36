import Feedback from '../models/feedbackModel.js';
import User from '../models/userModel.js';

export const submitFeedback = async (req, res) => {
    const { email, valuableAspects, improvementAreas, overallExperience } = req.body;
    if (!email || !valuableAspects || !improvementAreas || !overallExperience) {
        return res.status(400).json({ message: 'All feedback fields are required.' });
    }
    try {
        await Feedback.findOneAndUpdate(
            { email },
            { valuableAspects, improvementAreas, overallExperience },
            { new: true, upsert: true, runValidators: true }
        );
        await User.updateOne({ email }, { $set: { hasSubmittedFeedback: true } });
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while submitting feedback.' });
    }
};