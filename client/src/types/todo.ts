export type Priority = 'low' | 'medium' | 'high';
export type Status = 'not_started' | 'in_progress' | 'completed';

export interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string; // ISO 日期字符串
  priority: Priority;
  category: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDTO {
  name: string;
  description: string;
  dueDate: string;
  priority: Priority;
  category: string;
  status?: Status;
}

export interface UpdateTodoDTO {
  name?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  category?: string;
  status?: Status;
} 