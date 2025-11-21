# Cloudflare Pages 部署指南

本指南将帮助您将导航网站部署到 Cloudflare Pages。

## 前置要求

- 已将代码上传到 GitHub（参考 [GitHub 上传指南](./GITHUB_DEPLOYMENT_GUIDE.md)）
- 拥有 Cloudflare 账号：https://dash.cloudflare.com/sign-up
- 已配置 Supabase（参考 [Supabase 配置指南](./SUPABASE_SETUP_GUIDE.md)）

## 步骤一：登录 Cloudflare

1. 访问 https://dash.cloudflare.com
2. 使用您的账号登录

## 步骤二：创建 Pages 项目

1. 在左侧菜单中选择 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**

## 步骤三：连接 GitHub 仓库

1. 选择 **GitHub** 作为 Git 提供商
2. 如果是第一次使用，需要授权 Cloudflare 访问您的 GitHub
3. 在仓库列表中找到 `nav-website-fullstack`（或您的仓库名）
4. 点击仓库名称旁的 **Begin setup**

## 步骤四：配置构建设置

填写以下配置：

### 基本设置

- **Project name**：`nav-website`（或您喜欢的名称，将成为域名的一部分）
- **Production branch**：`main`

### 构建设置

- **Framework preset**：选择 **None** 或 **Vite**
- **Build command**：
  ```bash
  pnpm build
  ```
- **Build output directory**：
  ```
  dist
  ```

### 高级设置（可选）

- **Root directory**：留空（如果项目在仓库根目录）
- **Environment variables**：稍后添加

## 步骤五：添加环境变量

这是**最重要**的步骤！

1. 在构建设置页面，找到 **Environment variables** 部分
2. 点击 **Add variable**
3. 添加以下变量：

| Variable name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | 您的 Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | 您的 Supabase Anon Key |

**获取 Supabase 凭证**：
1. 访问 https://supabase.com/dashboard
2. 选择您的项目
3. 点击左侧 **Settings** → **API**
4. 复制 **Project URL** 和 **anon public** key

## 步骤六：开始部署

1. 确认所有设置正确
2. 点击 **Save and Deploy**
3. Cloudflare 将开始构建和部署您的网站

## 步骤七：监控部署进度

1. 部署过程通常需要 2-5 分钟
2. 您可以查看实时构建日志
3. 如果构建失败，检查日志中的错误信息

## 步骤八：访问您的网站

部署成功后：

1. Cloudflare 会提供一个 URL，格式为：`https://nav-website.pages.dev`
2. 点击 URL 访问您的网站
3. 测试所有功能是否正常

## 配置自定义域名（可选）

### 添加自定义域名

1. 在项目页面，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入您的域名（例如：`nav.yourdomain.com`）
4. 按照提示在您的域名提供商处添加 DNS 记录

### DNS 配置

通常需要添加一条 CNAME 记录：

- **Type**：CNAME
- **Name**：nav（或您的子域名）
- **Target**：nav-website.pages.dev

## 自动部署

Cloudflare Pages 已自动配置 CI/CD：

- 每次推送到 `main` 分支，都会自动触发部署
- 其他分支的推送会创建预览部署
- 无需额外配置

## 部署预览

对于非主分支的推送：

1. Cloudflare 会创建预览部署
2. 预览 URL 格式：`https://[commit-hash].nav-website.pages.dev`
3. 可以在 Pull Request 中查看预览链接

## 常见问题

### 问题 1：构建失败 - "pnpm: command not found"

**解决方案**：Cloudflare Pages 默认使用 npm。修改构建命令：

```bash
npm install && npm run build
```

或者在项目根目录添加 `.nvmrc` 文件指定 Node 版本。

### 问题 2：构建成功但网站显示空白

**可能原因**：
1. 环境变量未正确配置
2. Supabase URL 或 Key 错误

**解决方案**：
1. 检查 **Settings** → **Environment variables**
2. 确认变量名称完全匹配（区分大小写）
3. 重新部署项目

### 问题 3：网站可以访问但无法登录

**可能原因**：Supabase 配置问题

**解决方案**：
1. 检查 Supabase 项目是否正常运行
2. 确认 RLS 策略已正确配置
3. 查看浏览器控制台的错误信息

### 问题 4：如何回滚到之前的版本

**解决方案**：
1. 在项目页面，点击 **Deployments**
2. 找到之前成功的部署
3. 点击 **...** → **Rollback to this deployment**

## 性能优化建议

### 启用缓存

Cloudflare Pages 自动启用缓存，但您可以优化：

1. 在项目根目录创建 `_headers` 文件：

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
```

### 启用 Brotli 压缩

Cloudflare 自动启用，无需额外配置。

## 监控和分析

### 查看访问统计

1. 在项目页面，点击 **Analytics**
2. 查看访问量、带宽使用等数据

### 查看部署历史

1. 点击 **Deployments**
2. 查看所有部署记录和状态

## 环境管理

### 生产环境

- 分支：`main`
- URL：`https://nav-website.pages.dev`
- 环境变量：生产环境的 Supabase 凭证

### 预览环境

- 分支：其他分支（如 `develop`）
- URL：动态生成
- 环境变量：可以配置不同的值用于测试

## 下一步

部署完成后，您可以：
1. 测试所有功能
2. 配置自定义域名
3. 查看 [完整部署工作流程](./COMPLETE_DEPLOYMENT_WORKFLOW.md)
4. 开始使用您的导航网站！

## 有用的链接

- Cloudflare Pages 文档：https://developers.cloudflare.com/pages/
- Cloudflare Pages 定价：https://pages.cloudflare.com/#pricing
- Cloudflare 社区：https://community.cloudflare.com/

## 成本说明

Cloudflare Pages 免费套餐包括：
- 无限请求
- 无限带宽
- 500 次构建/月
- 100 GB 存储

对于个人导航网站，免费套餐完全够用！
