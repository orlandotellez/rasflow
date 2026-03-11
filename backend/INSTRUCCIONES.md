Construir una **API REST profesional** para un sistema de gestión de tareas estilo Trello / Todoist, pensada para múltiples usuarios y equipos.

---

## 🎯 Objetivo general

Construir una API backend en Rust que permita:

- Registrar usuarios
- Autenticarse
- Crear proyectos
- Crear tareas dentro de proyectos
- Asignar tareas a usuarios
- Cambiar estados
- Listar con paginación
- Usar cache
- Persistir en base de datos
- Tener arquitectura limpia y escalable

---

## 🧱 Stack obligatorio

Debes usar:

- **Rust**
- **Framework web:** `axum` o `actix-web` (elige uno)
- **Base de datos:** PostgreSQL
- **ORM / SQL:** `sqlx` (preferido) o `diesel`
- **Cache:** Redis
- **Serialización:** `serde`
- **Config:** `dotenvy` o `config`
- **Auth:** JWT
- **Logs:** `tracing`
- **Migrations:** sqlx-cli o diesel-cli

---

## 🏗 Arquitectura obligatoria

Debes estructurar el proyecto así (mínimo):

```
src/
├── main.rs
├── app.rs                // bootstrap del servidor
├── config/
│   └── mod.rs
├── db/
│   ├── mod.rs
│   └── pool.rs
├── cache/
│   ├── mod.rs
│   └── redis.rs
├── routes/
│   ├── mod.rs
│   ├── auth_routes.rs
│   ├── project_routes.rs
│   └── task_routes.rs
├── handlers/
│   ├── mod.rs
│   ├── auth_handler.rs
│   ├── project_handler.rs
│   └── task_handler.rs
├── services/
│   ├── mod.rs
│   ├── auth_service.rs
│   ├── project_service.rs
│   └── task_service.rs
├── repositories/
│   ├── mod.rs
│   ├── user_repo.rs
│   ├── project_repo.rs
│   └── task_repo.rs
├── models/
│   ├── mod.rs
│   ├── user.rs
│   ├── project.rs
│   └── task.rs
├── middlewares/
│   └── auth_middleware.rs
└── errors/
    └── api_error.rs
```

---

## 🗃 Base de datos (PostgreSQL)

Tablas mínimas:

### users

```sql
id (uuid, pk)
email (unique)
password_hash
created_at
```

### projects

```sql
id (uuid, pk)
name
owner_id (fk users)
created_at
```

### tasks

```sql
id (uuid, pk)
title
description
status (todo | in_progress | done)
project_id (fk projects)
assigned_to (fk users, nullable)
created_at
```

---

## 🔐 Autenticación

Endpoints:

```
POST   /auth/register
POST   /auth/login
GET    /auth/me
```

- Password hasheado (bcrypt o argon2)
- JWT con expiración
- Middleware para rutas protegidas

---

## 📁 Proyectos

```
POST   /projects
GET    /projects            (paginado)
GET    /projects/:id
PUT    /projects/:id
DELETE /projects/:id
```

---

## ✅ Tareas

```
POST   /projects/:id/tasks
GET    /projects/:id/tasks   (paginado + filtros por status)
PUT    /tasks/:id
DELETE /tasks/:id
```

---

## 📦 Paginación obligatoria

Formato:

```
GET /projects?page=1&limit=10
```

Respuesta:

```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 57,
    "total_pages": 6
  }
}
```

---

## ⚡ Cache con Redis (obligatorio)

Debes cachear:

- `GET /projects`
- `GET /projects/:id/tasks`

Claves ejemplo:

```
projects:user:{user_id}:page:{page}:limit:{limit}
tasks:project:{project_id}:page:{page}:limit:{limit}
```

TTL: 60–120 segundos

Cuando se crea/edita/elimina:

- Invalidar cache correspondiente

---

## 🧠 Lógica obligatoria

- Un usuario solo ve SUS proyectos
- Un usuario solo puede modificar SUS proyectos
- Las tareas pertenecen a un proyecto
- Solo el owner puede borrar proyecto
- Validaciones de datos
- Manejo centralizado de errores

---

## 📜 Respuesta de errores estándar

```json
{
  "error": "validation_error",
  "message": "Email inválido"
}
```

---
