-- Migration: create_navigation_tables
-- Created at: 1761995052

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建网站表
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '🌐',
  visits INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建设置表
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  site_title TEXT NOT NULL DEFAULT '智能导航',
  site_emoji TEXT NOT NULL DEFAULT '🚀',
  city TEXT NOT NULL DEFAULT '北京',
  temperature TEXT NOT NULL DEFAULT '22°C',
  weather_condition TEXT NOT NULL DEFAULT '晴',
  search_engine TEXT NOT NULL DEFAULT 'google',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_category_id ON sites(category_id);
CREATE INDEX IF NOT EXISTS idx_sites_order ON sites(category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

-- 启用行级安全（RLS）
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Categories 表的 RLS 策略
-- 用户只能查看自己的分类
CREATE POLICY "用户可以查看自己的分类"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的分类
CREATE POLICY "用户可以创建自己的分类"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的分类
CREATE POLICY "用户可以更新自己的分类"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的分类
CREATE POLICY "用户可以删除自己的分类"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- Sites 表的 RLS 策略
-- 用户只能查看自己的网站
CREATE POLICY "用户可以查看自己的网站"
  ON sites FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的网站
CREATE POLICY "用户可以创建自己的网站"
  ON sites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的网站
CREATE POLICY "用户可以更新自己的网站"
  ON sites FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的网站
CREATE POLICY "用户可以删除自己的网站"
  ON sites FOR DELETE
  USING (auth.uid() = user_id);

-- Settings 表的 RLS 策略
-- 用户只能查看自己的设置
CREATE POLICY "用户可以查看自己的设置"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的设置
CREATE POLICY "用户可以创建自己的设置"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的设置
CREATE POLICY "用户可以更新自己的设置"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的设置
CREATE POLICY "用户可以删除自己的设置"
  ON settings FOR DELETE
  USING (auth.uid() = user_id);

-- 创建触发器：自动更新 settings 的 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();;