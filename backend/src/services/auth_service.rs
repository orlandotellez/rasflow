use crate::{
    helpers::{
        errors::AppError,
        jwt::encode_jwt,
        password::{hash_password, verify_password},
    },
    models::{
        auth_model::{LoginPayload, RegisterPayload},
        user_model::User,
    },
    states::DbState,
};

pub struct AuthService;

impl AuthService {
    pub async fn register_user(db: &DbState, payload: RegisterPayload) -> Result<User, AppError> {
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
        .fetch_one(db)
        .await?;

        Ok(user)
    }

    pub async fn login_user(db: &DbState, payload: LoginPayload) -> Result<String, AppError> {
        let user = sqlx::query_as!(
            User,
            r#"
                SELECT id, email, password_hash, created_at as "created_at!"
                FROM users WHERE email = $1
            "#,
            payload.email
        )
        .fetch_optional(db)
        .await?
        .ok_or(AppError::NotFound("Invalid Credentials".to_string()))?;

        let valid_password = verify_password(&payload.password, &user.password_hash)?;

        if !valid_password {
            return Err(AppError::NotFound("Invalid Credentials".to_string()));
        }

        let token: String = encode_jwt(user.email)?;
        Ok(token)
    }

    pub async fn get_current_user(db: &DbState, email: &str) -> Result<User, AppError> {
        let user: User = sqlx::query_as!(
            User,
            r#"
                SELECT id, email, password_hash, created_at as "created_at!"
                FROM users WHERE email = $1
            "#,
            email
        )
        .fetch_one(db)
        .await?;

        Ok(user)
    }
}
