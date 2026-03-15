use crate::{
    cache::redis::{get_cache, invalidate_cache, set_cache},
    helpers::errors::AppError,
    models::{
        api_model::{PaginatedResponse, PaginationMeta},
        project_model::{CreateProjectPayload, Project, UpdateProjectPayload},
    },
    states::AppState,
};

pub struct ProjectService;

impl ProjectService {
    // Crear proyecto
    pub async fn create_project(
        db: &AppState,
        user_id: uuid::Uuid,
        payload: CreateProjectPayload,
    ) -> Result<Project, AppError> {
        let project: Project = sqlx::query_as!(
            Project,
            r#"
                INSERT INTO projects (name, owner_id)
                VALUES ($1, $2)
                RETURNING id, name, owner_id as "owner_id!", created_at as "created_at!"
            "#,
            payload.name,
            user_id
        )
        .fetch_one(&db.db)
        .await?;

        // Invalidar cache de proyectos del usuario
        let _ = invalidate_cache(db.redis.clone(), &format!("projects:user:{}:*", user_id)).await;

        Ok(project)
    }

    /// Obtener todos los proyectos del usuario con paginación
    pub async fn get_all(
        db: &AppState,
        user_id: uuid::Uuid,
        page: i64,
        limit: i64,
    ) -> Result<PaginatedResponse<Project>, AppError> {
        let offset: i64 = (page - 1) * limit;

        // Intentar obtener del cache primero
        let cache_key: String = format!("projects:user:{}:page:{}:limit:{}", user_id, page, limit);

        if let Some(cached) =
            get_cache::<PaginatedResponse<Project>>(db.redis.clone(), &cache_key).await?
        {
            tracing::info!("Cache hit for projects");
            return Ok(cached);
        }

        // Obtener total de proyectos
        let total: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM projects WHERE owner_id = $1")
            .bind(user_id)
            .fetch_one(&db.db)
            .await?;

        // Obtener proyectos paginados
        let projects: Vec<Project> = sqlx::query_as!(
            Project,
            r#"
                SELECT id, name, owner_id as "owner_id!", created_at as "created_at!"
                FROM projects
                WHERE owner_id = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            "#,
            user_id,
            limit,
            offset
        )
        .fetch_all(&db.db)
        .await?;

        let meta: PaginationMeta = PaginationMeta::new(page, limit, total.0);
        let response: PaginatedResponse<Project> = PaginatedResponse {
            data: projects,
            meta,
        };

        // Guardar en cache por 60 segundos
        let _ = set_cache(db.redis.clone(), &cache_key, &response, 60).await;

        Ok(response)
    }

    /// Obtener un proyecto por ID (solo si es del usuario)
    pub async fn get_by_id(
        db: &AppState,
        user_id: uuid::Uuid,
        project_id: uuid::Uuid,
    ) -> Result<Project, AppError> {
        let project: Project = sqlx::query_as!(
            Project,
            r#"
                SELECT id, name, owner_id as "owner_id!", created_at as "created_at!"
                FROM projects
                WHERE id = $1 AND owner_id = $2
            "#,
            project_id,
            user_id
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Project not found".to_string()))?;

        Ok(project)
    }

    /// Actualizar un proyecto (solo el owner)
    pub async fn update(
        db: &AppState,
        user_id: uuid::Uuid,
        project_id: uuid::Uuid,
        payload: UpdateProjectPayload,
    ) -> Result<Project, AppError> {
        let project: Project = sqlx::query_as!(
            Project,
            r#"
                UPDATE projects
                SET name = $1
                WHERE id = $2 AND owner_id = $3
                RETURNING id, name, owner_id as "owner_id!", created_at as "created_at!"
            "#,
            payload.name,
            project_id,
            user_id
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Project not found".to_string()))?;

        // Invalidar cache
        let _ = invalidate_cache(db.redis.clone(), &format!("projects:user:{}:*", user_id)).await;

        Ok(project)
    }

    /// Eliminar un proyecto (solo el owner)
    pub async fn delete(
        db: &AppState,
        user_id: uuid::Uuid,
        project_id: uuid::Uuid,
    ) -> Result<(), AppError> {
        let result = sqlx::query!(
            "DELETE FROM projects WHERE id = $1 AND owner_id = $2",
            project_id,
            user_id
        )
        .execute(&db.db)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Project not found".to_string()));
        }

        // Invalidar cache
        let _ = invalidate_cache(db.redis.clone(), &format!("projects:user:{}:*", user_id)).await;

        Ok(())
    }
}
