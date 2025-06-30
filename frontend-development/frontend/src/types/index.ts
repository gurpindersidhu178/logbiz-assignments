export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Active' | 'Completed' | 'Archived';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  archived: boolean;
  subtasks: Subtask[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  archived?: boolean;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  subtasks?: Subtask[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: Status;
  archived?: boolean;
} 