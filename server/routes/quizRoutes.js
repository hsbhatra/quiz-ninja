import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import { createQuiz, getAllQuizzes, getQuizById } from '../controllers/quizController.js';

const router = express.Router();

// Admin-only routes
router.post('/create', protect, adminOnly, createQuiz); // Create a new quiz

// Public routes
router.get('/', protect, getAllQuizzes);    // Get all quizzes (optionally filter by category)
router.get('/:id', protect, getQuizById);   // Get quiz by ID

export default router;
