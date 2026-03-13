use axum::{
    routing::{delete, get, post, put},
    Router,
};

use crate::{handlers::task_handler, middlewares::auth_middleware, states::AppState};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/projects/{project_id}/tasks",
            post(task_handler::create_task),
        )
        .route("/projects/{project_id}/tasks", get(task_handler::get_tasks))
        .route("/tasks/{id}", get(task_handler::get_task))
        .route("/tasks/{id}", put(task_handler::update_task))
        .route("/tasks/{id}", delete(task_handler::delete_task))
        .layer(axum::middleware::from_fn(auth_middleware::auth_middleware))
}
