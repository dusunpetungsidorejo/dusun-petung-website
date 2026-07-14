import express from 'express';
import { getActivities, createActivity, deleteActivity, updateActivity } from '../controllers/activitiesController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/activities - Public
router.get('/', getActivities);

// POST /api/activities - Protected (Admin only)
router.post('/', authenticateToken, createActivity);

// PUT /api/activities/:id - Protected (Admin only)
router.put('/:id', authenticateToken, updateActivity);

// DELETE /api/activities/:id - Protected (Admin only)
router.delete('/:id', authenticateToken, deleteActivity);

export default router;
