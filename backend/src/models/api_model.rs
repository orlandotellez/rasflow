use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: T,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationMeta {
    pub page: i64,
    pub limit: i64,
    pub total: i64,
    pub total_page: i64,
}

pub struct PaginatedResponse<T> {
    pub data: Vec<T>,
    pub meta: PaginationMeta,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, message: &str) -> Self {
        Self {
            success: true,
            message: message.to_string(),
            data,
        }
    }
}

impl PaginationMeta {
    pub fn new(page: i64, limit: i64, total: i64) -> Self {
        let total_page = (total as f64 / limit as f64).ceil() as i64;
        Self {
            page,
            limit,
            total,
            total_page,
        }
    }
}
