# Skill: Migraciones de Base de Datos

Esta skill cubre cómo crear y gestionar migraciones con SQLx en el proyecto.

## Ubicación

Las migraciones están en: `backend/migrations/`

## Estructura de una Migración

SQLx usa migraciones SQL simples (no Rust):

```
migrations/
├── 20240101000000_create_users_table.sql
├── 20240101000001_create_projects_table.sql
└── ...
```

## Comandos SQLx

### Crear migraciones

```bash
# Nueva migración
cargo sqlx migrate add create_tasks_table

# O manualmente crear el archivo en migrations/
```

### Correr migraciones

```bash
# Desarrollo
cargo sqlx migrate run

# Ver estado
cargo sqlx migrate info
```

### Revertir

```bash
cargo sqlx migrate revert
```

## Ejemplos de Migraciones

### Tabla de Usuarios

```sql
-- migrations/20240101000000_create_users_table.sql

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### Tabla de Proyectos

```sql
-- migrations/20240101000001_create_projects_table.sql

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
```

### Tabla de Tareas

```sql
-- migrations/20240101000002_create_tasks_table.sql

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    completed BOOLEAN NOT NULL DEFAULT false,
    due_date TIMESTAMP WITH TIME ZONE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
```

### Tabla de Subtareas

```sql
-- migrations/20240101000003_create_subtasks_table.sql

CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
```

## Tipos de Datos PostgreSQL

| PostgreSQL | Uso |
|------------|-----|
| UUID | IDs únicos |
| VARCHAR(n) | Strings con límite |
| TEXT | Strings largos sin límite |
| BOOLEAN | true/false |
| TIMESTAMP WITH TIME ZONE | Fechas con timezone |
| JSONB | Datos JSON |

## Buenas Prácticas

### 1. Usar UUID como IDs

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

### 2. Timestamps en todas las tablas

```sql
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
```

### 3. Índices para queries frecuentes

```sql
CREATE INDEX idx_table_column ON table(column);
```

### 4. Foreign Keys con CASCADE

```sql
REFERENCES users(id) ON DELETE CASCADE
```

### 5. Soft deletes (opcional)

```sql
-- En lugar de DELETE, usar:
deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL

-- Query:
SELECT * FROM tasks WHERE deleted_at IS NULL;
```

## Modificando Tablas Existentes

### Agregar columna

```sql
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
```

### Renombrar columna

```sql
ALTER TABLE tasks RENAME COLUMN name TO title;
```

### Eliminar columna

```sql
ALTER TABLE tasks DROP COLUMN IF EXISTS old_field;
```

## Verificar Migraciones

```bash
# Ver qué migraciones están aplicadas
cargo sqlx migrate info

# Output ejemplo:
# Already applied: 20240101000000 (create users table)
# Already applied: 20240101000001 (create projects table)
# Pending: 20240101000002 (create tasks table)
```

## Checklist de Migraciones

- [ ] Nombre descriptivo (`YYYYMMDDHHMMSS_description.sql`)
- [ ] UUID para IDs
- [ ] Timestamps (created_at, updated_at)
- [ ] Foreign keys con CASCADE
- [ ] Índices para columns frecuentemente consultadas
- [ ] Probar migraciones en desarrollo antes de producción
- [ ] No modificar migraciones ya aplicadas (crear nueva)
