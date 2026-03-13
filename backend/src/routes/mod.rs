pub mod v1;

use axum::Router;

use crate::{routes::v1::v1_routes, states::AppState};

pub fn create_routes() -> Router<AppState> {
    Router::new().nest("/api/v1", v1_routes())
}
