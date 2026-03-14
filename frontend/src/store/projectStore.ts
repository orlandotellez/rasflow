import { create } from 'zustand';
import type { Project } from '@/types/project';
import { createProject, deleteProject, getProjectById, listProjects, updateProject } from '@/api/projects';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };

  // Actions
  fetchProjects: (page?: number, limit?: number) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (name: string) => Promise<boolean>;
  updateProject: (id: string, name: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentProject: () => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  },

  fetchProjects: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });

    try {
      const response = await listProjects(page, limit);

      if (response.success) {
        set({
          projects: response.data.data,
          pagination: {
            page: response.data.meta.page,
            limit: response.data.meta.limit,
            total: response.data.meta.total,
            totalPage: response.data.meta.total_page,
          },
          isLoading: false
        });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await getProjectById(id);

      if (response.success) {
        set({ currentProject: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch {
      set({ error: 'Failed to fetch project', isLoading: false });
    }
  },

  createProject: async (name: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await createProject({ name });

      if (response.success) {
        // Agregar el nuevo proyecto a la lista
        const { projects, pagination } = get();
        set({
          projects: [response.data, ...projects],
          pagination: {
            ...pagination,
            total: pagination.total + 1,
          },
          isLoading: false
        });
        return true;
      }

      set({ error: response.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Failed to create project', isLoading: false });
      return false;
    }
  },

  updateProject: async (id: string, name: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await updateProject(id, { name });

      if (response.success) {
        // Actualizar el proyecto en la lista
        const { projects } = get();
        const updatedProjects = projects.map(p =>
          p.id === id ? response.data : p
        );
        set({
          projects: updatedProjects,
          currentProject: response.data,
          isLoading: false
        });
        return true;
      }

      set({ error: response.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Failed to update project', isLoading: false });
      return false;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await deleteProject(id);

      if (response.success) {
        // Eliminar el proyecto de la lista
        const { projects, pagination } = get();
        set({
          projects: projects.filter(p => p.id !== id),
          pagination: {
            ...pagination,
            total: pagination.total - 1,
          },
          isLoading: false
        });
        return true;
      }

      set({ error: response.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Failed to delete project', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentProject: () => set({ currentProject: null }),
}));
