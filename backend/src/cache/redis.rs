use crate::helpers::errors::AppError;
use redis::{AsyncCommands, aio::MultiplexedConnection};
use serde::{Serialize, de::DeserializeOwned};

/// Obtener datos del caché
pub async fn get_cache<T: DeserializeOwned>(
    mut conn: MultiplexedConnection,
    key: &str,
) -> Result<Option<T>, AppError> {
    let value: Option<String> = conn
        .get(key)
        .await
        .map_err(|e| AppError::InternalServerError(format!("Redis GET error: {}", e)))?;

    match value {
        Some(v) => {
            let data = serde_json::from_str(&v).map_err(|e| {
                AppError::InternalServerError(format!("Deserialization error: {}", e))
            })?;
            Ok(Some(data))
        }
        None => Ok(None),
    }
}

/// Guardar datos en el caché con un tiempo de vida (TTL)
pub async fn set_cache<T: Serialize>(
    mut conn: MultiplexedConnection, // Recibimos la conexión del state
    key: &str,
    value: &T,
    ttl_seconds: u64,
) -> Result<(), AppError> {
    let serialized = serde_json::to_string(value)
        .map_err(|e| AppError::InternalServerError(format!("Error serializing value: {}", e)))?;

    let _: () = conn
        .set_ex(key, serialized, ttl_seconds)
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error saving cache: {}", e)))?;

    Ok(())
}

/// Invalidar caché basado en un patrón (ej: "projects:user:123:*")
pub async fn invalidate_cache(
    mut conn: MultiplexedConnection, // Recibimos la conexión del state
    pattern: &str,
) -> Result<(), AppError> {
    // Buscamos las llaves que coinciden con el patrón
    let keys: Vec<String> = conn
        .keys(pattern)
        .await
        .map_err(|e| AppError::InternalServerError(format!("Error searching keys: {}", e)))?;

    if !keys.is_empty() {
        let _: () = conn.del(keys).await.map_err(|e| {
            AppError::InternalServerError(format!("Error invalidating cache: {}", e))
        })?;
    }

    Ok(())
}
