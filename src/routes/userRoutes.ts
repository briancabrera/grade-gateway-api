import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticateToken } from '../middlewares/auth';

const userRouter = express.Router();

userRouter.use('/', authenticateToken, createProxyMiddleware({ 
  target: process.env.USERS_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/users': '',
  },
  onProxyReq: (proxyReq, req: any) => {
    if (req.user) {
      proxyReq.setHeader('user', JSON.stringify(req.user));
    }
  },
}));

export default userRouter;