// Tipos de Tareas
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  project_id: string;
  assigned_to: string | null;
  created_at: string;
  // Campo agregado en el frontend para mostrar nombre del proyecto
  project_name?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  assigned_to?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigned_to?: string | null;
}
