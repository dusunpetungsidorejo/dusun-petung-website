import express from 'express';
import {
  getDemographics,
  createDemographic,
  updateDemographic,
  deleteDemographic
} from '../controllers/demographicsController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getDemographics);
router.post('/', authenticateToken, createDemographic);
router.put('/:id', authenticateToken, updateDemographic);
router.delete('/:id', authenticateToken, deleteDemographic);

export default router;
