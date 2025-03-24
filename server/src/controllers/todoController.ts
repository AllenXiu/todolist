import { Request, Response } from 'express';
import { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../data/todoStore';
import { CreateTodoDTO, UpdateTodoDTO } from '../models/todo';

// 获取当前用户的所有待办事项
export const getUserTodos = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    const todos = getAllTodos(req.user.id);
    res.status(200).json(todos);
  } catch (error: any) {
    console.error('获取待办事项失败:', error);
    res.status(500).json({ message: error.message || '获取待办事项失败' });
  }
};

// 获取当前用户的单个待办事项
export const getUserTodoById = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    const { id } = req.params;
    const todo = getTodoById(id, req.user.id);
    
    if (!todo) {
      return res.status(404).json({ message: '待办事项不存在' });
    }
    
    res.status(200).json(todo);
  } catch (error: any) {
    console.error('获取待办事项失败:', error);
    res.status(500).json({ message: error.message || '获取待办事项失败' });
  }
};

// 创建新待办事项
export const createUserTodo = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    const todoData: CreateTodoDTO = {
      ...req.body,
      userId: req.user.id
    };
    
    // 验证请求数据
    if (!todoData.name || !todoData.dueDate || !todoData.priority || !todoData.category) {
      return res.status(400).json({ message: '请提供必要的待办事项信息' });
    }
    
    const newTodo = createTodo(todoData);
    res.status(201).json(newTodo);
  } catch (error: any) {
    console.error('创建待办事项失败:', error);
    res.status(500).json({ message: error.message || '创建待办事项失败' });
  }
};

// 更新待办事项
export const updateUserTodo = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    const { id } = req.params;
    const todoData: UpdateTodoDTO = req.body;
    
    const updatedTodo = updateTodo(id, req.user.id, todoData);
    
    if (!updatedTodo) {
      return res.status(404).json({ message: '待办事项不存在' });
    }
    
    res.status(200).json(updatedTodo);
  } catch (error: any) {
    console.error('更新待办事项失败:', error);
    res.status(500).json({ message: error.message || '更新待办事项失败' });
  }
};

// 删除待办事项
export const deleteUserTodo = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    const { id } = req.params;
    const result = deleteTodo(id, req.user.id);
    
    if (!result) {
      return res.status(404).json({ message: '待办事项不存在' });
    }
    
    res.status(200).json({ message: '待办事项删除成功' });
  } catch (error: any) {
    console.error('删除待办事项失败:', error);
    res.status(500).json({ message: error.message || '删除待办事项失败' });
  }
}; 