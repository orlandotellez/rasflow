pub mod auth_routes;
pub mod project_routes;
pub mod task_routes;

use axum::Router;

use crate::states::AppState;

pub fn v1_routes() -> Router<AppState> {
    Router::new()
        .merge(auth_routes::routes())
        .merge(project_routes::routes())
        .merge(task_routes::routes())
}
