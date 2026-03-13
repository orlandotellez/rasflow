use axum::{
    Router,
    routing::{delete, get, post, put},
};

use crate::{handlers::project_handler, middlewares::auth_middleware, states::AppState};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/projects", post(project_handler::create_project))
        .route("/projects", get(project_handler::get_projects))
        .route("/projects/{id}", get(project_handler::get_project))
        .route("/projects/{id}", put(project_handler::update_project))
        .route("/projects/{id}", delete(project_handler::delete_project))
        .layer(axum::middleware::from_fn(auth_middleware::auth_middleware))
}
