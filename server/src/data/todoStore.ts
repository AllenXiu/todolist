import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../models/todo';

const DB_PATH = path.join(__dirname, '../../data/todos.db');

// 初始化待办事项表
export const initializeTodoTable = async () => {
  const db = new Database(DB_PATH);
  
  try {
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
    
    return db;
  } catch (error) {
    console.error('初始化待办事项表失败:', error);
    throw error;
  } finally {
    db.close();
  }
};

// 获取数据库连接
const getDb = () => {
  return new Database(DB_PATH);
};

// 读取指定用户的所有待办事项
export const getAllTodos = (userId: string): Todo[] => {
  const db = getDb();
  const todos = db.prepare('SELECT * FROM todos WHERE userId = ?').all(userId) as Todo[];
  db.close();
  return todos;
};

// 获取指定用户的单个待办事项
export const getTodoById = (id: string, userId: string): Todo | undefined => {
  const db = getDb();
  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND userId = ?').get(id, userId) as Todo | undefined;
  db.close();
  return todo;
};

// 创建新待办事项
export const createTodo = (todoData: CreateTodoDTO): Todo => {
  const db = getDb();
  
  const newTodo: Todo = {
    id: uuidv4(),
    ...todoData,
    status: todoData.status || 'not_started',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.prepare(`
    INSERT INTO todos (id, userId, name, description, dueDate, priority, category, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    newTodo.id,
    newTodo.userId,
    newTodo.name,
    newTodo.description,
    newTodo.dueDate,
    newTodo.priority,
    newTodo.category,
    newTodo.status,
    newTodo.createdAt,
    newTodo.updatedAt
  );
  
  db.close();
  return newTodo;
};

// 更新待办事项
export const updateTodo = (id: string, userId: string, todoData: UpdateTodoDTO): Todo | null => {
  const db = getDb();
  
  // 检查待办事项是否存在且属于该用户
  const existingTodo = db.prepare('SELECT * FROM todos WHERE id = ? AND userId = ?').get(id, userId) as Todo | undefined;
  
  if (!existingTodo) {
    db.close();
    return null;
  }
  
  const updatedTodo: Todo = {
    ...existingTodo,
    ...todoData,
    updatedAt: new Date().toISOString()
  };
  
  // 构建更新语句
  const updateValues = [];
  const updateFields = [];
  
  // 处理可能的更新字段
  Object.entries(todoData).forEach(([key, value]) => {
    if (value !== undefined) {
      updateFields.push(`${key} = ?`);
      updateValues.push(value);
    }
  });
  
  // 添加更新时间
  updateFields.push('updatedAt = ?');
  updateValues.push(updatedTodo.updatedAt);
  
  // 添加ID和用户ID作为WHERE条件
  updateValues.push(id);
  updateValues.push(userId);
  
  // 执行更新
  db.prepare(`
    UPDATE todos
    SET ${updateFields.join(', ')}
    WHERE id = ? AND userId = ?
  `).run(...updateValues);
  
  db.close();
  return updatedTodo;
};

// 删除待办事项
export const deleteTodo = (id: string, userId: string): boolean => {
  const db = getDb();
  
  // 检查待办事项是否存在且属于该用户
  const existingTodo = db.prepare('SELECT id FROM todos WHERE id = ? AND userId = ?').get(id, userId);
  
  if (!existingTodo) {
    db.close();
    return false;
  }
  
  // 执行删除
  db.prepare('DELETE FROM todos WHERE id = ? AND userId = ?').run(id, userId);
  
  db.close();
  return true;
}; 