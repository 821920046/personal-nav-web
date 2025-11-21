# GitHub 上传完整指南

本指南将帮助您将导航网站项目上传到 GitHub。

## 前置要求

- 安装 Git：https://git-scm.com/downloads
- 拥有 GitHub 账号：https://github.com
- 确保项目代码在本地

## 步骤一：初始化 Git 仓库

打开终端/命令提示符，进入项目根目录：

```bash
cd "c:\Users\qh686\Desktop\google code\nav-website-fullstack-backup"
```

初始化 Git 仓库：

```bash
git init
```

## 步骤二：配置 Git 用户信息

如果是第一次使用 Git，需要配置用户信息：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

## 步骤三：添加文件到暂存区

将所有文件添加到 Git：

```bash
git add .
```

检查状态：

```bash
git status
```

## 步骤四：提交更改

创建第一次提交：

```bash
git commit -m "Initial commit: 智能导航网站"
```

## 步骤五：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**：`nav-website-fullstack`（或您喜欢的名称）
   - **Description**：全栈智能导航网站
   - **Public** 或 **Private**：根据需要选择
   - **不要**勾选 "Initialize this repository with a README"
3. 点击 "Create repository"

## 步骤六：连接远程仓库

复制 GitHub 提供的仓库 URL（例如：`https://github.com/你的用户名/nav-website-fullstack.git`）

在终端中执行：

```bash
git remote add origin https://github.com/你的用户名/nav-website-fullstack.git
```

## 步骤七：推送代码到 GitHub

推送到主分支：

```bash
git branch -M main
git push -u origin main
```

如果是第一次推送，可能需要输入 GitHub 用户名和密码（或使用 Personal Access Token）。

## 步骤八：验证上传

访问您的 GitHub 仓库页面，确认所有文件已成功上传。

## 常见问题

### 问题 1：推送时要求输入密码

**解决方案**：GitHub 已不再支持密码认证，需要使用 Personal Access Token (PAT)：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置权限（至少勾选 `repo`）
4. 生成并复制 token
5. 在推送时使用 token 作为密码

### 问题 2：推送被拒绝

**解决方案**：

```bash
git pull origin main --rebase
git push origin main
```

### 问题 3：文件太大无法上传

**解决方案**：检查 `.gitignore` 文件，确保 `node_modules` 和 `dist` 已被忽略。

## 后续更新代码

当您修改代码后，使用以下命令更新 GitHub：

```bash
# 1. 添加更改
git add .

# 2. 提交更改
git commit -m "描述您的更改"

# 3. 推送到 GitHub
git push origin main
```

## 分支管理建议

### 创建开发分支

```bash
git checkout -b develop
```

### 合并分支

```bash
git checkout main
git merge develop
git push origin main
```

## 下一步

代码上传到 GitHub 后，您可以：
1. 继续查看 [Cloudflare Pages 部署指南](./CLOUDFLARE_PAGES_GUIDE.md)
2. 配置 [Supabase 数据库](./SUPABASE_SETUP_GUIDE.md)
3. 查看 [完整部署工作流程](./COMPLETE_DEPLOYMENT_WORKFLOW.md)

## 有用的 Git 命令

```bash
# 查看提交历史
git log --oneline

# 查看当前状态
git status

# 查看远程仓库
git remote -v

# 撤销未提交的更改
git checkout -- .

# 查看文件差异
git diff
```
