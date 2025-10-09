import express from 'express';
import { handleLoginRequest, verifyMagicToken } from '../controllers/authController.js';

const router = express.Router();

// Endpoint: POST /api/auth/login
router.post('/login', handleLoginRequest);

// Endpoint: POST /api/auth/verify
router.post('/verify', verifyMagicToken);

export default router;