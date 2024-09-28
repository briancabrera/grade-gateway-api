import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Mock modules
jest.mock('jsonwebtoken');
jest.mock('http-proxy-middleware');

// Mock implementation for createProxyMiddleware
const mockCreateProxyMiddleware = jest.fn((config) => {
  return (req: any, res: any, next: any) => {
    res.proxyConfig = config;
    next();
  };
});

// Set up mock implementation after the mock is created
(createProxyMiddleware as jest.Mock).mockImplementation(mockCreateProxyMiddleware);

// Import routers after mocking
import userRouter from '../routes/userRoutes';
import authRouter from '../routes/authRoutes';

// Create Express app
const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

describe('Gateway API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'OK' });
    });
  });

  describe('User Routes', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app).get('/users/profile');
      expect(response.status).toBe(401);
    });

    it('should return 403 for invalid tokens', async () => {
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(403);
    });
  });
});