import express, { RequestHandler } from 'express';
import { 
  getUserTodos, 
  getUserTodoById, 
  createUserTodo, 
  updateUserTodo, 
  deleteUserTodo 
} from '../controllers/todoController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// 所有待办事项路由都需要认证
router.use(authenticate as RequestHandler);

// 获取当前用户的所有待办事项
router.get('/', getUserTodos as RequestHandler);

// 获取当前用户的单个待办事项
router.get('/:id', getUserTodoById as RequestHandler);

// 创建当前用户的待办事项
router.post('/', createUserTodo as RequestHandler);

// 更新当前用户的待办事项
router.put('/:id', updateUserTodo as RequestHandler);

// 删除当前用户的待办事项
router.delete('/:id', deleteUserTodo as RequestHandler);

export default router; 