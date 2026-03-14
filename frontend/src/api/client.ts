import type { ApiResponse } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Callback para notificar logout por 401
let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: (() => void) | null) => {
  onUnauthorized = callback;
};

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Cargar token del localStorage al iniciar
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Agregar token de auth si existe
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si es 401, limpiar token Y notificar al store
    if (response.status === 401) {
      this.setToken(null);
      // Notificar al callback de logout si existe
      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    const data = await response.json();
    return data;
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instancia singleton
export const api = new ApiClient();
