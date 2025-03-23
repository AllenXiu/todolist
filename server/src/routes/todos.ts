import express, { RequestHandler } from 'express';
import { 
  getAllTodos, 
  getTodoById, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} from '../data/todoStore';
import { CreateTodoDTO, UpdateTodoDTO } from '../models/todo';

const router = express.Router();

// 获取所有待办事项
router.get('/', ((_req, res) => {
  const todos = getAllTodos();
  res.json(todos);
}) as RequestHandler);

// 获取单个待办事项
router.get('/:id', ((req, res) => {
  const { id } = req.params;
  const todo = getTodoById(id);
  
  if (!todo) {
    return res.status(404).json({ message: '找不到该待办事项' });
  }
  
  res.json(todo);
}) as RequestHandler);

// 创建待办事项
router.post('/', ((req, res) => {
  try {
    const todoData: CreateTodoDTO = req.body;
    
    // 基本验证
    if (!todoData.name) {
      return res.status(400).json({ message: '名称不能为空' });
    }
    
    const newTodo = createTodo(todoData);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: '创建待办事项失败', error });
  }
}) as RequestHandler);

// 更新待办事项
router.put('/:id', ((req, res) => {
  try {
    const { id } = req.params;
    const todoData: UpdateTodoDTO = req.body;
    
    const updatedTodo = updateTodo(id, todoData);
    
    if (!updatedTodo) {
      return res.status(404).json({ message: '找不到该待办事项' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: '更新待办事项失败', error });
  }
}) as RequestHandler);

// 删除待办事项
router.delete('/:id', ((req, res) => {
  const { id } = req.params;
  const success = deleteTodo(id);
  
  if (!success) {
    return res.status(404).json({ message: '找不到该待办事项' });
  }
  
  res.status(204).end();
}) as RequestHandler);

export default router; 