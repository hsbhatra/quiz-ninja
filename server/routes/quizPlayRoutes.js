import express from 'express';
import { getQuizForPlay, submitQuizAnswer } from '../controllers/quizPlayController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Submit quiz answers
router.post('/submit', protect, submitQuizAnswer);

// Start quiz (fetch quiz data)
router.get('/:id', protect, getQuizForPlay);

export default router;
