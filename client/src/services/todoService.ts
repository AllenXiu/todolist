import axios from 'axios';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo';

// 配置API URL，确保在开发环境中指向正确的后端服务器
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api/todos' 
  : process.env.REACT_APP_API_URL || '/api/todos';

// 确保在发送请求前设置认证令牌
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('未登录或会话已过期');
  }
  return `Bearer ${token}`;
};

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: getAuthToken()
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取待办事项失败:', error);
    throw error;
  }
};

export const getTodoById = async (id: string): Promise<Todo> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: getAuthToken()
      }
    });
    return response.data;
  } catch (error) {
    console.error(`获取待办事项 ${id} 失败:`, error);
    throw error;
  }
};

export const createTodo = async (todoData: CreateTodoDTO): Promise<Todo> => {
  try {
    const response = await axios.post(API_URL, todoData, {
      headers: {
        Authorization: getAuthToken()
      }
    });
    return response.data;
  } catch (error) {
    console.error('创建待办事项失败:', error);
    throw error;
  }
};

export const updateTodo = async (id: string, todoData: UpdateTodoDTO): Promise<Todo> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, todoData, {
      headers: {
        Authorization: getAuthToken()
      }
    });
    return response.data;
  } catch (error) {
    console.error(`更新待办事项 ${id} 失败:`, error);
    throw error;
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: getAuthToken()
      }
    });
  } catch (error) {
    console.error(`删除待办事项 ${id} 失败:`, error);
    throw error;
  }
}; 