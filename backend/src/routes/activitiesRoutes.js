import express from 'express';
import { getActivities, createActivity, deleteActivity } from '../controllers/activitiesController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/activities - Public
router.get('/', getActivities);

// POST /api/activities - Protected (Admin only)
router.post('/', authenticateToken, createActivity);

// DELETE /api/activities/:id - Protected (Admin only)
router.delete('/:id', authenticateToken, deleteActivity);

export default router;
