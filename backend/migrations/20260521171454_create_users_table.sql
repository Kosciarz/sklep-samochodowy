-- Add migration script here
CREATE TABLE
    users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password_hash VARCHAR NOT NULL,
        role VARCHAR NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );