// Tipos de Proyectos
export interface Project {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface CreateProjectRequest {
  name: string;
}

export interface UpdateProjectRequest {
  name?: string;
}

