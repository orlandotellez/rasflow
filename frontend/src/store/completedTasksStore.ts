import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '@/types/task';
import { listProjects } from '@/api/projects';
import { listTasks } from '@/api/tasks';

// Task con project_name agregado
interface TaskWithProject extends Task {
  project_name: string;
}

interface CompletedTasksState {
  tasks: TaskWithProject[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchCompletedTasks: (forceRefresh?: boolean) => Promise<void>;
  clearError: () => void;
}

// Cache válido por 5 minutos
const CACHE_TTL = 5 * 60 * 1000;

export const useCompletedTasksStore = create<CompletedTasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      fetchCompletedTasks: async (forceRefresh = false) => {
        const { tasks, lastFetched } = get();
        const now = Date.now();

        // Si hay cache válido y no se fuerza refresh, usar cache
        if (!forceRefresh && tasks.length > 0 && lastFetched && (now - lastFetched) < CACHE_TTL) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Obtener todos los proyectos del usuario
          const projectsResponse = await listProjects(1, 100);

          if (!projectsResponse.success) {
            set({ error: projectsResponse.message, isLoading: false });
            return;
          }

          const projects = projectsResponse.data.data;

          // Obtener tareas de cada proyecto (solo done)
          const allTasks: TaskWithProject[] = [];

          for (const project of projects) {
            try {
              const tasksResponse = await listTasks(project.id, 1, 50);

              if (tasksResponse.success) {
                // Filtrar solo tareas completadas
                const completedTasks = tasksResponse.data.data.filter(
                  task => task.status === 'done'
                );

                // Agregar nombre del proyecto a cada tarea
                for (const task of completedTasks) {
                  allTasks.push({
                    ...task,
                    project_name: project.name
                  });
                }
              }
            } catch (err) {
              console.error(`Error fetching tasks for project ${project.id}:`, err);
            }
          }

          // Ordenar por fecha de creación (más recientes primero)
          allTasks.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          set({ tasks: allTasks, isLoading: false, lastFetched: now });
        } catch {
          set({ error: 'Failed to fetch completed tasks', isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'completed-tasks-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
