import express from 'express';
import {
  getCampPackages,
  createCampPackage,
  updateCampPackage,
  deleteCampPackage,
  getCampRentals,
  createCampRental,
  updateCampRental,
  deleteCampRental
} from '../controllers/campController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Camp Packages
router.get('/packages', getCampPackages);
router.post('/packages', authenticateToken, createCampPackage);
router.put('/packages/:id', authenticateToken, updateCampPackage);
router.delete('/packages/:id', authenticateToken, deleteCampPackage);

// Camp Rentals
router.get('/rentals', getCampRentals);
router.post('/rentals', authenticateToken, createCampRental);
router.put('/rentals/:id', authenticateToken, updateCampRental);
router.delete('/rentals/:id', authenticateToken, deleteCampRental);

export default router;
