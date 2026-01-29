# 🚀 立即部署 - 3步完成

**当前状态**: 代码已完成 ✅ | Git 未安装 ⚠️  
**预计时间**: 15分钟  
**难度**: 简单

---

## 📋 第一步：安装 Git（5分钟）

### 为什么需要 Git？
Git 是将代码推送到 GitHub 的必需工具，GitHub 是 Vercel 部署的代码源。

### 安装步骤

1. **下载 Git for Windows**
   - 访问：https://git-scm.com/download/win
   - 点击 "Click here to download" 下载最新版本
   - 文件大小约 50MB

2. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - 使用默认设置（一路点击 "Next"）
   - 完成后点击 "Finish"

3. **验证安装**
   - 关闭当前 PowerShell 窗口
   - 重新打开 PowerShell
   - 运行命令：
   ```powershell
   git --version
   ```
   - 应该显示：`git version 2.x.x`

---

## 📦 第二步：推送代码到 GitHub（5分钟）

### 1. 创建 GitHub 账户（如果还没有）

访问：https://github.com/signup

### 2. 初始化 Git 仓库

在项目目录打开 PowerShell，运行：

```powershell
# 初始化 Git 仓库
git init

# 配置用户信息（替换为你的信息）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit - Ready for deployment"
```

### 3. 创建 GitHub 仓库

1. 访问：https://github.com/new
2. 仓库名称：`mypilot-website`
3. 设置为 **Private**（私有）
4. **不要**勾选任何初始化选项
5. 点击 "Create repository"

### 4. 推送代码

在 GitHub 创建仓库后，页面会显示命令。运行：

```powershell
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/mypilot-website.git

# 推送代码
git branch -M main
git push -u origin main
```

**如果要求登录**：
- 输入 GitHub 用户名
- 密码使用 Personal Access Token（不是账户密码）
- 创建 Token：https://github.com/settings/tokens

---

## 🌐 第三步：部署到 Vercel（5分钟）

### 1. 创建 Vercel 账户

1. 访问：https://vercel.com/signup
2. 选择 "Continue with GitHub"
3. 授权 Vercel 访问 GitHub

### 2. 导入项目

1. 在 Vercel Dashboard，点击 "Add New..." → "Project"
2. 找到 `mypilot-website` 仓库
3. 点击 "Import"

### 3. 配置项目

**Framework Preset**: Next.js（自动检测）

**Build Command**（重要！）:
```bash
prisma generate && next build
```

**Output Directory**: `.next`（默认）

**Install Command**: `npm install`（默认）

### 4. 配置环境变量

点击 "Environment Variables"，添加以下变量：

```bash
# 数据库（已有）
DATABASE_URL=postgresql://neondb_owner:npg_bJOErdW1vc6p@ep-morning-breeze-ahg3oivk-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# 认证（需要生成）
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<点击下面链接生成>

# Stripe（需要获取生产密钥）
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend（已有）
RESEND_API_KEY=re_aPvYQqZn_FhUVdxWTU5bBqhzrq2WP37j1
EMAIL_FROM=MyPilot <noreply@yourdomain.com>

# 环境
NODE_ENV=production
```

#### 生成 NEXTAUTH_SECRET

**方法 1 - 在线生成**（最简单）:
访问：https://generate-secret.vercel.app/32

**方法 2 - PowerShell**:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

#### 获取 Stripe 生产密钥

1. 访问：https://dashboard.stripe.com/apikeys
2. 切换到 "Production" 模式
3. 复制 "Publishable key"（pk_live_...）
4. 复制 "Secret key"（sk_live_...）
5. Webhook Secret 稍后配置

### 5. 部署！

1. 确认所有环境变量已添加
2. 点击 "Deploy"
3. 等待构建完成（约 2-3 分钟）
4. 🎉 部署成功！

---

## ✅ 验证部署

### 1. 访问网站

Vercel 会提供一个 URL：
```
https://mypilot-website-xxx.vercel.app
```

### 2. 检查健康状态

访问：
```
https://your-project.vercel.app/api/health
```

应该返回：
```json
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "connected",
    "api": "operational"
  }
}
```

### 3. 测试核心功能

- [ ] 首页加载正常
- [ ] 产品页面显示
- [ ] 用户注册/登录
- [ ] 购物车功能

---

## 🔧 配置 Stripe Webhook（重要！）

### 为什么需要？
Webhook 让 Stripe 在支付完成后通知你的网站，更新订单状态。

### 配置步骤

1. 访问：https://dashboard.stripe.com/webhooks
2. 点击 "Add endpoint"
3. 输入 URL：
   ```
   https://your-project.vercel.app/api/webhooks/stripe
   ```
4. 选择事件：
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. 点击 "Add endpoint"
6. 复制 "Signing secret"（以 `whsec_` 开头）
7. 在 Vercel 中添加环境变量：
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...`
8. 在 Vercel 中点击 "Redeploy"

---

## 🎉 完成！

### 你的网站现在已经上线了！

**访问地址**:
- 🌐 网站: `https://your-project.vercel.app`
- 🏥 健康检查: `https://your-project.vercel.app/api/health`
- 👨‍💼 管理后台: `https://your-project.vercel.app/en/admin`

---

## 🆘 常见问题

### Q: Git 安装后还是提示找不到？
**A**: 关闭并重新打开 PowerShell 窗口。

### Q: GitHub 推送要求密码？
**A**: 使用 Personal Access Token，不是账户密码。
创建 Token：https://github.com/settings/tokens

### Q: Vercel 构建失败？
**A**: 检查：
1. Build Command 是否正确：`prisma generate && next build`
2. 环境变量是否完整
3. DATABASE_URL 是否正确

### Q: 网站显示 500 错误？
**A**: 检查：
1. Vercel 日志（Deployments → Logs）
2. 数据库连接是否正常
3. 环境变量是否正确

### Q: 支付不工作？
**A**: 确保：
1. 使用 Stripe 生产密钥（pk_live_...）
2. Webhook 已配置
3. STRIPE_WEBHOOK_SECRET 已设置

---

## 📞 获取帮助

### 详细文档
- `START_DEPLOYMENT.md` - 完整部署步骤
- `DEPLOYMENT_CHECKLIST.md` - 检查清单
- `DEPLOYMENT_GUIDE.md` - 详细指南

### 在线资源
- Vercel 文档: https://vercel.com/docs
- Next.js 文档: https://nextjs.org/docs
- Stripe 文档: https://stripe.com/docs

---

## 🎯 部署后任务

### 立即执行
- [ ] 测试所有功能
- [ ] 配置 Stripe Webhook
- [ ] 添加测试产品

### 本周内
- [ ] 添加真实产品
- [ ] 测试支付流程
- [ ] 邀请用户测试

### 本月内
- [ ] 配置自定义域名
- [ ] SEO 优化
- [ ] 内容营销

---

**准备好了吗？开始第一步：安装 Git！** 🚀

