import User from '../models/userModel.js';

export const checkEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ exists: true, email: user.email });
        } else {
            return res.status(404).json({ exists: false, message: 'This email is not registered.' });
        }
    } catch (error) {
        console.error("Error in checkEmail:", error);
        res.status(500).json({ message: 'Server error' });
    }
};