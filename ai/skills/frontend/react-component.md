# Skill: Crear Componente React

Esta skill define cómo crear componentes React siguiendo las convenciones del proyecto.

## Reglas Fundamentales

1. **SIEMPRE** usar functional components
2. **SIEMPRE** usar TypeScript con tipado explícito
3. **SIEMPRE** usar CSS Modules para estilos
4. **NUNCA** usar `any`
5. **MANTENER** componentes simples y reutilizables

## Estructura de Componente

### Página/Componente principal

```tsx
// src/pages/Nombre.tsx
import styles from './Nombre.module.css';

type NombrePageProps = {
  // Tipos de props si es componente reutilizable
};

const NombrePage = ({}: NombrePageProps) => {
  return (
    <main className={styles.main}>
      {/* Contenido */}
    </main>
  );
};

export default NombrePage;
```

### Componente reutilizable

```tsx
// src/components/tipo/Nombre.tsx
import { FC } from 'react';

type NombreProps = {
  title: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
};

export const Nombre: FC<NombreProps> = ({ 
  title, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <div 
      className={`${styles.container} ${styles[variant]}`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};
```

## CSS Modules

### Archivo: Nombre.module.css

```css
.main {
  padding: 1rem;
  background-color: #fff;
}

.container {
  display: flex;
  gap: 0.5rem;
}

.primary {
  background-color: #007bff;
  color: white;
}

.secondary {
  background-color: #6c757d;
  color: white;
}
```

## Tipos de API (siguiendo el backend)

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiError {
  success: false;
  message: string;
}
```

## Ejemplo: Componente de Tarjeta de Tarea

```tsx
// src/components/tasks/TaskCard.tsx
import { FC } from 'react';

type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
};

type TaskCardProps = {
  task: Task;
  onComplete?: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export const TaskCard: FC<TaskCardProps> = ({ 
  task, 
  onComplete, 
  onEdit 
}) => {
  const priorityClass = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow,
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.priority} ${priorityClass[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}
      <div className={styles.footer}>
        <button 
          onClick={() => onComplete?.(task.id)}
          className={styles.completeButton}
        >
          {task.completed ? '✓' : '○'}
        </button>
      </div>
    </div>
  );
};
```

## Patrones de Estado

### useState simple

```tsx
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(false);
```

### useState con tipo

```tsx
const [tasks, setTasks] = useState<Task[] | null>(null);
```

### useReducer para estado complejo

```tsx
type State = {
  tasks: Task[];
  filter: 'all' | 'pending' | 'completed';
  loading: boolean;
};

type Action = 
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'SET_FILTER'; payload: State['filter'] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    // ...
    default:
      return state;
  }
};
```

## Integración con Rutas

Las páginas van en `src/pages/` y se registran en `src/routes/AppRoutes.tsx`:

```tsx
import TaskManagement from "@/pages/TaskManagement";

// En AppRoutes:
<Route path="/tasks" element={<TaskManagement />} />
```

## Checklist para Componentes

- [ ] Usar TypeScript con tipos explícitos
- [ ] Usar FC<T> para componentes funcionales
- [ ] Usar CSS Modules (`.module.css`)
- [ ] No usar `any`
- [ ] Tipar props claramente
- [ ] Mantener componente pequeño y enfocado
- [ ] Extraer lógica a hooks cuando sea necesario
