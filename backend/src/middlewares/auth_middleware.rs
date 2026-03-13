use crate::helpers::jwt::decode_jwt;
use axum::{body::Body, extract::Request, http::StatusCode, middleware::Next, response::Response};

pub async fn auth_middleware(
    mut request: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = request
        .headers()
        .get("Authorization")
        .and_then(|v| v.to_str().ok());

    match auth_header {
        Some(header) if header.starts_with("Bearer ") => {
            let token = header.trim_start_matches("Bearer ");

            match decode_jwt(token) {
                Ok(_) => {
                    // Token válido, continuar con la solicitud
                    let response = next.run(request).await;
                    Ok(response)
                }
                Err(_) => Err(StatusCode::UNAUTHORIZED),
            }
        }
        _ => Err(StatusCode::UNAUTHORIZED),
    }
}
