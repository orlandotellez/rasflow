use axum::{
    routing::{get, post},
    Router,
};

use crate::{handlers::auth_handler, states::AppState};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/auth/register", post(auth_handler::register_user))
        .route("/auth/login", post(auth_handler::login_user))
        .route("/auth/me", get(auth_handler::me))
}
