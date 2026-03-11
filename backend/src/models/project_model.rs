use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Project {
    pub id: Uuid,
    pub name: String,
    pub owner_id: Uuid,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct CreateProjectPayload {
    pub name: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct UpdateProjectPayload {
    pub name: String,
}
