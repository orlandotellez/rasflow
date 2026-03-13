# AI Agents Guide - RasFlow

Este documento le indica a los agentes de IA cómo trabajar correctamente en este proyecto.

## Descripción del Proyecto

**RasFlow** es una aplicación de gestión y organización de tareas (tipo Todoist/Kanban).

Permite a los usuarios:
- Autenticarse (registro/login con JWT)
- Gestionar tareas con prioridades
- Organizar tareas en proyectos
- Vista Kanban (To Do, In Progress, Done)
- Seguimiento de tareas próximas y completadas

## Stack Tecnológico

### Frontend
- **Framework:** React 19
- **Lenguaje:** TypeScript
- **Build:** Vite 7
- **Router:** React Router DOM 7
- **Estilos:** CSS Modules

### Backend
- **Lenguaje:** Rust (Edition 2024)
- **Framework Web:** Axum 0.8
- **ORM/Query:** SQLx 0.8 (PostgreSQL)
- **Cache:** Redis
- **Auth:** JWT + bcrypt

### Base de Datos
- PostgreSQL con migraciones en `backend/migrations/`

## Arquitectura del Proyecto

```
rasflow/
├── backend/
│   ├── src/
│   │   ├── handlers/       # Handlers de Axum (endpoints)
│   │   ├── routes/        # Definición de rutas (v1/)
│   │   ├── models/        # Structs de SQLx + serde
│   │   ├── services/     # Lógica de negocio
│   │   ├── helpers/      # Utilidades (errors, jwt, password)
│   │   ├── db/           # Pool de conexión
│   │   ├── config/       # Configuración
│   │   ├── cache/        # Redis
│   │   └── states/       # Estado compartido (DbState)
│   ├── migrations/       # Migraciones SQL
│   └── Cargo.toml
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/       # Páginas (rutas)
│   │   ├── routes/      # Definición de rutas
│   │   ├── assets/      # Estáticos
│   │   └── App.tsx      # Componente raíz
│   └── package.json
│
└── agents.md            # Este archivo
```

## Convenciones del Backend

### Estructura de archivos
- **Handlers:** `src/handlers/nombre_handler.rs`
- **Models:** `src/models/nombre_model.rs`
- **Services:** `src/services/nombre_service.rs`
- **Helpers:** `src/helpers/nombre.rs`
- **Routes:** `src/routes/v1/nombre_routes.rs`

### Patrones de código

**Handler:**
```rust
pub async fn nombre_handler(
    State(db): State<DbState>,
    Json(payload): Json<RequestPayload>,
) -> Result<Json<ApiResponse<ResponsePayload>>, AppError> {
    // Tu lógica
    let result = Service::metodo(&db, payload).await?;
    let response = ApiResponse::success(result, "Mensaje de éxito");
    Ok(Json(response))
}
```

**Service:**
```rust
pub struct NombreService;

impl NombreService {
    pub async fn metodo(db: &DbState, payload: Payload) -> Result<Model, AppError> {
        let result = sqlx::query_as!(
            Model,
            "SELECT ... FROM tabla WHERE condition = $1",
            param
        )
        .fetch_one(db)
        .await?;
        
        Ok(result)
    }
}
```

**Model con SQLx:**
```rust
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Entity {
    pub id: Uuid,
    pub name: String,
    pub created_at: DateTime<Utc>,
}
```

### Reglas para el Backend

1. **SIEMPRE** usar `query_as!` o `query_as_!` para queries tipadas
2. **SIEMPRE** definir `AppError` para errores customizados
3. **SIEMPRE** usar `ApiResponse<T>` para responses consistentes
4. **NUNCA** exponer password_hash en responses (usar `#[serde(skip_serializing)]`)
5. Usar validación con `validator` crate para payloads
6. El estado de DB se pasa como `State<DbState>` a los handlers

### Rutas
- Prefijo: `/api/v1`
-命名: `snake_case` (ej: `/auth/login`, `/tasks/create`)

## Convenciones del Frontend

### Estructura de archivos
- **Páginas:** `src/pages/Nombre.tsx` + `src/pages/Nombre.module.css`
- **Componentes:** `src/components/tipo/Nombre.tsx`
- **Rutas:** `src/routes/AppRoutes.tsx`

### Patrones de código

**Componente de página:**
```tsx
import styles from './Nombre.module.css';

const Nombre = () => {
  return (
    <main className={styles.main}>
      {/* Contenido */}
    </main>
  );
};

export default Nombre;
```

**Tipado de API:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

### Rutas definidas
- `/` - Index
- `/tasks` - Task Management (Kanban)
- `/upcoming` - Tareas próximas
- `/completed` - Tareas completadas
- `/projects` - Proyectos
- `/profile` - Perfil de usuario

### Reglas para el Frontend

1. **SIEMPRE** usar TypeScript con tipado estricto
2. **SIEMPRE** usar CSS Modules para estilos (`*.module.css`)
3. Usar `@/` como alias para imports (configurado en tsconfig)
4. **NUNCA** hardcodear URLs de API (usar variables de entorno)
5. Mantener componentes simples y reutilizables

## Cómo Correr el Proyecto

### Prerequisites
- Rust (última versión stable)
- Node.js 18+
- PostgreSQL
- Redis (opcional, para cache)

### Backend

```bash
cd backend

# Crear archivo .env basado en .env.example
cp .env.example .env

# Instalar dependencias
cargo build

# Correr migraciones
cargo sqlx migrate run

# Ejecutar servidor (puerto 3000)
cargo run
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install  # o pnpm install

# Ejecutar desarrollo (puerto 5173)
npm run dev

# Build para producción
npm run build
```

### Variables de Entorno

**Backend (.env):**
```
DATABASE_URL=postgres://user:pass@localhost:5432/rasflow
REDIS_URL=redis://localhost:6379
JWT_SECRET=tu_secret_aqui
```

## Reglas Generales para Agentes

1. **Entender antes de actuar:** Leer el código existente antes de hacer cambios
2. **Mantener tipado:** No usar `any` en TypeScript, no usar `unsafe` en Rust
3. **No duplicar lógica:** Crear servicios reutilizables
4. **Código modular:** Separar responsabilidades (handlers vs services vs models)
5. **Documentar:** Comentar funciones complejas o importantes
6. **Testing:** Agregar tests para lógica de negocio compleja
7. **Consistencia:** Seguir los patrones existentes del proyecto

## Comunicación con el Usuario

- Antes de hacer cambios significativos, mostrar un resumen de lo que vas a hacer
- Si detectás un problema potencial, avisar antes de continuar
- Pedir confirmación antes de modificar archivos existentes importantes
