# Skill: Integración con API

Esta skill define cómo integrar el frontend React con el backend Axum.

## Configuración Base

### URL de API

Usar variable de entorno (definir en `.env`):
```
VITE_API_URL=http://localhost:3000/api/v1
```

### Cliente HTTP

Crear un cliente base en `src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_URL);
```

## Tipos de Datos

### Respuesta API (del backend)

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Para paginación
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}
```

### Tipos de Entidad

```typescript
// Ejemplo: Task
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  project_id: string;
  created_at: string;
  updated_at: string;
}

// Ejemplo: Project
interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

// Ejemplo: Auth
interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
}
```

## Servicios de API

### Ejemplo: Auth Service

```typescript
// src/services/auth.ts
import { api } from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  // puede tener campos adicionales
}

export const authService = {
  async login(credentials: LoginPayload) {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<ApiResponse<User>>(
      '/auth/register',
      payload
    );
    return response;
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  getToken() {
    return localStorage.getItem('access_token');
  },
};
```

### Ejemplo: Task Service

```typescript
// src/services/tasks.ts
import { api } from './api';

interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  project_id?: string;
}

interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  completed?: boolean;
}

export const taskService = {
  async getAll() {
    return api.get<ApiResponse<Task[]>>('/tasks');
  },

  async getById(id: string) {
    return api.get<ApiResponse<Task>>(`/tasks/${id}`);
  },

  async create(payload: CreateTaskPayload) {
    return api.post<ApiResponse<Task>>('/tasks', payload);
  },

  async update(id: string, payload: UpdateTaskPayload) {
    return api.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
  },

  async delete(id: string) {
    return api.delete<ApiResponse<null>>(`/tasks/${id}`);
  },

  async toggleComplete(id: string) {
    return api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
  },
};
```

## Uso en Componentes

### Con useEffect

```tsx
import { useEffect, useState } from 'react';
import { taskService } from '@/services/tasks';
import { TaskCard } from '@/components/tasks/TaskCard';

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getAll();
        setTasks(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
```

### Con async/await en handlers

```tsx
const handleCreateTask = async (payload: CreateTaskPayload) => {
  setSubmitting(true);
  try {
    const response = await taskService.create(payload);
    setTasks(prev => [...prev, response.data]);
    // Mostrar notificación de éxito
  } catch (error) {
    // Manejar error
  } finally {
    setSubmitting(false);
  }
};
```

## Manejo de Errores

```typescript
// Pattern consistente
try {
  const response = await taskService.getAll();
  // success: true, procesamos response.data
} catch (error) {
  if (error instanceof Error) {
    // error.message contiene el mensaje del servidor
    console.error('Error:', error.message);
  }
  // Mostrar feedback al usuario
}
```

## Checklist de Integración

- [ ] Usar cliente HTTP centralizado
- [ ] Manejar token JWT en Authorization header
- [ ] Tipar respuestas de API con TypeScript
- [ ] Manejar errores consistentemente
- [ ] Usar servicios separados por dominio
- [ ] No hardcodear URLs de API
- [ ] Usar el prefijo `/api/v1`
