# 🚀 立即部署 - 完整步骤

**预计时间**: 10-15 分钟  
**难度**: 简单

---

## ✅ 部署前检查清单

- [ ] 代码已完成
- [ ] 环境变量已准备
- [ ] 数据库已配置（Neon）
- [ ] Stripe 账户已创建
- [ ] Resend 账户已创建

---

## 📋 第一步：安装必要工具

### 1. 安装 Git

**下载地址**: https://git-scm.com/download/win

**安装步骤**:
1. 下载 Git for Windows
2. 运行安装程序
3. 使用默认设置
4. 完成安装

**验证安装**:
```powershell
git --version
```

---

### 2. 创建 GitHub 账户（如果还没有）

**注册地址**: https://github.com/signup

---

## 📦 第二步：初始化 Git 仓库

### 1. 打开 PowerShell（在项目目录）

```powershell
# 初始化 Git 仓库
git init

# 配置 Git 用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit - Ready for deployment"
```

---

### 2. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`mypilot-website`
3. 设置为 Private（私有）
4. 不要初始化 README、.gitignore 或 license
5. 点击 "Create repository"

---

### 3. 推送代码到 GitHub

```powershell
# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/mypilot-website.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 🌐 第三步：部署到 Vercel

### 1. 创建 Vercel 账户

**注册地址**: https://vercel.com/signup

**推荐**: 使用 GitHub 账户登录

---

### 2. 导入项目

1. 登录 Vercel
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 找到 `mypilot-website` 仓库
5. 点击 "Import"

---

### 3. 配置项目

**Framework Preset**: Next.js（自动检测）

**Root Directory**: `./`（默认）

**Build Command**: 
```bash
prisma generate && prisma migrate deploy && next build
```

**Output Directory**: `.next`（默认）

**Install Command**: 
```bash
npm install
```

---

### 4. 配置环境变量

点击 "Environment Variables"，添加以下变量：

#### 必需变量

```bash
# 数据库
DATABASE_URL=postgresql://neondb_owner:npg_bJOErdW1vc6p@ep-morning-breeze-ahg3oivk-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# 认证（生成新密钥）
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<运行下面的命令生成>

# Stripe（使用生产密钥）
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_aPvYQqZn_FhUVdxWTU5bBqhzrq2WP37j1
EMAIL_FROM=MyPilot <noreply@yourdomain.com>

# 环境
NODE_ENV=production
```

#### 生成 NEXTAUTH_SECRET

**方法 1 - 在线生成**:
访问 https://generate-secret.vercel.app/32

**方法 2 - PowerShell**:
```powershell
# 生成随机密钥
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**方法 3 - Node.js**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 5. 部署

1. 确认所有环境变量已添加
2. 点击 "Deploy"
3. 等待构建完成（约 2-3 分钟）
4. 部署成功！🎉

---

## ✅ 第四步：验证部署

### 1. 访问网站

Vercel 会提供一个 URL，例如：
```
https://mypilot-website.vercel.app
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
  "timestamp": "2026-01-29T...",
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
- [ ] 结账流程

---

## 🔧 第五步：配置 Stripe Webhook

### 1. 创建 Webhook

1. 访问 https://dashboard.stripe.com/webhooks
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

### 2. 获取 Webhook 密钥

1. 点击新创建的 webhook
2. 复制 "Signing secret"（以 `whsec_` 开头）
3. 在 Vercel 中更新 `STRIPE_WEBHOOK_SECRET` 环境变量
4. 重新部署（Vercel → Deployments → Redeploy）

---

## 🌐 第六步：配置自定义域名（可选）

### 1. 添加域名

1. Vercel 项目 → Settings → Domains
2. 输入你的域名（例如：`mypilot.com`）
3. 点击 "Add"

### 2. 配置 DNS

在你的域名注册商处添加以下记录：

**A 记录**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME 记录**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. 更新环境变量

在 Vercel 中更新：
```bash
NEXTAUTH_URL=https://yourdomain.com
```

然后重新部署。

---

## 📊 第七步：设置监控

### 1. Vercel Analytics（自动启用）

访问：Vercel Dashboard → Your Project → Analytics

查看：
- 页面浏览量
- 性能指标
- 地理分布

### 2. 实时日志

访问：Vercel Dashboard → Your Project → Logs

查看：
- 请求日志
- 错误日志
- 构建日志

---

## 🎉 完成！

### 你的网站现在已经上线了！

**访问地址**:
- 🌐 网站: `https://your-project.vercel.app`
- 🏥 健康检查: `https://your-project.vercel.app/api/health`
- 👨‍💼 管理后台: `https://your-project.vercel.app/en/admin`
- 🗺️ Sitemap: `https://your-project.vercel.app/sitemap.xml`
- 🤖 Robots: `https://your-project.vercel.app/robots.txt`

---

## 📝 部署后任务

### 立即执行

- [ ] 测试所有核心功能
- [ ] 配置 Stripe Webhook
- [ ] 提交 Sitemap 到 Google Search Console
- [ ] 测试支付流程

### 本周内

- [ ] 添加产品数据
- [ ] 配置邮件模板
- [ ] 设置监控告警
- [ ] 性能测试

### 本月内

- [ ] SEO 优化
- [ ] 内容营销
- [ ] 用户反馈收集
- [ ] 持续优化

---

## 🆘 故障排除

### 构建失败？

**检查**:
1. Vercel 构建日志
2. 环境变量是否完整
3. 数据库连接是否正常

**解决方案**:
```bash
# 本地测试构建
npm run build
```

### 网站无法访问？

**检查**:
1. 部署状态（应该是 "Ready"）
2. 健康检查端点
3. Vercel 日志

### 数据库连接失败？

**检查**:
1. `DATABASE_URL` 格式是否正确
2. 是否包含 `?sslmode=require`
3. Neon 数据库是否正在运行

---

## 📚 相关文档

- `QUICK_DEPLOYMENT.md` - 快速部署（5分钟）
- `DEPLOYMENT_GUIDE.md` - 详细部署指南
- `ENVIRONMENT_VARIABLES.md` - 环境变量配置
- `DEPLOYMENT_COMPLETION.md` - 部署完成总结

---

## 🎊 恭喜！

你已经成功部署了一个功能完整、性能优异的电商网站！

**下一步**:
1. 开始添加产品
2. 测试购物流程
3. 邀请用户测试
4. 开始销售！

**需要帮助？** 查看文档或联系支持团队。

---

**祝你生意兴隆！** 🚀💰🎉
