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
        api_model::{ApiResponse, PaginatedResponse},
        task_model::{CreateTaskPayload, Task, TaskQueryParams, UpdateTaskPayload},
    },
    services::{auth_service::AuthService, task_service::TaskService},
    states::AppState,
};

/// Crear una nueva tarea en un proyecto
pub async fn create_task(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(project_id): Path<uuid::Uuid>,
    Json(payload): Json<CreateTaskPayload>,
) -> Result<Json<ApiResponse<Task>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let task: Task = TaskService::create(&db, user_id, project_id, payload).await?;

    let response: ApiResponse<Task> = ApiResponse::success(task, "Task created successfully");

    Ok(Json(response))
}

/// Obtener todas las tareas de un proyecto con paginación
pub async fn get_tasks(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(project_id): Path<uuid::Uuid>,
    Query(params): Query<TaskQueryParams>,
) -> Result<Json<ApiResponse<PaginatedResponse<Task>>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let page: i64 = params.page.unwrap_or(1);
    let limit: i64 = params.limit.unwrap_or(10);
    let status: Option<String> = params.status.clone();

    let tasks: PaginatedResponse<Task> =
        TaskService::get_by_project(&db, user_id, project_id, page, limit, status).await?;

    let response: ApiResponse<PaginatedResponse<Task>> =
        ApiResponse::success(tasks, "Tasks retrieved successfully");

    Ok(Json(response))
}

/// Obtener una tarea por ID
pub async fn get_task(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(task_id): Path<uuid::Uuid>,
) -> Result<Json<ApiResponse<Task>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let task: Task = TaskService::get_by_id(&db, user_id, task_id).await?;

    let response: ApiResponse<Task> = ApiResponse::success(task, "Task retrieved successfully");

    Ok(Json(response))
}

/// Actualizar una tarea
pub async fn update_task(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(task_id): Path<uuid::Uuid>,
    Json(payload): Json<UpdateTaskPayload>,
) -> Result<Json<ApiResponse<Task>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    let task: Task = TaskService::update(&db, user_id, task_id, payload).await?;

    let response: ApiResponse<Task> = ApiResponse::success(task, "Task updated successfully");

    Ok(Json(response))
}

/// Eliminar una tarea
pub async fn delete_task(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
    Path(task_id): Path<uuid::Uuid>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    let user_id: Uuid = AuthService::get_user_id_from_token(&db, bearer.token()).await?;

    TaskService::delete(&db, user_id, task_id).await?;

    let response: ApiResponse<()> = ApiResponse::success((), "Task deleted successfully");

    Ok(Json(response))
}
