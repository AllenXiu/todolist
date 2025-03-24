import axios from 'axios';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo';

// 使用相对路径，这样无论部署在哪个端口都能正常工作
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/todos':'/api/todos';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTodo = async (todoData: CreateTodoDTO): Promise<Todo> => {
  const response = await axios.post(API_URL, todoData);
  return response.data;
};

export const updateTodo = async (id: string, todoData: UpdateTodoDTO): Promise<Todo> => {
  const response = await axios.put(`${API_URL}/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
}; 