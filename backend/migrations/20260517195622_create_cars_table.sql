-- Add migration script here
CREATE TABLE
    cars (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        slug VARCHAR NOT NULL UNIQUE,
        name VARCHAR NOT NULL,
        price INTEGER NOT NULL,
        image_url VARCHAR NOT NULL
    );