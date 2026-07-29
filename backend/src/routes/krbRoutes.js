import express from 'express';
import {
  getKrbStats,
  createKrbStat,
  updateKrbStat,
  deleteKrbStat
} from '../controllers/krbController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getKrbStats);
router.post('/', authenticateToken, createKrbStat);
router.put('/:id', authenticateToken, updateKrbStat);
router.delete('/:id', authenticateToken, deleteKrbStat);

export default router;
