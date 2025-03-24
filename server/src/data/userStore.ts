import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { User, CreateUserDTO, UserDTO } from '../models/user';

const DB_PATH = path.join(__dirname, '../../data/todos.db');

// 获取数据库连接
const getDb = () => {
  return new Database(DB_PATH);
};

// 初始化用户表
export const initializeUserTable = async () => {
  const db = getDb();
  
  try {
    // 创建用户表
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        createdAt TEXT,
        updatedAt TEXT
      )
    `);
  } catch (error) {
    console.error('初始化用户表失败:', error);
    throw error;
  } finally {
    db.close();
  }
};

// 通过用户名查找用户
export const findUserByUsername = (username: string): User | undefined => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
  db.close();
  return user;
};

// 通过ID查找用户
export const findUserById = (id: string): User | undefined => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  db.close();
  return user;
};

// 创建用户DTO（不包含密码）
export const createUserDTO = (user: User): UserDTO => {
  const { password, ...userDTO } = user;
  return userDTO as UserDTO;
};

// 创建新用户
export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  const db = getDb();
  
  // 检查用户名是否已存在
  const existingUser = db.prepare('SELECT username FROM users WHERE username = ?').get(userData.username);
  if (existingUser) {
    db.close();
    throw new Error('用户名已存在');
  }
  
  // 检查邮箱是否已存在
  const existingEmail = db.prepare('SELECT email FROM users WHERE email = ?').get(userData.email);
  if (existingEmail) {
    db.close();
    throw new Error('邮箱已注册');
  }
  
  // 对密码进行哈希处理
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const newUser: User = {
    id: uuidv4(),
    username: userData.username,
    password: hashedPassword,
    email: userData.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 插入新用户
  db.prepare(`
    INSERT INTO users (id, username, password, email, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    newUser.id,
    newUser.username,
    newUser.password,
    newUser.email,
    newUser.createdAt,
    newUser.updatedAt
  );
  
  db.close();
  return newUser;
};

// 验证用户密码
export const validatePassword = async (user: User, password: string): Promise<boolean> => {
  return await bcrypt.compare(password, user.password);
}; 