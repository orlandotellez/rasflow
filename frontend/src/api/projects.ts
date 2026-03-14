import { api } from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types/project';

// Listar proyectos (paginado)
export const listProjects = async (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Project>>> => {
  return api.get<PaginatedResponse<Project>>(`/api/v1/projects?page=${page}&limit=${limit}`);
}

// Obtener projecto por Id
export const getProjectById = async (id: string): Promise<ApiResponse<Project>> => {
  return api.get<Project>(`/api/v1/projects/${id}`);
}

// Crear proyecto
export const createProject = async (data: CreateProjectRequest): Promise<ApiResponse<Project>> => {
  return api.post<Project>("/api/v1/projects", data);
}

// Actualizar proyecto
export const updateProject = async (id: string, data: UpdateProjectRequest): Promise<ApiResponse<Project>> => {
  return api.put<Project>(`/api/v1/projects/${id}`, data);
}

// Eliminar proyecto 
export const deleteProject = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/api/v1/projects/${id}`);
}

