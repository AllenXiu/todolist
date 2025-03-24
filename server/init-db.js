const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// 检查并创建数据目录
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('数据目录已创建:', dataDir);
}

// 检查数据库文件是否存在
const dbPath = path.join(dataDir, 'todos.db');
if (fs.existsSync(dbPath)) {
  // 删除旧的数据库文件
  fs.unlinkSync(dbPath);
  console.log('旧数据库文件已删除');
}

// 初始化数据库
const db = new Database(dbPath);

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

// 创建待办事项表
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    dueDate TEXT,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
    category TEXT,
    status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')),
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

console.log('数据库初始化成功!');
db.close(); 