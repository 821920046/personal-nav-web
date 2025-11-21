# Supabase 配置指南

本指南将帮助您配置 Supabase 数据库用于导航网站。

## 前置要求

- 拥有 Supabase 账号：https://supabase.com

## 步骤一：创建 Supabase 项目

1. 访问 https://supabase.com/dashboard
2. 点击 **New project**
3. 填写项目信息：
   - **Name**：`nav-website`（或您喜欢的名称）
   - **Database Password**：设置一个强密码（请妥善保存）
   - **Region**：选择离您最近的区域（建议：Singapore 或 Tokyo）
   - **Pricing Plan**：Free（免费套餐足够使用）
4. 点击 **Create new project**
5. 等待项目初始化（约 2 分钟）

## 步骤二：获取 API 凭证

1. 在项目页面，点击左侧菜单 **Settings** → **API**
2. 找到以下信息：
   - **Project URL**：类似 `https://xxxxx.supabase.co`
   - **anon public** key：以 `eyJ` 开头的长字符串
3. 复制这两个值，稍后需要用到

## 步骤三：运行数据库迁移

### 方法一：使用 SQL 编辑器（推荐）

1. 在 Supabase 项目页面，点击左侧 **SQL Editor**
2. 点击 **New query**
3. 复制以下 SQL 脚本并粘贴到编辑器中
4. 点击 **Run** 执行

#### 创建表结构

```sql
-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建网站表
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '🔗',
  visits INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建设置表
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  site_title TEXT NOT NULL DEFAULT '智能导航网站',
  logo_type TEXT NOT NULL DEFAULT 'url',
  logo_content TEXT NOT NULL DEFAULT '🌐',
  province TEXT NOT NULL DEFAULT '北京市',
  city TEXT NOT NULL DEFAULT '北京',
  temperature TEXT NOT NULL DEFAULT '20°C',
  weather_condition TEXT NOT NULL DEFAULT '晴',
  default_search_engine TEXT NOT NULL DEFAULT 'google',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_category_id ON sites(category_id);
CREATE INDEX IF NOT EXISTS idx_sites_order ON sites(category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);
```

#### 配置行级安全策略 (RLS)

```sql
-- 启用行级安全
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 分类表策略
CREATE POLICY "用户可以查看自己的分类"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的分类"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的分类"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的分类"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- 网站表策略
CREATE POLICY "用户可以查看自己的网站"
  ON sites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的网站"
  ON sites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的网站"
  ON sites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的网站"
  ON sites FOR DELETE
  USING (auth.uid() = user_id);

-- 设置表策略
CREATE POLICY "用户可以查看自己的设置"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的设置"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的设置"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的设置"
  ON settings FOR DELETE
  USING (auth.uid() = user_id);
```

### 方法二：使用迁移文件

如果项目中已有迁移文件（`supabase/migrations/` 目录），可以使用 Supabase CLI：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

## 步骤四：配置认证设置

1. 点击左侧 **Authentication** → **Providers**
2. 确保 **Email** 提供商已启用
3. 配置邮箱设置（可选）：
   - **Enable email confirmations**：根据需要开启/关闭
   - **Enable email change confirmations**：建议开启

## 步骤五：测试数据库连接

### 创建测试用户

1. 点击左侧 **Authentication** → **Users**
2. 点击 **Add user** → **Create new user**
3. 填写邮箱和密码
4. 点击 **Create user**

### 验证表结构

1. 点击左侧 **Table Editor**
2. 确认可以看到三个表：
   - `categories`
   - `sites`
   - `settings`
3. 点击每个表，查看列结构是否正确

## 步骤六：配置环境变量

### 本地开发

在项目根目录创建 `.env` 文件：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Cloudflare Pages

参考 [Cloudflare Pages 部署指南](./CLOUDFLARE_PAGES_GUIDE.md) 添加环境变量。

## 安全最佳实践

### 1. 保护 API 密钥

- ✅ **DO**：使用 `anon` key（公开密钥）
- ❌ **DON'T**：使用 `service_role` key（服务密钥）在前端

### 2. 启用 RLS

- 确保所有表都启用了行级安全策略
- 测试策略是否正确工作

### 3. 定期备份

1. 点击 **Database** → **Backups**
2. 查看自动备份设置
3. 免费套餐提供 7 天备份

### 4. 监控使用情况

1. 点击 **Settings** → **Usage**
2. 查看数据库大小、API 请求等
3. 免费套餐限制：
   - 500 MB 数据库存储
   - 2 GB 带宽/月
   - 50,000 月活用户

## 常见问题

### 问题 1：RLS 策略导致无法访问数据

**症状**：前端无法读取或写入数据

**解决方案**：
1. 检查 RLS 策略是否正确配置
2. 确认用户已登录（`auth.uid()` 不为空）
3. 在 SQL 编辑器中测试查询

### 问题 2：注册用户后无法登录

**可能原因**：启用了邮箱确认

**解决方案**：
1. 检查 **Authentication** → **Email Templates**
2. 关闭邮箱确认，或配置 SMTP 服务器

### 问题 3：数据库连接超时

**解决方案**：
1. 检查 Supabase 项目状态
2. 确认 API URL 和 Key 正确
3. 查看浏览器控制台的网络请求

### 问题 4：如何重置数据库

**警告**：这将删除所有数据！

```sql
-- 删除所有数据
TRUNCATE categories, sites, settings CASCADE;

-- 或删除表并重新创建
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- 然后重新运行创建表的 SQL
```

## 数据库管理

### 查看表数据

1. 点击 **Table Editor**
2. 选择表
3. 查看、编辑、删除数据

### 执行 SQL 查询

1. 点击 **SQL Editor**
2. 编写查询
3. 点击 **Run**

### 示例查询

```sql
-- 查看所有分类
SELECT * FROM categories ORDER BY order_index;

-- 查看某个用户的所有网站
SELECT s.*, c.name as category_name
FROM sites s
JOIN categories c ON s.category_id = c.id
WHERE s.user_id = 'user-uuid'
ORDER BY c.order_index, s.order_index;

-- 统计每个分类的网站数量
SELECT c.name, COUNT(s.id) as site_count
FROM categories c
LEFT JOIN sites s ON c.id = s.category_id
GROUP BY c.id, c.name;
```

## 性能优化

### 1. 使用索引

已在迁移脚本中创建，无需额外配置。

### 2. 启用 Realtime（可选）

如果需要实时更新功能：

1. 点击 **Database** → **Replication**
2. 启用需要实时更新的表
3. 在前端代码中使用 Supabase Realtime API

### 3. 连接池

Supabase 自动管理连接池，无需配置。

## 监控和日志

### 查看 API 日志

1. 点击 **Logs** → **API Logs**
2. 查看请求历史和错误

### 查看数据库日志

1. 点击 **Logs** → **Database Logs**
2. 查看查询性能和错误

## 下一步

配置完成后，您可以：
1. 测试本地开发环境
2. 部署到 Cloudflare Pages
3. 查看 [完整部署工作流程](./COMPLETE_DEPLOYMENT_WORKFLOW.md)

## 有用的链接

- Supabase 文档：https://supabase.com/docs
- Supabase CLI：https://supabase.com/docs/guides/cli
- SQL 参考：https://supabase.com/docs/guides/database/overview
- RLS 指南：https://supabase.com/docs/guides/auth/row-level-security
