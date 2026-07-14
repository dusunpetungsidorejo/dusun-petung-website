import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/settings - Public
router.get('/', getSettings);

// PUT /api/settings - Protected (Admin only)
router.put('/', authenticateToken, updateSettings);

export default router;
