# RASFLOW

Gestor de tareas y proyectos personal con autenticación, gestión de proyectos y tareas tipo Kanban.

![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Descripción

RASFLOW es una aplicación full-stack para gestión de tareas y proyectos. Permite crear proyectos, organizar tareas en formato Kanban, y gestionar usuarios con autenticación JWT.

**Características principales:**
- Autenticación de usuarios (registro/login)
- Gestión de proyectos
- Creación y organización de tareas
- Vista Kanban de tareas
- Perfil de usuario

## Tecnologías

### Backend
- **Rust** con [Axum](https://github.com/tokio-rs/axum) (web framework)
- **SQLx** (ORM y query builder)
- **PostgreSQL** (base de datos)
- **Redis** (caché)
- **JWT** (autenticación)
- **bcrypt** (hash de contraseñas)

### Frontend
- **React 19** con TypeScript
- **Vite** (build tool)
- **React Router DOM 7** (enrutamiento)
- **Zustand** (gestión de estado)
- **CSS Modules** (estilos)
- **Lucide React** (iconos)

## Estructura del Proyecto

```
RASFLOW-REPO/
├── backend/                 # API REST en Rust
│   ├── src/
│   │   ├── handlers/        # Controladores HTTP
│   │   ├── routes/v1/       # Definición de rutas
│   │   ├── models/          # Modelos de datos
│   │   ├── services/       # Lógica de negocio
│   │   ├── helpers/        # Utilidades
│   │   ├── db/             # Conexión a PostgreSQL
│   │   ├── cache/          # Integración con Redis
│   │   ├── middlewares/    # Middlewares (auth)
│   │   └── main.rs         # Punto de entrada
│   ├── migrations/         # Migraciones de base de datos
│   └── .env.example        # Template de variables de entorno
│
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── api/            # Cliente HTTP
│   │   ├── components/     # Componentes React
│   │   │   ├── auth/       # Componentes de autenticación
│   │   │   ├── common/     # Componentes compartidos
│   │   │   ├── layout/     # Layouts (Sidebar, Dashboard)
│   │   │   └── pages/      # Componentes de página
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── routes/         # Definición de rutas
│   │   ├── store/          # Stores de Zustand
│   │   ├── types/         # Tipos TypeScript
│   │   └── utils/         # Utilidades
│   └── package.json
│
└── ai/skills/              # Guías para agentes IA
    ├── backend/
    ├── database/
    └── frontend/
```

## Inicio Rápido

### Prerrequisitos

- **Rust** (última versión estable) + Cargo
- **Node.js** (v18+) + pnpm
- **PostgreSQL** (v14+)
- **Redis** (v6+)

### 1. Clonar el repositorio

```bash
git clone https://github.com/orlandotellez/rasflow.git
cd rasflow
```

### 2. Configurar el Backend

```bash
cd backend

# Copiar archivo de ejemplo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# DATABASE_URL=postgres://user:password@localhost:5432/rasflow
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=tu_secret_aqui
# FRONTEND_URL=http://localhost:5173
```

### 3. Configurar la Base de Datos

```bash
# Crear la base de datos (si no existe)
cargo install sqlx-cli
sqlx database create

# Ejecutar migraciones
cargo sqlx migrate run
```

### 4. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env
# VITE_API_URL=http://localhost:3000/api/v1
```

### 5. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd backend
cargo run
# Servidor corriendo en http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
# Aplicación en http://localhost:5173
```

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registrar usuario |
| POST | `/api/v1/auth/login` | Iniciar sesión |
| GET | `/api/v1/auth/me` | Obtener usuario actual |

### Proyectos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/projects` | Crear proyecto |
| GET | `/api/v1/projects` | Listar proyectos (paginado) |
| GET | `/api/v1/projects/:id` | Obtener proyecto |
| PUT | `/api/v1/projects/:id` | Actualizar proyecto |
| DELETE | `/api/v1/projects/:id` | Eliminar proyecto |

### Tareas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/projects/:project_id/tasks` | Crear tarea |
| GET | `/api/v1/projects/:project_id/tasks` | Listar tareas |
| GET | `/api/v1/tasks/:id` | Obtener tarea |
| PUT | `/api/v1/tasks/:id` | Actualizar tarea |
| DELETE | `/api/v1/tasks/:id` | Eliminar tarea |

## Cómo Contribuir

¡Todas las contribuciones son bienvenidas! Sigue estos pasos:

### 1. Fork y Clone

```bash
git clone https://github.com/orlandotellez/rasflow.git
cd rasflow
```

### 2. Crear una rama

```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/nombre-del-fix
```

### 3. Hacer cambios

Asegúrate de seguir las convenciones del proyecto:

- **Commits:** Usa mensajes descriptivos
- **Código Rust:** Sigue las convenciones de `rustfmt`
- **Código React:** Usa ESLint y Prettier
- **Testing:** Agrega tests para nuevas funcionalidades

### 4. Commits

Seguimos una convención de commits simple:

```
<tipo>: <descripción>
```

**Tipos:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `refactor:` Refactorización de código
- `styles:` Cambios de estilo (CSS)
- `docs:` Documentación
- `chore:` Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat: agregar vista Kanban"
git commit -m "fix: corregir validación de email"
git commit -m "refactor: mover lógica de auth a servicio"
```

### 5. Pull Request

1. Push a tu fork: `git push origin feature/nombre`
2. Abre un Pull Request en GitHub
3. Describe los cambios realizados
4. Espera revisión 

## Guías Adicionales

El proyecto incluye guías especializadas en la carpeta `ai/skills/`:

- [Crear un nuevo endpoint](ai/skills/backend/create-endpoint.md)
- [Realizar migraciones](ai/skills/database/migration.md)
- [Consultas con SQLx](ai/skills/database/sqlx-query.md)
- [Integración con la API](ai/skills/frontend/api-integration.md)
- [Crear componentes React](ai/skills/frontend/react-component.md)

También puedes revisar:
- [Backend - Instrucciones originales](backend/INSTRUCCIONES.md)
- [Resumen de la API](backend/Resumen.md)
- [Manual de Redis](backend/MANUAL_REDIS.md)
- [Manual de SQLx](backend/MANUAL_SQLX.md)

## Roadmap

- [ ] Tests unitarios y de integración
- [ ] Documentación de la API con Swagger/OpenAPI
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Colaboración en proyectos múltiples usuarios
- [ ] Panel de administración

## Licencia

MIT License - siente libre de usar este proyecto para aprender y crear.

