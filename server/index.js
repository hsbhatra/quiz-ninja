import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import quizPlayRoutes from './routes/quizPlayRoutes.js';

// Load env vars
dotenv.config();

// Create app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('QuizNinja API running');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/quiz', quizRoutes);
app.use('/quiz/play', quizPlayRoutes);

// DB Connect & Start Server
const PORT = process.env.PORT;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch((err) => console.error('DB connection error:', err));
