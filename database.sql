CREATE DATABASE IF NOT EXISTS gamesearch_db;
USE gamesearch_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(500),
    short_description TEXT,
    game_url VARCHAR(500),
    genre VARCHAR(100),
    platform VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    user_id INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS token_blacklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL,
    expiration DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password) 
VALUES ('admin', '$2b$10$0RWGfC.RMZeQwQb4wfSfdOJ4RIjUmzVRRqWPiF1fy4ZWJ36taeRT.'); 