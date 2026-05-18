use sqlx::{postgres::PgPoolOptions, prelude::FromRow};
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    
    let database_url = std::env::var("DATABASE_URL")?;

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    let cars: Vec<Car> = sqlx::query_as::<_, Car>("SELECT id, name, price, image_url FROM cars")
        .fetch_all(&pool)
        .await?;

    Ok(())
}

#[derive(Debug, FromRow)]
struct Car {
    id: i32,
    name: String,
    price: i32,
    image_url: String,
}
