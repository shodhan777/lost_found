CREATE DATABASE IF NOT EXISTS lost_and_found_db;
USE lost_and_found_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lost_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date_lost DATE,
    image_url VARCHAR(255),
    status ENUM('lost', 'found', 'claimed') DEFAULT 'lost',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS found_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date_found DATE,
    image_url VARCHAR(255),
    status ENUM('unclaimed', 'claimed') DEFAULT 'unclaimed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lost_item_id INT,
    found_item_id INT,
    status VARCHAR(50) DEFAULT 'matched',
    claim_status VARCHAR(50) DEFAULT 'unclaimed',
    matched_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lost_image VARCHAR(255),
    found_image VARCHAR(255),
    FOREIGN KEY (lost_item_id) REFERENCES lost_items(id) ON DELETE CASCADE,
    FOREIGN KEY (found_item_id) REFERENCES found_items(id) ON DELETE CASCADE
);
