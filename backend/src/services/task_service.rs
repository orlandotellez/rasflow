use crate::{
    cache::redis::{get_cache, invalidate_cache, set_cache},
    helpers::errors::AppError,
    models::{
        api_model::{PaginatedResponse, PaginationMeta},
        task_model::{CreateTaskPayload, Task, UpdateTaskPayload},
    },
    states::AppState,
};

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

        let task: Task = sqlx::query_as!(
            Task,
            r#"
                INSERT INTO tasks (title, description, status, project_id, assigned_to)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, title, description, status, project_id as "project_id!", assigned_to, created_at as "created_at!"
            "#,
            payload.title,
            payload.description,
            status,
            project_id,
            payload.assigned_to
        )
        .fetch_one(&db.db)
        .await?;

        // Invalidar cache de tareas del proyecto
        let _ = invalidate_cache(&format!("tasks:project:{}:*", project_id)).await;

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

        if let Some(cached) = get_cache::<PaginatedResponse<Task>>(&cache_key).await? {
            tracing::info!("Cache hit for tasks");
            return Ok(cached);
        }

        let offset = (page - 1) * limit;

        // Construir query con filtro opcional
        let (count_query, tasks_query) = if let Some(ref status) = status_filter {
            (
                format!(
                    "SELECT COUNT(*) FROM tasks WHERE project_id = $1 AND status = '{}'",
                    status
                ),
                format!(
                    "SELECT id, title, description, status, project_id, assigned_to, created_at 
                     FROM tasks WHERE project_id = $1 AND status = '{}' 
                     ORDER BY created_at DESC LIMIT $2 OFFSET $3",
                    status
                ),
            )
        } else {
            (
                "SELECT COUNT(*) FROM tasks WHERE project_id = $1".to_string(),
                "SELECT id, title, description, status, project_id, assigned_to, created_at 
                 FROM tasks WHERE project_id = $1 
                 ORDER BY created_at DESC LIMIT $2 OFFSET $3"
                    .to_string(),
            )
        };

        // Obtener total
        let total: (i64,) = sqlx::query_as(&count_query)
            .bind(project_id)
            .fetch_one(&db.db)
            .await?;

        // Obtener tareas
        let tasks: Vec<Task> = sqlx::query_as(&tasks_query)
            .bind(project_id)
            .bind(limit)
            .bind(offset)
            .fetch_all(&db.db)
            .await?;

        let meta = PaginationMeta::new(page, limit, total.0);
        let response = PaginatedResponse { data: tasks, meta };

        // Guardar en cache por 60 segundos
        let _ = set_cache(&cache_key, &response, 60).await;

        Ok(response)
    }

    /// Obtener una tarea por ID
    pub async fn get_by_id(
        db: &AppState,
        user_id: uuid::Uuid,
        task_id: uuid::Uuid,
    ) -> Result<Task, AppError> {
        let task: Task = sqlx::query_as!(
            Task,
            r#"
                SELECT t.id, t.title, t.description, t.status, t.project_id, t.assigned_to, t.created_at
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.id = $1 AND p.owner_id = $2
            "#,
            task_id,
            user_id
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Task not found".to_string()))?;

        Ok(task)
    }

    /// Actualizar una tarea
    pub async fn update(
        db: &AppState,
        user_id: uuid::Uuid,
        task_id: uuid::Uuid,
        payload: UpdateTaskPayload,
    ) -> Result<Task, AppError> {
        // Primero verificar que la tarea pertenece a un proyecto del usuario
        let existing = sqlx::query_as!(
            Task,
            r#"
                SELECT t.id, t.title, t.description, t.status, t.project_id, t.assigned_to, t.created_at
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.id = $1 AND p.owner_id = $2
            "#,
            task_id,
            user_id
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Task not found".to_string()))?;

        let title = payload.title.unwrap_or(existing.title);
        let description = payload.description.or(existing.description);
        let status = payload.status.unwrap_or(existing.status);
        let assigned_to = payload.assigned_to.or(existing.assigned_to);

        let task: Task = sqlx::query_as!(
            Task,
            r#"
                UPDATE tasks
                SET title = $1, description = $2, status = $3, assigned_to = $4
                WHERE id = $5
                RETURNING id, title, description, status, project_id as "project_id!", assigned_to, created_at as "created_at!"
            "#,
            title,
            description,
            status,
            assigned_to,
            task_id
        )
        .fetch_one(&db.db)
        .await?;

        // Invalidar cache
        let _ = invalidate_cache(&format!("tasks:project:{}:*", task.project_id)).await;

        Ok(task)
    }

    /// Eliminar una tarea
    pub async fn delete(
        db: &AppState,
        user_id: uuid::Uuid,
        task_id: uuid::Uuid,
    ) -> Result<(), AppError> {
        // Verificar que la tarea pertenece a un proyecto del usuario
        let task: Task = sqlx::query_as!(
            Task,
            r#"
                SELECT t.id, t.title, t.description, t.status, t.project_id, t.assigned_to, t.created_at
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.id = $1 AND p.owner_id = $2
            "#,
            task_id,
            user_id
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Task not found".to_string()))?;

        let result = sqlx::query!("DELETE FROM tasks WHERE id = $1", task_id)
            .execute(&db.db)
            .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Task not found".to_string()));
        }

        // Invalidar cache
        let _ = invalidate_cache(&format!("tasks:project:{}:*", task.project_id)).await;

        Ok(())
    }
}
