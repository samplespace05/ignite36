import User from '../models/userModel.js';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url'; // <-- Import this helper

// --- THIS IS THE CRITICAL FIX ---
// We build the path relative to the current file, which is reliable.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CERTIFICATES_DIR = path.join(__dirname, '..', 'certificates');
// ------------------------------

export const getUserCertificates = async (req, res) => {
    const { email } = req.query;
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
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }

    console.log("--- [ZIP] Download All request started ---");
    console.log(`[ZIP] Base certificates directory is: ${CERTIFICATES_DIR}`);

    try {
        const user = await User.findOne({ email });
        if (!user || !user.certificateFiles || user.certificateFiles.length === 0) {
            console.error("[ZIP] ERROR: No user or certificate files found in database.");
            return res.status(404).json({ message: 'No certificates found for this user.' });
        }

        console.log(`[ZIP] Found user ${user.email} with files:`, user.certificateFiles);
        const zip = archiver('zip');
        res.attachment(`${user.teamName}-certificates.zip`);
        zip.pipe(res);

        for (const filename of user.certificateFiles) {
            const filePath = path.join(CERTIFICATES_DIR, filename);
            console.log(`[ZIP] Looking for file at path: ${filePath}`);

            if (fs.existsSync(filePath)) {
                console.log(`-> [ZIP] SUCCESS: Found ${filename}. Adding to zip.`);
                zip.file(filePath, { name: filename });
            } else {
                console.error(`-> [ZIP] FAILED: Could not find file ${filename} at the specified path.`);
            }
        }
        
        console.log("[ZIP] Finalizing zip file...");
        await zip.finalize();
        console.log("--- [ZIP] Zip file finalized and sent successfully. ---");

    } catch (error) {
        console.error("❌ [ZIP] CRITICAL ERROR while creating ZIP:", error);
        res.status(500).json({ message: 'Server error while creating ZIP.' });
    }
};