use anyhow::Result;
use axum::{Json, Router, extract::State, routing::get};
use serde::Serialize;
use sqlx::{PgPool, postgres::PgPoolOptions, prelude::FromRow};

#[derive(Clone)]
struct AppState {
    db: PgPool,
}

#[derive(Debug, FromRow, Serialize)]
struct Car {
    id: i32,
    name: String,
    price: i32,
    image_url: String,
}

async fn get_cars(State(state): State<AppState>) -> Json<Vec<Car>> {
    let cars: Vec<Car> = sqlx::query_as::<_, Car>("SELECT id, name, price, image_url FROM cars")
        .fetch_all(&state.db)
        .await
        .unwrap();

    Json(cars)
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").unwrap();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .unwrap();

    let state = AppState { db: pool };

    let app = Router::new()
        .route("/cars", get(get_cars))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(std::net::SocketAddrV4::new(
        std::net::Ipv4Addr::new(0, 0, 0, 0),
        8080,
    ))
    .await?;

    println!("Listening on http://localhost:8080/cars");

    axum::serve(listener, app).await?;

    Ok(())
}
