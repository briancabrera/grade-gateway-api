// src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/auth', authRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});