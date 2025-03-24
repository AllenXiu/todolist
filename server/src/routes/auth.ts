import express, { RequestHandler } from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// 健康检查端点，用于Docker容器健康检查
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 用户注册
router.post('/register', register as RequestHandler);

// 用户登录
router.post('/login', login as RequestHandler);

// 获取当前用户信息（需要认证）
router.get('/profile', authenticate as RequestHandler, getCurrentUser as RequestHandler);

export default router; 