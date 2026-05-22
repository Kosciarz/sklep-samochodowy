use anyhow::Result;
use argon2::{
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
    password_hash::{SaltString, rand_core::OsRng},
};
use axum::{
    Json, Router,
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
};
use jsonwebtoken::{EncodingKey, Header};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, postgres::PgPoolOptions, prelude::FromRow, types::chrono};
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
};

#[derive(Clone)]
struct AppState {
    db: PgPool,
    jwt_secret: String,
}

#[derive(Debug, FromRow, Serialize)]
struct Car {
    id: i32,
    name: String,
    price: i32,
    image_url: String,
}

#[derive(Debug, FromRow)]
struct User {
    id: i32,
    email: String,
    password_hash: String,
    role: String,
    created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    id: i32,
    role: String,
}

async fn get_cars(State(state): State<AppState>) -> Json<Vec<Car>> {
    let cars: Vec<Car> = sqlx::query_as::<_, Car>("SELECT id, name, price, image_url FROM cars")
        .fetch_all(&state.db)
        .await
        .unwrap();

    Json(cars)
}

#[derive(Serialize, Deserialize)]
struct RegisterRequest {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct AuthResponse {
    token: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    message: String,
}

async fn post_auth_register(
    State(state): State<AppState>,
    Json(body): Json<RegisterRequest>,
) -> impl IntoResponse {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let password_hash = argon2
        .hash_password(body.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    match insert_user(&state.db, &body.email, &password_hash).await {
        Ok(user) => {
            let claims = Claims {
                sub: user.email,
                id: user.id,
                role: user.role,
            };

            let token = jsonwebtoken::encode(
                &Header::default(),
                &claims,
                &EncodingKey::from_secret(state.jwt_secret.as_bytes()),
            )
            .unwrap();

            (StatusCode::OK, Json(AuthResponse { token })).into_response()
        }
        Err(e) => (
            StatusCode::CONFLICT,
            Json(ErrorResponse {
                message: format!("Failed to insert user: {e}"),
            }),
        )
            .into_response(),
    }
}

async fn insert_user(pool: &PgPool, email: &str, password_hash: &str) -> Result<User> {
    let user: User = sqlx::query_as(
        "INSERT INTO users (email, password_hash) 
        VALUES ($1, $2)
        RETURNING id, email, password_hash, role, created_at",
    )
    .bind(email)
    .bind(password_hash)
    .fetch_one(pool)
    .await?;

    Ok(user)
}

#[derive(Serialize, Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

async fn post_auth_login(
    State(state): State<AppState>,
    Json(body): Json<LoginRequest>,
) -> impl IntoResponse {
    let password_hash: String =
        match sqlx::query_scalar("SELECT password_hash FROM users WHERE email = $1")
            .bind(&body.email)
            .fetch_optional(&state.db)
            .await
            .unwrap()
        {
            Some(hash) => hash,
            None => return StatusCode::UNAUTHORIZED,
        };

    let parsed_hash = PasswordHash::new(&password_hash).unwrap();

    match Argon2::default().verify_password(body.password.as_bytes(), &parsed_hash) {
        Ok(_) => {
            println!(
                "Verified user {} with password {}",
                body.email, body.password
            );

            StatusCode::OK
        }
        Err(_) => {
            eprintln!(
                "Failed to verify user {} with password {}",
                body.email, body.password
            );

            StatusCode::UNAUTHORIZED
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL")?;
    let jwt_secret = std::env::var("JWT_SECRET")?;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::OPTIONS,
        ])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .unwrap();

    let state = AppState { db: pool, jwt_secret };

    let app = Router::new()
        .route("/cars", get(get_cars))
        .route("/auth/register", post(post_auth_register))
        .route("/auth/login", post(post_auth_login))
        .nest_service("/assets", ServeDir::new("assets"))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(std::net::SocketAddrV4::new(
        std::net::Ipv4Addr::new(0, 0, 0, 0),
        8080,
    ))
    .await?;

    axum::serve(listener, app).await?;

    Ok(())
}
