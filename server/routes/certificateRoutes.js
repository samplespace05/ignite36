import express from 'express';
import { getUserCertificates, downloadAllCertificates } from '../controllers/certificateController.js';

const router = express.Router();

// Notice the middleware is removed from these routes
router.get('/', getUserCertificates);
router.get('/download-all', downloadAllCertificates);

export default router;