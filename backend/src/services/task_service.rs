use crate::{
    cache::redis::{get_cache, invalidate_cache, set_cache},
    helpers::errors::AppError,
    models::{
        api_model::{PaginatedResponse, PaginationMeta},
        task_model::{CreateTaskPayload, Task, UpdateTaskPayload},
    },
    states::AppState,
};
use sqlx::Row;
use uuid::Uuid;

pub struct TaskService;

impl TaskService {
    /// Crear una nueva tarea en un proyecto
    pub async fn create(
        db: &AppState,
        user_id: uuid::Uuid,
        project_id: uuid::Uuid,
        payload: CreateTaskPayload,
    ) -> Result<Task, AppError> {
        // Verificar que el proyecto pertenece al usuario
        let _project = sqlx::query!(
            "SELECT id FROM projects WHERE id = $1 AND owner_id = $2",
            project_id,
            user_id
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Project not found".to_string()))?;

        let status: String = payload.status.unwrap_or_else(|| "todo".to_string());

        let row = sqlx::query(
            r#"
                INSERT INTO tasks (title, description, status, project_id, assigned_to)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, title, description, status, project_id, assigned_to, created_at
            "#,
        )
        .bind(&payload.title)
        .bind(&payload.description)
        .bind(&status)
        .bind(project_id)
        .bind(&payload.assigned_to)
        .fetch_one(&db.db)
        .await?;

        let task: Task = Task {
            id: row.get("id"),
            title: row.get("title"),
            description: row.get("description"),
            status: row.get("status"),
            project_id: row.get("project_id"),
            assigned_to: row.get("assigned_to"),
            created_at: row.get("created_at"),
        };

        // Invalidar cache de tareas del proyecto
        let _ =
            invalidate_cache(db.redis.clone(), &format!("tasks:project:{}:*", project_id)).await;

        Ok(task)
    }

    /// Obtener todas las tareas de un proyecto con paginación y filtros
    pub async fn get_by_project(
        db: &AppState,
        user_id: uuid::Uuid,
        project_id: uuid::Uuid,
        page: i64,
        limit: i64,
        status_filter: Option<String>,
    ) -> Result<PaginatedResponse<Task>, AppError> {
        // Verificar que el proyecto pertenece al usuario
        let _project = sqlx::query!(
            "SELECT id FROM projects WHERE id = $1 AND owner_id = $2",
            project_id,
            user_id
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Project not found".to_string()))?;

        // Intentar obtener del cache primero
        let cache_key = format!(
            "tasks:project:{}:page:{}:limit:{}:status:{}",
            project_id,
            page,
            limit,
            status_filter.as_deref().unwrap_or("all")
        );

        if let Some(cached) =
            get_cache::<PaginatedResponse<Task>>(db.redis.clone(), &cache_key).await?
        {
            tracing::info!("Cache hit for tasks");
            return Ok(cached);
        }

        let offset = (page - 1) * limit;

        // Queries que manejan NULL correctamente
        let tasks: Vec<Task> = if let Some(ref status) = status_filter {
            let rows = sqlx::query(
                r#"
                    SELECT id, title, description, status, project_id, assigned_to, created_at 
                    FROM tasks WHERE project_id = $1 AND status = $2
                    ORDER BY created_at DESC LIMIT $3 OFFSET $4
                "#,
            )
            .bind(project_id)
            .bind(status)
            .bind(limit)
            .bind(offset)
            .fetch_all(&db.db)
            .await?;

            rows.into_iter()
                .map(|row| Task {
                    id: row.get("id"),
                    title: row.get("title"),
                    description: row.get("description"),
                    status: row.get("status"),
                    project_id: row.get("project_id"),
                    assigned_to: row.get("assigned_to"),
                    created_at: row.get("created_at"),
                })
                .collect()
        } else {
            let rows = sqlx::query(
                r#"
                    SELECT id, title, description, status, project_id, assigned_to, created_at 
                    FROM tasks WHERE project_id = $1
                    ORDER BY created_at DESC LIMIT $2 OFFSET $3
                "#,
            )
            .bind(project_id)
            .bind(limit)
            .bind(offset)
            .fetch_all(&db.db)
            .await?;

            rows.into_iter()
                .map(|row| Task {
                    id: row.get("id"),
                    title: row.get("title"),
                    description: row.get("description"),
                    status: row.get("status"),
                    project_id: row.get("project_id"),
                    assigned_to: row.get("assigned_to"),
                    created_at: row.get("created_at"),
                })
                .collect()
        };

        // Obtener total
        let total: i64 = if let Some(ref status) = status_filter {
            sqlx::query_scalar("SELECT COUNT(*) FROM tasks WHERE project_id = $1 AND status = $2")
                .bind(project_id)
                .bind(status)
                .fetch_one(&db.db)
                .await?
        } else {
            sqlx::query_scalar("SELECT COUNT(*) FROM tasks WHERE project_id = $1")
                .bind(project_id)
                .fetch_one(&db.db)
                .await?
        };

        let meta = PaginationMeta::new(page, limit, total);
        let response = PaginatedResponse { data: tasks, meta };

        // Guardar en cache por 60 segundos
        let _ = set_cache(db.redis.clone(), &cache_key, &response, 60).await;

        Ok(response)
    }

    /// Obtener una tarea por ID
    pub async fn get_by_id(
        db: &AppState,
        user_id: uuid::Uuid,
        task_id: uuid::Uuid,
    ) -> Result<Task, AppError> {
        let row = sqlx::query(
            r#"
                SELECT t.id, t.title, t.description, t.status, t.project_id, t.assigned_to, t.created_at
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.id = $1 AND p.owner_id = $2
            "#,
        )
        .bind(task_id)
        .bind(user_id)
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Task not found".to_string()))?;

        Ok(Task {
            id: row.get("id"),
            title: row.get("title"),
            description: row.get("description"),
            status: row.get("status"),
            project_id: row.get("project_id"),
            assigned_to: row.get("assigned_to"),
            created_at: row.get("created_at"),
        })
    }

    /// Actualizar una tarea
    pub async fn update(
        db: &AppState,
        user_id: uuid::Uuid,
        task_id: uuid::Uuid,
        payload: UpdateTaskPayload,
    ) -> Result<Task, AppError> {
        // Primero verificar que la tarea pertenece a un proyecto del usuario
        let existing = sqlx::query(
            r#"
                SELECT t.id, t.title, t.description, t.status, t.project_id, t.assigned_to, t.created_at
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.id = $1 AND p.owner_id = $2
            "#,
        )
        .bind(task_id)
        .bind(user_id)
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Task not found".to_string()))?;

        let title = payload.title.unwrap_or_else(|| existing.get("title"));
        let description = payload.description.or_else(|| existing.get("description"));
        let status = payload.status.unwrap_or_else(|| existing.get("status"));
        let assigned_to = payload.assigned_to.or_else(|| existing.get("assigned_to"));

        let row = sqlx::query(
            r#"
                UPDATE tasks
                SET title = $1, description = $2, status = $3, assigned_to = $4
                WHERE id = $5
                RETURNING id, title, description, status, project_id, assigned_to, created_at
            "#,
        )
        .bind(&title)
        .bind(&description)
        .bind(&status)
        .bind(&assigned_to)
        .bind(task_id)
        .fetch_one(&db.db)
        .await?;

        let task: Task = Task {
            id: row.get("id"),
            title: row.get("title"),
            description: row.get("description"),
            status: row.get("status"),
            project_id: row.get("project_id"),
            assigned_to: row.get("assigned_to"),
            created_at: row.get("created_at"),
        };

        // Invalidar cache
        let _ = invalidate_cache(
            db.redis.clone(),
            &format!("tasks:project:{}:*", task.project_id),
        )
        .await;

        Ok(task)
    }

    /// Eliminar una tarea
    pub async fn delete(
        db: &AppState,
        user_id: uuid::Uuid,
        task_id: uuid::Uuid,
    ) -> Result<(), AppError> {
        // Primero verificar que la tarea existe y pertenece al usuario
        let project_id: Option<uuid::Uuid> = sqlx::query_scalar(
            r#"
                SELECT t.project_id
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.id = $1 AND p.owner_id = $2
            "#,
        )
        .bind(task_id)
        .bind(user_id)
        .fetch_optional(&db.db)
        .await?;

        let project_id: Uuid =
            project_id.ok_or(AppError::NotFound("Task not found".to_string()))?;

        let result = sqlx::query!("DELETE FROM tasks WHERE id = $1", task_id)
            .execute(&db.db)
            .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Task not found".to_string()));
        }

        // Invalidar cache
        let _ =
            invalidate_cache(db.redis.clone(), &format!("tasks:project:{}:*", project_id)).await;

        Ok(())
    }
}
