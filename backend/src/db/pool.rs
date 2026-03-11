use sqlx::{PgPool, postgres::PgPoolOptions};

use crate::config::constants::DATABASE_URL;

pub async fn create_pool() -> Result<PgPool, sqlx::Error> {
    tracing::info!("database url {}", &DATABASE_URL.to_string());

    PgPoolOptions::new()
        .max_connections(5)
        .connect(&DATABASE_URL)
        .await
}
