import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { sendLoginEmail } from '../services/emailService.js';
import crypto from 'crypto';

const generateToken = (payload, expiresIn) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const handleLoginRequest = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'If an account with this email exists, a login link has been sent.' });
        }

        const magicToken = crypto.randomBytes(32).toString('hex');
        const magicTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.magicToken = magicToken;
        user.magicTokenExpires = magicTokenExpires;
        await user.save();

        const magicLink = `${process.env.FRONTEND_URL}/verify/${magicToken}`;
        
        await sendLoginEmail(user.email, magicLink);

        res.status(200).json({ message: 'If an account with this email exists, a login link has been sent.' });
    } catch (error) {
        console.error('Error in login request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyMagicToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const user = await User.findOne({
            magicToken: token,
            magicTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        user.magicToken = null;
        user.magicTokenExpires = null;
        await user.save();

        const sessionToken = generateToken({ id: user._id, email: user.email }, '8h');

        res.json({
            token: sessionToken,
            user: {
                teamName: user.teamName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Server error' });
    }
};