# Skill: Crear Endpoint Axum

Esta skill permite crear nuevos endpoints REST en el backend usando Axum.

## Objetivo

Generar un handler completo con su ruta asociada, siguiendo las convenciones del proyecto.

## Pasos a Seguir

### 1. Analizar el dominio

Antes de escribir código:
- ¿Qué entidad/modelo vas a usar?
- ¿Qué operaciones necesitas (CRUD)?
- ¿Qué validación requiere el input?

### 2. Crear el Handler

Ubicación: `backend/src/handlers/nombre_handler.rs`

```rust
use axum::{Json, extract::State};

use crate::{
    helpers::errors::AppError,
    models::api_model::ApiResponse,
    states::DbState,
};

// Request payload con validación
#[derive(Debug, Deserialize, Validate)]
pub struct CreateEntityRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    pub description: Option<String>,
}

// Response
#[derive(Serialize)]
pub struct EntityResponse {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
}

// Handler
pub async fn create_entity(
    State(db): State<DbState>,
    Json(payload): Json<CreateEntityRequest>,
) -> Result<Json<ApiResponse<EntityResponse>>, AppError> {
    // Validar input
    payload.validate()?;
    
    // Llamar al service
    let entity = EntityService::create(&db, payload).await?;
    
    // Responder
    let response = ApiResponse::success(entity, "Entity created successfully");
    Ok(Json(response))
}
```

### 3. Definir el Service

Ubicación: `backend/src/services/nombre_service.rs`

```rust
use crate::{
    helpers::errors::AppError,
    models::nombre_model::Entity,
    states::DbState,
};

pub struct EntityService;

impl EntityService {
    pub async fn create(
        db: &DbState,
        payload: CreateEntityRequest,
    ) -> Result<Entity, AppError> {
        let entity = sqlx::query_as!(
            Entity,
            r#"
                INSERT INTO entities (name, description)
                VALUES ($1, $2)
                RETURNING id, name, description, created_at as "created_at!"
            "#,
            payload.name,
            payload.description
        )
        .fetch_one(db)
        .await?;

        Ok(entity)
    }
}
```

### 4. Registrar en mod.rs

En `backend/src/handlers/mod.rs`:
```rust
pub mod nombre_handler;
```

En `backend/src/services/mod.rs`:
```rust
pub mod nombre_service;
```

### 5. Crear la Ruta

Ubicación: `backend/src/routes/v1/nombre_routes.rs`

```rust
use axum::{routing::post, Router};
use crate::handlers::nombre_handler::create_entity;

pub fn entity_routes() -> Router {
    Router::new()
        .route("/entities", post(create_entity))
}
```

### 6. Registrar en routes v1

En `backend/src/routes/v1/mod.rs`:

```rust
pub mod nombre_routes;

pub fn v1_routes() -> Router {
    Router::new()
        .nest("/entities", nombre_routes::entity_routes())
        // ... otras rutas
}
```

## Convenciones Importantes

1. **Usar `query_as!`** para queries tipadas con PostgreSQL
2. **Usar `#[derive(Serialize, Deserialize)]`** en todos los structs
3. **Usar `#[serde(skip_serializing)]`** para campos sensibles (password_hash)
4. **Validar inputs** con `validator` crate
5. **Responses consistentes**: siempre usar `ApiResponse<T>`
6. **Errores**: usar `AppError` del módulo `helpers::errors`

## Estructura de Respuesta Exitosa

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Ejemplo Completo: Endpoint de Tareas

```rust
// handlers/task_handler.rs
pub async fn create_task(
    State(db): State<DbState>,
    Json(payload): Json<CreateTaskRequest>,
) -> Result<Json<ApiResponse<Task>>, AppError> {
    payload.validate()?;
    
    let task = TaskService::create(&db, payload).await?;
    
    let response = ApiResponse::success(task, "Task created successfully");
    Ok(Json(response))
}
```

## Errores Comunes a Evitar

- ❌ No usar `query_as!` (perdemos tipado)
- ❌ No validar input (seguridad)
- ❌ No usar `ApiResponse` (inconsistencia)
- ❌ Exponer password_hash en responses
- ❌ Olvidar registrar módulos en `mod.rs`
