export type Priority = 'low' | 'medium' | 'high';
export type Status = 'not_started' | 'in_progress' | 'completed';

export interface Todo {
  id: string;
  userId: string; // 关联到用户ID
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
  userId: string; // 关联到用户ID
}

export interface UpdateTodoDTO {
  name?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  category?: string;
  status?: Status;
} 