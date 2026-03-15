import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';
import { listProjects } from '@/api/projects';
import { listTasks } from '@/api/tasks';

interface DashboardStats {
  totalTasks: number;
  inProgressTasks: number;
  completedThisWeek: number;
  totalProjects: number;
}

// Datos para la gráfica de la semana
interface WeeklyData {
  day: string;
  completed: number;
}

interface TaskWithProject extends Task {
  project_name: string;
}

interface DashboardState {
  stats: DashboardStats;
  projects: Project[];
  recentTasks: TaskWithProject[];
  weeklyData: WeeklyData[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchDashboardData: (forceRefresh?: boolean) => Promise<void>;
  clearError: () => void;
}

// Cache válido por 5 minutos
const CACHE_TTL = 5 * 60 * 1000;

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      stats: {
        totalTasks: 0,
        inProgressTasks: 0,
        completedThisWeek: 0,
        totalProjects: 0,
      },
      projects: [],
      recentTasks: [],
      weeklyData: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      fetchDashboardData: async (forceRefresh = false) => {
        const { lastFetched } = get();
        const now = Date.now();

        // Si hay cache válido y no se fuerza refresh, usar cache
        if (!forceRefresh && lastFetched && (now - lastFetched) < CACHE_TTL) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Obtener todos los proyectos
          const projectsResponse = await listProjects(1, 100);

          if (!projectsResponse.success) {
            set({ error: projectsResponse.message, isLoading: false });
            return;
          }

          const projects = projectsResponse.data.data;

          // Obtener tareas de cada proyecto
          let allTasks: TaskWithProject[] = [];
          let totalTasks = 0;
          let inProgressTasks = 0;
          let completedThisWeek = 0;

          // Calcular fecha de hace 7 días
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);

          // Para la gráfica - últimos 7 días
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const today = new Date();
          const weeklyData: WeeklyData[] = [];

          // Inicializar los últimos 7 días con 0
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            weeklyData.push({
              day: daysOfWeek[date.getDay()],
              completed: 0
            });
          }

          for (const project of projects) {
            try {
              const tasksResponse = await listTasks(project.id, 1, 100);

              if (tasksResponse.success) {
                const projectTasks = tasksResponse.data.data;
                totalTasks += projectTasks.length;
                inProgressTasks += projectTasks.filter(t => t.status === 'in_progress').length;

                // Contar completadas esta semana
                const weekCompleted = projectTasks.filter(t =>
                  t.status === 'done' && new Date(t.created_at) >= weekAgo
                ).length;
                completedThisWeek += weekCompleted;

                // Contar por día para la gráfica
                projectTasks.forEach(task => {
                  if (task.status === 'done') {
                    const taskDate = new Date(task.created_at);
                    const dayIndex = weeklyData.findIndex(wd => {
                      const d = new Date(today);
                      d.setDate(d.getDate() - (6 - weeklyData.indexOf(wd)));
                      return d.toDateString() === taskDate.toDateString();
                    });
                    if (dayIndex !== -1) {
                      weeklyData[dayIndex].completed++;
                    }
                  }
                });

                // Agregar nombre del proyecto a cada tarea
                for (const task of projectTasks) {
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

          // Ordenar por fecha y tomar las más recientes
          allTasks.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          // Solo tareas no completadas para "Due Today"
          const pendingTasks = allTasks
            .filter(t => t.status !== 'done')
            .slice(0, 5);

          set({
            stats: {
              totalTasks,
              inProgressTasks,
              completedThisWeek,
              totalProjects: projects.length,
            },
            projects,
            recentTasks: pendingTasks,
            weeklyData,
            isLoading: false,
            lastFetched: now,
          });
        } catch {
          set({ error: 'Failed to fetch dashboard data', isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        stats: state.stats,
        projects: state.projects,
        recentTasks: state.recentTasks,
        weeklyData: state.weeklyData,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
