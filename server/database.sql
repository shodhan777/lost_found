CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_number VARCHAR(50),
    role VARCHAR(50) DEFAULT 'Student' CHECK (role IN ('Student', 'Faculty', 'Staff', 'Admin')),
    contact_info VARCHAR(255),
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lost_items (
    id SERIAL PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date_lost DATE,
    time_lost TIME,
    contact_info VARCHAR(255),
    image_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'found', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS found_items (
    id SERIAL PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date_found DATE,
    time_found TIME,
    contact_info VARCHAR(255),
    image_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    lost_item_id INT NOT NULL,
    found_item_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'matched' CHECK (status IN ('matched', 'claimed', 'resolved')),
    claim_status VARCHAR(50) DEFAULT 'unclaimed' CHECK (claim_status IN ('unclaimed', 'claimed')),
    matched_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lost_image VARCHAR(255),
    found_image VARCHAR(255),
    FOREIGN KEY (lost_item_id) REFERENCES lost_items(id) ON DELETE CASCADE,
    FOREIGN KEY (found_item_id) REFERENCES found_items(id) ON DELETE CASCADE
);

-- Performance Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_lost_items_user_id ON lost_items(user_id);
CREATE INDEX IF NOT EXISTS idx_found_items_user_id ON found_items(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status, claim_status);
