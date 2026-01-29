# ⚡ 快速部署指南

5 分钟内将 MyPilot 部署到生产环境！

---

## 🎯 前提条件

- ✅ GitHub 账户
- ✅ Vercel 账户（免费）
- ✅ Neon 数据库（已有）
- ✅ Stripe 账户
- ✅ Resend 账户

---

## 🚀 5 步部署

### 步骤 1: 推送代码到 GitHub (1 分钟)

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Ready for deployment"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/yourusername/mypilot-website.git
git branch -M main
git push -u origin main
```

---

### 步骤 2: 导入到 Vercel (1 分钟)

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 点击 "Import Git Repository"
3. 选择你的 GitHub 仓库
4. 点击 "Import"

---

### 步骤 3: 配置环境变量 (2 分钟)

在 Vercel 项目设置中添加以下环境变量：

#### 必需变量

```bash
# 数据库（使用你的 Neon 数据库）
DATABASE_URL=postgresql://neondb_owner:npg_bJOErdW1vc6p@ep-morning-breeze-ahg3oivk-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# 认证
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<运行: openssl rand -base64 32>

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

```bash
openssl rand -base64 32
```

---

### 步骤 4: 部署 (自动，1 分钟)

Vercel 会自动：
1. 安装依赖
2. 生成 Prisma Client
3. 运行数据库迁移
4. 构建应用
5. 部署到生产环境

---

### 步骤 5: 验证 (1 分钟)

```bash
# 检查健康状态
curl https://your-project.vercel.app/api/health

# 访问网站
open https://your-project.vercel.app
```

---

## ✅ 完成！

你的网站现在已经上线了！

### 访问地址

- 🌐 网站: `https://your-project.vercel.app`
- 🏥 健康检查: `https://your-project.vercel.app/api/health`
- 👨‍💼 管理后台: `https://your-project.vercel.app/en/admin`

---

## 🔧 配置 Stripe Webhook（可选但推荐）

### 1. 创建 Webhook

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. 点击 "Add endpoint"
3. URL: `https://your-project.vercel.app/api/webhooks/stripe`
4. 选择事件:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

### 2. 更新环境变量

1. 复制 Webhook 签名密钥
2. 在 Vercel 中更新 `STRIPE_WEBHOOK_SECRET`
3. 重新部署

---

## 🌐 配置自定义域名（可选）

### 1. 添加域名

1. Vercel 项目 → Settings → Domains
2. 输入你的域名
3. 点击 "Add"

### 2. 配置 DNS

在你的域名注册商处添加：

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. 更新环境变量

```bash
NEXTAUTH_URL=https://yourdomain.com
```

---

## 📊 监控

### Vercel Analytics（自动启用）

访问 Vercel Dashboard → Analytics 查看：
- 页面浏览量
- 性能指标
- 地理分布

### 实时日志

访问 Vercel Dashboard → Logs 查看：
- 请求日志
- 错误日志
- 构建日志

---

## 🆘 故障排除

### 构建失败？

检查 Vercel 构建日志：
1. Vercel Dashboard → Deployments
2. 点击失败的部署
3. 查看 "Build Logs"

常见问题：
- 环境变量缺失
- 数据库连接失败
- Prisma 生成失败

### 网站无法访问？

1. 检查部署状态（应该是 "Ready"）
2. 访问健康检查端点: `/api/health`
3. 查看 Vercel 日志

### 数据库连接失败？

1. 检查 `DATABASE_URL` 格式
2. 确保包含 `?sslmode=require`
3. 验证 Neon 数据库正在运行

---

## 📚 详细文档

需要更多信息？查看：

- 📖 [完整部署指南](./DEPLOYMENT_GUIDE.md)
- 🔐 [环境变量配置](./ENVIRONMENT_VARIABLES.md)
- 🛡️ [安全实现](./SECURITY_IMPLEMENTATION.md)
- 📦 [库存控制](./INVENTORY_CONTROL_GUIDE.md)

---

## 🎉 恭喜！

你的电商网站已成功部署！

### 下一步

1. ✅ 测试所有功能
2. ✅ 配置 Stripe Webhook
3. ✅ 添加自定义域名
4. ✅ 设置监控和分析
5. ✅ 开始销售！

---

**需要帮助？** 查看详细文档或联系支持团队。
