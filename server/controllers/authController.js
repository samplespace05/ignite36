import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { sendLoginEmail } from '../services/emailService.js';
import crypto from 'crypto';

const generateToken = (payload, expiresIn) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const handleLoginRequest = async (req, res) => {
    console.log("--- [AUTH] handleLoginRequest: Function started ---");
    const { email } = req.body;
    if (!email) {
        console.log("-> [AUTH] Email is missing from request.");
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        console.log(`-> [AUTH] Searching for user with email: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log("-> [AUTH] User not found in database. Sending generic success response.");
            return res.status(200).json({ message: 'If an account with this email exists, a login link has been sent.' });
        }
        
        console.log(`-> [AUTH] User found: ${user.email}. Generating magic token.`);
        const magicToken = crypto.randomBytes(32).toString('hex');
        const magicTokenExpires = Date.now() + 15 * 60 * 1000;

        user.magicToken = magicToken;
        user.magicTokenExpires = magicTokenExpires;
        await user.save();
        console.log("-> [AUTH] Magic token saved to database.");

        const magicLink = `${process.env.FRONTEND_URL}/verify/${magicToken}`;
        console.log(`-> [AUTH] Generated magic link. Preparing to send email...`);
        
        await sendLoginEmail(user.email, magicLink);

        console.log("--- [AUTH] handleLoginRequest: Function finished successfully. ---");
        res.status(200).json({ message: 'If an account with this email exists, a login link has been sent.' });

    } catch (error) {
        console.error('❌ [AUTH] CRITICAL ERROR in handleLoginRequest:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyMagicToken = async (req, res) => {
    console.log("--- [VERIFY] verifyMagicToken: Function started ---");
    const { token } = req.body;
    if (!token) {
        console.log("-> [VERIFY] Token is missing from request body.");
        return res.status(400).json({ message: 'Token is required' });
    }
    console.log(`-> [VERIFY] Received magic token: ${token.substring(0, 10)}...`);

    try {
        const user = await User.findOne({
            magicToken: token,
            magicTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            console.log("-> [VERIFY] Token is invalid or expired. Search in DB failed.");
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }
        console.log(`-> [VERIFY] Token is valid for user: ${user.email}.`);

        user.magicToken = null;
        user.magicTokenExpires = null;
        await user.save();
        console.log("-> [VERIFY] Magic token has been cleared from database.");

        const sessionToken = generateToken({ id: user._id, email: user.email }, '8h');
        console.log(`-> [VERIFY] New session token generated: ${sessionToken.substring(0, 15)}...`);

        res.json({
            token: sessionToken,
            user: {
                teamName: user.teamName,
                email: user.email,
            },
        });
        console.log("--- [VERIFY] verifyMagicToken: Function finished successfully. ---");

    } catch (error) {
        console.error('❌ [VERIFY] CRITICAL ERROR verifying token:', error);
        res.status(500).json({ message: 'Server error' });
    }
};