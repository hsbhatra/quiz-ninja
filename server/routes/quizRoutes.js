import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import { createQuiz } from '../controllers/quizController.js';

const router = express.Router();

// Admin-only quiz creation route
router.post('/create', protect, adminOnly, createQuiz);

export default router;
