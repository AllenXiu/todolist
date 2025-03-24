import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../models/todo';

const DB_PATH = path.join(__dirname, '../../data/todos.db');

// 初始化数据库
const initializeDatabase = () => {
  const db = new Database(DB_PATH);
  
  // 创建待办事项表
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
      category TEXT,
      status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')),
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
  
  return db;
};

// 获取数据库连接
const getDb = () => {
  return new Database(DB_PATH);
};

// 初始化数据库
initializeDatabase();

// 读取所有待办事项
export const getAllTodos = (): Todo[] => {
  const db = getDb();
  const todos = db.prepare('SELECT * FROM todos').all() as Todo[];
  db.close();
  return todos;
};

// 获取单个待办事项
export const getTodoById = (id: string): Todo | undefined => {
  const db = getDb();
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo | undefined;
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
    INSERT INTO todos (id, name, description, dueDate, priority, category, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    newTodo.id,
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
export const updateTodo = (id: string, todoData: UpdateTodoDTO): Todo | null => {
  const db = getDb();
  
  // 检查待办事项是否存在
  const existingTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo | undefined;
  
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
  
  // 添加ID作为WHERE条件
  updateValues.push(id);
  
  // 执行更新
  db.prepare(`
    UPDATE todos
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `).run(...updateValues);
  
  db.close();
  return updatedTodo;
};

// 删除待办事项
export const deleteTodo = (id: string): boolean => {
  const db = getDb();
  
  // 检查待办事项是否存在
  const existingTodo = db.prepare('SELECT id FROM todos WHERE id = ?').get(id);
  
  if (!existingTodo) {
    db.close();
    return false;
  }
  
  // 执行删除
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  
  db.close();
  return true;
}; 