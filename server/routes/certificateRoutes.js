import express from 'express';
import { getUserCertificates, downloadAllCertificates } from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Endpoint: GET /api/certificates
router.get('/', protect, getUserCertificates);

// Endpoint: GET /api/certificates/download-all
router.get('/download-all', protect, downloadAllCertificates);

export default router;