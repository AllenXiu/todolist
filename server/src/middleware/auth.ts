import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../models/user';

// JWT密钥，从环境变量获取或使用默认值
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '7d'; // 默认7天过期

// 打印启动信息（不包含真实密钥）
console.log('JWT认证已配置，使用的是:', process.env.JWT_SECRET ? '环境变量密钥' : '默认密钥');

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
    { expiresIn: TOKEN_EXPIRY }
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
    
    // 检查令牌是否即将过期（剩余时间小于1天）
    const tokenData = jwt.decode(token) as { exp: number };
    if (tokenData.exp && tokenData.exp * 1000 - Date.now() < 24 * 60 * 60 * 1000) {
      // 生成新令牌
      const newToken = generateToken(decoded);
      // 在响应头中添加新令牌
      res.setHeader('X-New-Token', newToken);
    }
    
    next(); // 继续执行下一个中间件或路由处理器
  } catch (error) {
    console.error('令牌验证失败:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        message: '令牌已过期，请重新登录',
        code: 'TOKEN_EXPIRED'
      });
    }
    res.status(401).json({ message: '令牌无效，拒绝访问' });
  }
}; 