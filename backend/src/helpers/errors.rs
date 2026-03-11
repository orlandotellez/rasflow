use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;
use validator::ValidationErrors;

#[derive(Debug)]
#[allow(dead_code)]
pub enum AppError {
    NotFound(String),
    BadRequest(String),
    InternalServerError(String),
    Unauthorized(String),
    Forbidden(String),
    ValidationError(ValidationErrors),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message_error) = match self {
            AppError::NotFound(message) => (
                StatusCode::NOT_FOUND,
                json!({"error": "not_found", "message": message}),
            ),
            AppError::InternalServerError(message) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"error": "internal_server_error", "message": message}),
            ),
            AppError::Unauthorized(message) => (
                StatusCode::UNAUTHORIZED,
                json!({"error": "unauthorized", "message": message}),
            ),
            AppError::Forbidden(message) => (
                StatusCode::FORBIDDEN,
                json!({"error": "forbidden", "message": message}),
            ),
            AppError::BadRequest(message) => (
                StatusCode::BAD_REQUEST,
                json!({"error": "bad_request", "message": message}),
            ),
            AppError::ValidationError(err) => {
                let errors = err
                    .field_errors()
                    .into_iter()
                    .map(|(field, errors)| {
                        let messages: Vec<String> = errors
                            .iter()
                            .filter_map(|e| e.message.clone())
                            .map(|m| m.to_string())
                            .collect();
                        json!({ "field": field, "errors": messages })
                    })
                    .collect::<Vec<_>>();
                (
                    StatusCode::BAD_REQUEST,
                    json!({"error": "validation_error", "message": "Error de validación", "errors": errors}),
                )
            }
        };
        (status, Json(message_error)).into_response()
    }
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => AppError::NotFound("Recurso no encontrado".to_string()),
            _ => AppError::InternalServerError(err.to_string()),
        }
    }
}
