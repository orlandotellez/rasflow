use redis::aio::MultiplexedConnection;
use sqlx::PgPool;

pub type DbState = PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: DbState,
    pub redis: MultiplexedConnection,
}

impl AppState {
    pub fn new(db: DbState, redis: MultiplexedConnection) -> Self {
        Self { db, redis }
    }
}
