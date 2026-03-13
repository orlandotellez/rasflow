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

use axum::Router;
use dotenvy::dotenv;
use states::AppState;
use tokio::net::TcpListener;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

const PORT: u16 = 3000;
const HOST: &str = "0.0.0.0";

#[tokio::main]
async fn main() {
    dotenv().ok();

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

    let redis = cache::redis::get_redis_client()
        .await
        .expect("Error connecting to Redis");

    tracing::info!("Redis connected");

    let app_state: AppState = AppState::new(db, redis);

    let router: Router = routes::create_routes().with_state(app_state);

    let addr: String = format!("{}:{}", HOST, PORT);

    let listener: TcpListener = TcpListener::bind(&addr).await.unwrap();

    axum::serve(listener, router).await.unwrap()
}
