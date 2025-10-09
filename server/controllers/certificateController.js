import User from '../models/userModel.js';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

// Helper to get directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERTIFICATES_DIR = path.join(path.resolve(), 'server', 'certificates');

export const getUserCertificates = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('certificateFiles teamName email');
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
        console.error('Error fetching user certificates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const downloadAllCertificates = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
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
            } else {
                 console.warn(`Certificate file not found: ${filePath}`);
            }
        }

        await zip.finalize();

    } catch (error) {
        console.error('Error creating zip file:', error);
        res.status(500).json({ message: 'Server error while creating ZIP.' });
    }
};