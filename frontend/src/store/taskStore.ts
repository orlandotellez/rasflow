import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStatus } from '@/types/task';
import { createTask, deleteTask, getTaskByid, listTasks, updateTask } from '@/api/tasks';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  lastProjectId: string | null;

  // Actions
  fetchTasks: (projectId: string, status?: TaskStatus, forceRefresh?: boolean) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (projectId: string, title: string, description?: string, status?: TaskStatus) => Promise<boolean>;
  updateTask: (id: string, title?: string, description?: string, status?: TaskStatus) => Promise<boolean>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentTask: () => void;
  clearTasks: () => void;
}

// Cache válido por 5 minutos
const CACHE_TTL = 5 * 60 * 1000;

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentTask: null,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastProjectId: null,

      fetchTasks: async (projectId: string, status?: TaskStatus, forceRefresh = false) => {
        const { tasks, lastFetched, lastProjectId } = get();
        const now = Date.now();

        // Si hay cache válido del mismo proyecto y no se fuerza refresh, usar cache
        if (!forceRefresh && tasks.length > 0 && lastFetched && lastProjectId === projectId && (now - lastFetched) < CACHE_TTL) {
          return; // Usar datos cacheados
        }

        set({ isLoading: true, error: null, lastProjectId: projectId });

        try {
          const response = await listTasks(projectId, 1, 50, status);

          if (response.success) {
            set({
              tasks: response.data.data,
              isLoading: false,
              lastFetched: now,
            });
          } else {
            set({ error: response.message, isLoading: false });
          }
        } catch {
          set({ error: 'Failed to fetch tasks', isLoading: false });
        }
      },

      fetchTask: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getTaskByid(id);

          if (response.success) {
            set({ currentTask: response.data, isLoading: false });
          } else {
            set({ error: response.message, isLoading: false });
          }
        } catch {
          set({ error: 'Failed to fetch task', isLoading: false });
        }
      },

      createTask: async (projectId: string, title: string, description?: string, status: TaskStatus = 'todo') => {
        set({ isLoading: true, error: null });

        try {
          const response = await createTask(projectId, {
            title,
            description,
            status
          });

          if (response.success) {
            // Agregar la nueva tarea a la lista
            const { tasks, lastProjectId } = get();
            
            // Solo agregar si es del proyecto actual cacheado
            if (lastProjectId === projectId) {
              set({
                tasks: [response.data, ...tasks],
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }
            return true;
          }

          set({ error: response.message, isLoading: false });
          return false;
        } catch {
          set({ error: 'Failed to create task', isLoading: false });
          return false;
        }
      },

      updateTask: async (id: string, title?: string, description?: string, status?: TaskStatus) => {
        set({ isLoading: true, error: null });

        try {
          const response = await updateTask(id, {
            title,
            description,
            status
          });

          if (response.success) {
            // Actualizar la tarea en la lista
            const { tasks } = get();
            const updatedTasks = tasks.map(t =>
              t.id === id ? response.data : t
            );
            set({
              tasks: updatedTasks,
              currentTask: response.data,
              isLoading: false,
            });
            return true;
          }

          set({ error: response.message, isLoading: false });
          return false;
        } catch {
          set({ error: 'Failed to update task', isLoading: false });
          return false;
        }
      },

      updateTaskStatus: async (id: string, status: TaskStatus) => {
        // Optimistic update
        const { tasks } = get();
        const taskToUpdate = tasks.find(t => t.id === id);

        if (!taskToUpdate) return false;

        // Update optimistically
        set({
          tasks: tasks.map(t =>
            t.id === id ? { ...t, status } : t
          )
        });

        try {
          const response = await updateTask(id, { status });

          if (response.success) {
            return true;
          }

          // Revert on failure
          set({ tasks });
          set({ error: response.message });
          return false;
        } catch {
          // Revert on error
          set({ tasks });
          set({ error: 'Failed to update task status' });
          return false;
        }
      },

      deleteTask: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await deleteTask(id);

          if (response.success) {
            // Eliminar la tarea de la lista
            const { tasks } = get();
            set({
              tasks: tasks.filter(t => t.id !== id),
              isLoading: false,
            });
            return true;
          }

          set({ error: response.message, isLoading: false });
          return false;
        } catch {
          set({ error: 'Failed to delete task', isLoading: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),
      clearCurrentTask: () => set({ currentTask: null }),
      clearTasks: () => set({ tasks: [], currentTask: null, lastFetched: null, lastProjectId: null }),
    }),
    {
      name: 'tasks-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        lastFetched: state.lastFetched,
        lastProjectId: state.lastProjectId,
      }),
    }
  )
);
