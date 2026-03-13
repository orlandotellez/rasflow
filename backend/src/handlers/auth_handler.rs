use axum::{Json, extract::State};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};

use crate::{
    helpers::{errors::AppError, jwt::decode_jwt},
    models::{
        api_model::ApiResponse,
        auth_model::{AuthResponse, Claim, LoginPayload, RegisterPayload},
        user_model::{User, UserResponse},
    },
    services::auth_service::AuthService,
    states::AppState,
};

// Registrar usuario
pub async fn register_user(
    State(db): State<AppState>,
    Json(payload): Json<RegisterPayload>,
) -> Result<Json<ApiResponse<User>>, AppError> {
    let register_user: User = AuthService::register_user(&db, payload)
        .await
        .map_err(|_| AppError::InternalServerError("Internal server error".to_string()))?;

    let response: ApiResponse<User> =
        ApiResponse::success(register_user, "User registered successfully");

    Ok(Json(response))
}

// Iniciar sesion del usuario
pub async fn login_user(
    State(db): State<AppState>,
    Json(payload): Json<LoginPayload>,
) -> Result<Json<ApiResponse<AuthResponse>>, AppError> {
    let token: String = AuthService::login_user(&db, payload)
        .await
        .map_err(|_| AppError::Unauthorized("Unauthorized".to_string()))?;

    let response: ApiResponse<AuthResponse> = ApiResponse::success(
        AuthResponse {
            access_token: token,
            token_type: "Bearer",
        },
        "Login successfully",
    );

    Ok(Json(response))
}

// Handler que extrae el usuario desde el token JWT
#[axum::debug_handler]
pub async fn me(
    State(db): State<AppState>,
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
) -> Result<Json<ApiResponse<UserResponse>>, AppError> {
    // Decodificar el token para obtener el email
    let claims: Claim = decode_jwt(bearer.token())?;

    // Buscar el usuario por email
    let user: User = AuthService::get_current_user(&db, &claims.sub).await?;

    let user_response: UserResponse = UserResponse::from(user);

    let response: ApiResponse<UserResponse> =
        ApiResponse::success(user_response, "User retrieved successfully");

    Ok(Json(response))
}
