use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Claim {
    pub sub: String, // email del usuario
    pub exp: usize,
    pub iat: usize,
}

#[derive(Deserialize, Clone, Debug)]
pub struct RegisterPayload {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, Clone, Debug)]
pub struct LoginPayload {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub access_token: String,
    pub token_type: &'static str, // Bearer
}
