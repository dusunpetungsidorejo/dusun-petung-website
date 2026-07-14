import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// POST /api/upload - Protected (multipart/form-data, key: 'image')
router.post('/', authenticateToken, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    next();
  });
}, uploadImage);

export default router;
