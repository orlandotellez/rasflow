use axum::{
    Json,
    extract::{Path, Query, State},
};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use uuid::Uuid;

use crate::{
    helpers::errors::AppError,
    models::{
        api_model::{ApiResponse, PaginatedResponse, PaginationParams},
        project_model::{CreateProjectPayload, Project, UpdateProjectPayload},
    },
    services::{auth_service::AuthService, project_service::ProjectService},
    states::AppState,
};

/// Crear un nuevo proyecto
pub async fn create_project(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Json(payload): Json<CreateProjectPayload>,
) -> Result<Json<ApiResponse<Project>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let project: Project = ProjectService::create_project(&db, user_id, payload).await?;

    let response: ApiResponse<Project> =
        ApiResponse::success(project, "Project created successfully");
    Ok(Json(response))
}

/// Obtener todos los proyectos del usuario con paginación
pub async fn get_projects(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<PaginatedResponse<Project>>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let page: i64 = params.page.unwrap_or(1);
    let limit: i64 = params.limit.unwrap_or(10);

    let projects: PaginatedResponse<Project> =
        ProjectService::get_all(&db, user_id, page, limit).await?;

    let response: ApiResponse<PaginatedResponse<Project>> =
        ApiResponse::success(projects, "Projects retrieved successfully");

    Ok(Json(response))
}

/// Obtener un proyecto por ID
pub async fn get_project(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(project_id): Path<uuid::Uuid>,
) -> Result<Json<ApiResponse<Project>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let project: Project = ProjectService::get_by_id(&db, user_id, project_id).await?;

    let response: ApiResponse<Project> =
        ApiResponse::success(project, "Project retrieved successfully");

    Ok(Json(response))
}

/// Actualizar un proyecto
pub async fn update_project(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(project_id): Path<uuid::Uuid>,
    Json(payload): Json<UpdateProjectPayload>,
) -> Result<Json<ApiResponse<Project>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let project: Project = ProjectService::update(&db, user_id, project_id, payload).await?;

    let response: ApiResponse<Project> =
        ApiResponse::success(project, "Project updated successfully");

    Ok(Json(response))
}

/// Eliminar un proyecto
pub async fn delete_project(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(project_id): Path<uuid::Uuid>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    ProjectService::delete(&db, user_id, project_id).await?;

    let response: ApiResponse<()> = ApiResponse::success((), "Project deleted successfully");
    Ok(Json(response))
}
