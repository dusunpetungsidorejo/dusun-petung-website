import express from 'express';
import { getLiveInHouses, createLiveInHouse, updateLiveInHouse, deleteLiveInHouse } from '../controllers/liveinController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/livein - Public
router.get('/', getLiveInHouses);

// POST /api/livein - Protected (Admin only)
router.post('/', authenticateToken, createLiveInHouse);

// PUT /api/livein/:id - Protected (Admin only)
router.put('/:id', authenticateToken, updateLiveInHouse);

// DELETE /api/livein/:id - Protected (Admin only)
router.delete('/:id', authenticateToken, deleteLiveInHouse);

export default router;
