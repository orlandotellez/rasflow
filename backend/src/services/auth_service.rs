use crate::{
    helpers::{
        errors::AppError,
        jwt::{decode_jwt, encode_jwt},
        password::{hash_password, verify_password},
    },
    models::{
        auth_model::{Claim, LoginPayload, RegisterPayload},
        user_model::User,
    },
    states::AppState,
};

pub struct AuthService;

impl AuthService {
    // Registrar usuario
    pub async fn register_user(db: &AppState, payload: RegisterPayload) -> Result<User, AppError> {
        let hashed_password: String = hash_password(&payload.password)?;

        let user: User = sqlx::query_as!(
            User,
            r#"
                INSERT INTO users (email, password_hash)
                VALUES ($1, $2)
                RETURNING id, email, password_hash, created_at as "created_at!"
            "#,
            payload.email,
            hashed_password
        )
        .fetch_one(&db.db)
        .await?;

        Ok(user)
    }

    // Iniciar sesion del usuario
    pub async fn login_user(db: &AppState, payload: LoginPayload) -> Result<String, AppError> {
        let user: User = sqlx::query_as!(
            User,
            r#"
                SELECT id, email, password_hash, created_at as "created_at!"
                FROM users WHERE email = $1
            "#,
            payload.email
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("Invalid Credentials".to_string()))?;

        let valid_password = verify_password(&payload.password, &user.password_hash)?;

        if !valid_password {
            return Err(AppError::NotFound("Invalid Credentials".to_string()));
        }

        let token: String = encode_jwt(user.email)?;
        Ok(token)
    }

    // Obtener el usuario segun su email
    pub async fn get_current_user(db: &AppState, email: &str) -> Result<User, AppError> {
        let user: User = sqlx::query_as!(
            User,
            r#"
                SELECT id, email, password_hash, created_at as "created_at!"
                FROM users WHERE email = $1
            "#,
            email
        )
        .fetch_one(&db.db)
        .await?;

        Ok(user)
    }

    // Obtener el id del usuario
    pub async fn get_user_id_from_token(
        db: &AppState,
        token: &str,
    ) -> Result<uuid::Uuid, AppError> {
        let claims: Claim = decode_jwt(token)?;

        // Buscar el usuario por email en la base de datos
        let user: User = sqlx::query_as!(
            User,
            "SELECT id, email, password_hash, created_at as \"created_at!\" FROM users WHERE email = $1",
            claims.sub
        )
        .fetch_optional(&db.db)
        .await?
        .ok_or(AppError::NotFound("User not found".to_string()))?;

        Ok(user.id)
    }
}
