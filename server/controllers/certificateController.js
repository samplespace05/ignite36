import User from '../models/userModel.js';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

const CERTIFICATES_DIR = path.resolve(process.cwd(), 'server', 'certificates');

export const getUserCertificates = async (req, res) => {
    const { email } = req.query; // Find user by email from URL query
    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }
    try {
        const user = await User.findOne({ email }).select('certificateFiles teamName email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const certificates = user.certificateFiles.map((file, index) => ({
            id: file,
            name: `Team Member ${index + 1} Certificate`,
        }));
        res.json({
            teamInfo: {
                name: user.teamName,
                email: user.email,
            },
            certificates,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const downloadAllCertificates = async (req, res) => {
    const { email } = req.query; // Find user by email from URL query
    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !user.certificateFiles) {
            return res.status(404).json({ message: 'No certificates found for this user.' });
        }
        const zip = archiver('zip');
        res.attachment(`${user.teamName}-certificates.zip`);
        zip.pipe(res);
        for (const filename of user.certificateFiles) {
            const filePath = path.join(CERTIFICATES_DIR, filename);
            if (fs.existsSync(filePath)) {
                zip.file(filePath, { name: filename });
            }
        }
        await zip.finalize();
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating ZIP.' });
    }
};