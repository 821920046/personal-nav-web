CREATE TABLE china_regions (
    id SERIAL PRIMARY KEY,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    city_code VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);