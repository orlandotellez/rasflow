mod cache;
mod config;
mod db;
mod handlers;
mod helpers;
mod middlewares;
mod models;
mod routes;
mod services;
mod states;

use axum::{Router, http};
use dotenvy::dotenv;
use redis::Client;
use states::AppState;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::config::constants::{FRONTEND_URL, REDIS_URL};

const PORT: u16 = 3000;
const HOST: &str = "0.0.0.0";

#[tokio::main]
async fn main() {
    dotenv().ok();

    let cors = CorsLayer::new()
        .allow_origin(FRONTEND_URL.parse::<http::HeaderValue>().unwrap())
        .allow_methods([
            http::Method::GET,
            http::Method::POST,
            http::Method::PUT,
            http::Method::PATCH,
            http::Method::DELETE,
        ])
        .allow_headers([http::header::CONTENT_TYPE, http::header::AUTHORIZATION])
        .allow_credentials(true);

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "taskflow_api=info,tower_http=debug,axum=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
    tracing::info!("Initialize taskflow api");

    let db = db::pool::create_pool()
        .await
        .expect("error connect database");

    tracing::info!("Database connected");

    let redis_client: Client = redis::Client::open(REDIS_URL.as_str()).expect("Invalid Redis URL");

    let redis_conn = redis_client
        .get_multiplexed_async_connection()
        .await
        .expect("Error connecting to Redis");

    tracing::info!("Redis connected");

    let app_state: AppState = AppState::new(db, redis_conn);

    let router: Router = routes::create_routes().with_state(app_state).layer(cors);

    let addr: String = format!("{}:{}", HOST, PORT);

    let listener: TcpListener = TcpListener::bind(&addr).await.unwrap();

    axum::serve(listener, router).await.unwrap()
}
