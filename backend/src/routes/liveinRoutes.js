import express from 'express';
import { 
  getLiveInHouses, 
  createLiveInHouse, 
  updateLiveInHouse, 
  deleteLiveInHouse,
  getLiveInPackages,
  createLiveInPackage,
  updateLiveInPackage,
  deleteLiveInPackage
} from '../controllers/liveinController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Packages
router.get('/packages', getLiveInPackages);
router.post('/packages', authenticateToken, createLiveInPackage);
router.put('/packages/:id', authenticateToken, updateLiveInPackage);
router.delete('/packages/:id', authenticateToken, deleteLiveInPackage);

// GET /api/livein - Public
router.get('/', getLiveInHouses);

// POST /api/livein - Protected (Admin only)
router.post('/', authenticateToken, createLiveInHouse);

// PUT /api/livein/:id - Protected (Admin only)
router.put('/:id', authenticateToken, updateLiveInHouse);

// DELETE /api/livein/:id - Protected (Admin only)
router.delete('/:id', authenticateToken, deleteLiveInHouse);

export default router;

