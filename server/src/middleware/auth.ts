import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../models/user';

// JWT密钥，理想情况下应该放在环境变量中
const JWT_SECRET = 'your_jwt_secret_key';

// 扩展Request接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
    }
  }
}

// 生成JWT令牌
export const generateToken = (user: UserDTO): string => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// 验证身份中间件
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // 从请求头中获取令牌
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // 从Bearer token格式分割
  
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌，拒绝访问' });
  }
  
  try {
    // 验证令牌
    const decoded = jwt.verify(token, JWT_SECRET) as UserDTO;
    
    // 将用户信息添加到请求对象中
    req.user = decoded;
    
    next(); // 继续执行下一个中间件或路由处理器
  } catch (error) {
    console.error('令牌验证失败:', error);
    res.status(401).json({ message: '令牌无效，拒绝访问' });
  }
}; 