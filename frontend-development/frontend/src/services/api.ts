import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Task, User, AuthResponse, TaskFilters, CreateTaskData, UpdateTaskData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/api/auth/register', {
      email,
      password,
    });
    return response.data;
  }

  // Task endpoints
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.archived !== undefined) params.append('archived', filters.archived.toString());

    const response: AxiosResponse<Task[]> = await this.api.get(`/api/tasks?${params.toString()}`);
    return response.data;
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const response: AxiosResponse<Task> = await this.api.post('/api/tasks', taskData);
    return response.data;
  }

  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    const response: AxiosResponse<Task> = await this.api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.api.delete(`/api/tasks/${id}`);
  }

  async archiveTask(id: string, archived: boolean): Promise<Task> {
    const response: AxiosResponse<Task> = await this.api.patch(`/api/tasks/${id}/archive`, {
      archived,
    });
    return response.data;
  }

  async updateSubtasks(id: string, subtasks: any[]): Promise<Task> {
    const response: AxiosResponse<Task> = await this.api.patch(`/api/tasks/${id}/subtasks`, {
      subtasks,
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 