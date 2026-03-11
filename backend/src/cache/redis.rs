use redis::{AsyncCommands, Client};

use crate::{config::constants::REDIS_URL, helpers::errors::AppError};
use serde::{Serialize, de::DeserializeOwned};

pub async fn get_redis_client() -> Result<Client, AppError> {
    Client::open(REDIS_URL.as_str())
        .map_err(|e| AppError::InternalServerError(format!("Error connect redis: {}", e)))
}

pub async fn get_cache<T: DeserializeOwned>(key: &str) -> Result<Option<T>, AppError> {
    let client: Client = get_redis_client().await?;

    let mut conn = client
        .get_multiplexed_async_connection()
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error connect redis: {}", e)))?;

    let value: Option<String> = conn
        .get(key)
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error cache: {}", e)))?;

    match value {
        Some(v) => {
            let data: T = serde_json::from_str(&v).map_err(|e| {
                AppError::InternalServerError(format!("Deserialize errror cache: {}", e))
            })?;

            Ok(Some(data))
        }
        None => Ok(None),
    }
}

pub async fn set_cache<T: Serialize>(
    key: &str,
    value: &T,
    ttl_secconds: u64,
) -> Result<(), AppError> {
    let client: Client = get_redis_client().await?;
    let mut conn = client
        .get_multiplexed_async_connection()
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error connect redis: {}", e)))?;
    let serialized = serde_json::to_string(value)
        .map_err(|e| AppError::InternalServerError(format!("Error serialized value: {}", e)))?;

    conn.set_ex::<_, _, ()>(key, serialized, ttl_secconds)
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error saving cache: {}", e)))?;

    Ok(())
}

pub async fn invalidate_cache(pattern: &str) -> Result<(), AppError> {
    let client: Client = get_redis_client().await?;

    let mut conn = client
        .get_multiplexed_async_connection()
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error connect redis: {}", e)))?;

    let keys: Vec<String> = conn
        .keys(pattern)
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error search keys: {}", e)))?;

    if !keys.is_empty() {
        conn.del::<_, ()>(keys)
            .await
            .map_err(|e| AppError::InternalServerError(format!("Error invalid cache: {}", e)))?;
    }

    Ok(())
}
