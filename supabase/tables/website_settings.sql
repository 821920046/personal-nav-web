CREATE TABLE website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    site_title VARCHAR(255) NOT NULL DEFAULT '智能导航',
    logo_type VARCHAR(20) NOT NULL DEFAULT 'url',
    logo_content TEXT,
    province VARCHAR(50),
    city VARCHAR(50),
    temperature VARCHAR(20),
    weather_condition VARCHAR(50),
    default_search_engine VARCHAR(50) NOT NULL DEFAULT 'google',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);