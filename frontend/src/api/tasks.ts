import { api } from './client';
import type {
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';
import type { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';

// Listar tareas de un proyecto (paginado + filtro por status)
export const listTasks = async (
  projectId: string,
  page = 1,
  limit = 10,
  status?: TaskStatus
): Promise<ApiResponse<PaginatedResponse<Task>>> => {
  let url = `/api/v1/projects/${projectId}/tasks?page=${page}&limit=${limit}`;

  if (status) {
    url += `&status=${status}`;
  }

  return api.get<PaginatedResponse<Task>>(url);
}

// Obtener tarea por ID
export const getTaskByid = async (id: string): Promise<ApiResponse<Task>> => {
  return api.get<Task>(`/api/v1/tasks/${id}`);
}

// Crear tarea
export const createTask = async (projectId: string, data: CreateTaskRequest): Promise<ApiResponse<Task>> => {
  return api.post<Task>(`/api/v1/projects/${projectId}/tasks`, data);
}

// Actualizar tarea
export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> => {
  return api.put<Task>(`/api/v1/tasks/${id}`, data);
}

// Eliminar tarea
export const deleteTask = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/api/v1/tasks/${id}`);
}


