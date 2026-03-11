use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::fmt::Display;
use std::str::FromStr;
use tracing_subscriber::field::debug;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum TaskStatus {
    Todo,
    InProgress,
    Done,
}

impl Display for TaskStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TaskStatus::Todo => write!(f, "todo"),
            TaskStatus::InProgress => write!(f, "in_progress"),
            TaskStatus::Done => write!(f, "done"),
        }
    }
}

impl FromStr for TaskStatus {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "todo" => Ok(TaskStatus::Todo),
            "in_progress" => Ok(TaskStatus::InProgress),
            "done" => Ok(TaskStatus::Done),
            _ => Err(format!("'{}' not is a valid error", s)),
        }
    }
}

impl From<String> for TaskStatus {
    fn from(value: String) -> Self {
        value.as_str().parse().unwrap_or(TaskStatus::Todo)
    }
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Task {
    pub id: Uuid,
    pub title: String,
    pub description: Option<String>,
    #[sqlx(try_from = "String")]
    pub status: TaskStatus,
    pub project_id: Uuid,
    pub assigned_to: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct CreateTaskPayload {
    pub title: String,
    pub description: Option<String>,
    pub status: Option<TaskStatus>,
    pub assigned_to: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct UpdateTaskPayload {
    pub title: Option<String>,
    pub description: Option<String>,
    pub status: Option<TaskStatus>,
    pub assigned_to: DateTime<Utc>,
}
