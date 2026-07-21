import express from 'express';

const router = express.Router();

// Base Health Check Route
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Desa Profile CMS API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

import authRouter from './authRoutes.js';
import settingsRouter from './settingsRoutes.js';
import activitiesRouter from './activitiesRoutes.js';
import uploadRouter from './uploadRoutes.js';
import liveinRouter from './liveinRoutes.js';

// Auth router
router.use('/auth', authRouter);

// Settings router
router.use('/settings', settingsRouter);

// Activities router
router.use('/activities', activitiesRouter);

// Upload router
router.use('/upload', uploadRouter);

// Live In router
router.use('/livein', liveinRouter);

export default router;
