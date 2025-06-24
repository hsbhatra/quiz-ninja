import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

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

// DB Connect & Start Server
const PORT = process.env.PORT;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch((err) => console.error('DB connection error:', err));
