use axum::{Json, extract::State};

use crate::{
    helpers::errors::AppError,
    models::{
        api_model::ApiResponse,
        auth_model::{AuthResponse, LoginPayload, RegisterPayload},
        user_model::User,
    },
    services::auth_service::AuthService,
    states::DbState,
};

pub async fn resgister_user(
    State(db): State<DbState>,
    Json(payload): Json<RegisterPayload>,
) -> Result<Json<ApiResponse<User>>, AppError> {
    let register_user: User = AuthService::register_user(&db, payload)
        .await
        .map_err(|_| AppError::InternalServerError("Internal server error".to_string()))?;

    let response: ApiResponse<User> =
        ApiResponse::success(register_user, "User registered sucessfully");

    Ok(Json(response))
}

pub async fn login_user(
    State(db): State<DbState>,
    Json(payload): Json<LoginPayload>,
) -> Result<Json<ApiResponse<AuthResponse>>, AppError> {
    let token = AuthService::login_user(&db, payload)
        .await
        .map_err(|_| AppError::Unauthorized("Unauthorized".to_string()))?;

    let response: ApiResponse<AuthResponse> = ApiResponse::success(
        AuthResponse {
            access_token: token,
            token_type: "Bearer",
        },
        "Login sucessfully",
    );

    Ok(Json(response))
}
