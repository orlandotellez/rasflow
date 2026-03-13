use redis::Client;
use sqlx::PgPool;

pub type DbState = PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: DbState,
    pub redis: Client,
}

impl AppState {
    pub fn new(db: DbState, redis: Client) -> Self {
        Self { db, redis }
    }
}
