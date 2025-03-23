import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../models/todo';

const DATA_FILE = path.join(__dirname, '../../data/todos.json');

// 确保数据目录存在
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// 确保数据文件存在
const ensureDataFile = () => {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

// 读取所有待办事项
export const getAllTodos = (): Todo[] => {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

// 获取单个待办事项
export const getTodoById = (id: string): Todo | undefined => {
  const todos = getAllTodos();
  return todos.find(todo => todo.id === id);
};

// 创建新待办事项
export const createTodo = (todoData: CreateTodoDTO): Todo => {
  const todos = getAllTodos();
  
  const newTodo: Todo = {
    id: uuidv4(),
    ...todoData,
    status: todoData.status || 'not_started',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
  
  return newTodo;
};

// 更新待办事项
export const updateTodo = (id: string, todoData: UpdateTodoDTO): Todo | null => {
  const todos = getAllTodos();
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return null;
  }
  
  const updatedTodo: Todo = {
    ...todos[todoIndex],
    ...todoData,
    updatedAt: new Date().toISOString()
  };
  
  todos[todoIndex] = updatedTodo;
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
  
  return updatedTodo;
};

// 删除待办事项
export const deleteTodo = (id: string): boolean => {
  const todos = getAllTodos();
  const filteredTodos = todos.filter(todo => todo.id !== id);
  
  if (filteredTodos.length === todos.length) {
    return false;
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(filteredTodos, null, 2));
  return true;
}; 