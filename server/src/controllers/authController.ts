import { Request, Response } from 'express';
import { createUser, findUserByUsername, createUserDTO, validatePassword } from '../data/userStore';
import { generateToken } from '../middleware/auth';
import { CreateUserDTO, LoginDTO } from '../models/user';

// 用户注册
export const register = async (req: Request, res: Response) => {
  try {
    console.log('注册请求数据:', req.body);
    const userData: CreateUserDTO = req.body;
    
    // 验证请求数据
    if (!userData.username || !userData.password || !userData.email) {
      console.log('注册数据验证失败:', userData);
      return res.status(400).json({ message: '请提供用户名、密码和邮箱' });
    }
    
    // 创建用户
    const newUser = await createUser(userData);
    
    // 创建不包含密码的用户DTO
    const userDTO = createUserDTO(newUser);
    
    // 生成JWT令牌
    const token = generateToken(userDTO);
    
    console.log('用户注册成功:', userDTO.username);
    
    // 返回用户信息和令牌
    res.status(201).json({
      message: '用户注册成功',
      token,
      user: userDTO
    });
  } catch (error: any) {
    console.error('用户注册失败详情:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({ message: error.message || '用户注册失败' });
  }
};

// 用户登录
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginDTO = req.body;
    
    // 验证请求数据
    if (!username || !password) {
      return res.status(400).json({ message: '请提供用户名和密码' });
    }
    
    // 查找用户
    const user = findUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }
    
    // 验证密码
    const isPasswordValid = await validatePassword(user, password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }
    
    // 创建不包含密码的用户DTO
    const userDTO = createUserDTO(user);
    
    // 生成JWT令牌
    const token = generateToken(userDTO);
    
    // 返回用户信息和令牌
    res.status(200).json({
      message: '登录成功',
      token,
      user: userDTO
    });
  } catch (error: any) {
    console.error('用户登录失败:', error);
    res.status(500).json({ message: error.message || '用户登录失败' });
  }
};

// 获取当前用户信息
export const getCurrentUser = (req: Request, res: Response) => {
  try {
    // 中间件已经将用户信息添加到请求对象中
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    // 返回用户信息
    res.status(200).json({
      user: req.user
    });
  } catch (error: any) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: error.message || '获取用户信息失败' });
  }
}; 