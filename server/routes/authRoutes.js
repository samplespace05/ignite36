import express from 'express';
import { checkEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/check', checkEmail);

export default router;