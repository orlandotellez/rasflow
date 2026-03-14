import { api } from './client';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';
import type { LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth';

export const registerUser = async (data: RegisterRequest) => {
  return api.post<User>('/api/v1/auth/register', data);
}

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>('/api/v1/auth/login', data);

  // Si el login fue exitoso, guardar el token
  if (response.success && response.data.access_token) {
    api.setToken(response.data.access_token);
  }

  return response;
}

export const authMe = async (): Promise<ApiResponse<User>> => {
  return api.get<User>('/api/v1/auth/me');
}

export const logout = async () => {
  api.setToken(null);
}

export const checkAuth = async () => {
  const token = api.getToken();
  if (!token) return null;

  try {
    const response = await authMe();
    if (response.success) {
      return response.data;
    }
    // No limpiamos el token aquí - solo el 401 debería hacerlo
    return null;
  } catch {
    // Error de red, no limpiamos el token
    return null;
  }
}
