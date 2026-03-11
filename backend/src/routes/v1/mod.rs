pub mod auth_routes;

use axum::Router;

use crate::states::DbState;

pub fn v1_routes() -> Router<DbState> {
    Router::new().merge(auth_routes::routes())
}
