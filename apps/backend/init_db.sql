-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla de juegos
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    players VARCHAR(20),
    min_age INTEGER,
    duration VARCHAR(20),
    categories TEXT[],
    difficulty VARCHAR(20),
    rating REAL,
    short_description TEXT,
    review TEXT,
    external_link VARCHAR(255),
    pros TEXT[],
    cons TEXT[],
    featured BOOLEAN DEFAULT false,
    rules_summary TEXT,
    rules_file VARCHAR(255)
); 