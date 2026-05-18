use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenv::dotenv().ok();

    let pool = PgPoolOptions::new()
        .connect(&std::env::var("DATABASE_URL").unwrap())
        .await?;

    let sql = std::fs::read_to_string("seeds/seed.sql").unwrap();
    sqlx::raw_sql(&sql).execute(&pool).await?;

    Ok(())
}
