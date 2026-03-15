import { create } from 'zustand';
import type { User } from '@/types/user';
import { authMe, checkAuth, loginUser, logout as apiLogout, registerUser } from '@/api/auth';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

// Keys de los stores persistidos
const STORAGE_KEYS = [
  'projects-storage',
  'tasks-storage',
  'completed-tasks-storage',
  'dashboard-storage',
];

// Función para limpiar todos los stores persistidos
const clearAllStoredData = () => {
  STORAGE_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: ({ email, password }: LoginRequest) => Promise<boolean>;
  register: ({ email, username, password }: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async ({ email, password }: LoginRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await loginUser({ email, password });

      if (response.success) {
        // Obtener datos del usuario
        const userResponse = await authMe();

        if (userResponse.success) {
          set({
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        }
      }

      set({
        error: response.message || 'Login failed',
        isLoading: false
      });
      return false;
    } catch {
      set({
        error: 'Network error. Please try again.',
        isLoading: false
      });
      return false;
    }
  },

  register: async ({ email, username, password }: RegisterRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newUser = {
        email,
        username,
        password
      }

      const response = await registerUser(newUser);

      if (response.success) {
        // Después de register, hacer login automático
        return await get().login({ email, password });
      }

      set({
        error: response.message || 'Registration failed',
        isLoading: false
      });
      return false;
    } catch {
      set({
        error: 'Network error. Please try again.',
        isLoading: false
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await apiLogout();
    } finally {
      // Limpiar localStorage de todos los stores
      clearAllStoredData();
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const user = await checkAuth();

      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
