import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const authRouter = express.Router();

authRouter.use('/', createProxyMiddleware({ 
  target: process.env.AUTH_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '',
  },
}));

export default authRouter;