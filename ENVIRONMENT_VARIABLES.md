# 🔐 环境变量配置指南

本文档详细说明了 MyPilot 项目所需的所有环境变量。

---

## 📋 必需的环境变量

这些环境变量是应用运行所必需的：

### 1. 数据库

```bash
# PostgreSQL 数据库连接字符串
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**获取方式**:
- 开发环境: 本地 PostgreSQL 或 Docker
- 生产环境: [Neon](https://neon.tech)、[Supabase](https://supabase.com)、[Railway](https://railway.app)

**示例**:
```bash
# Neon
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require"

# 本地
DATABASE_URL="postgresql://postgres:password@localhost:5432/mypilot"
```

---

### 2. 认证 (NextAuth.js)

```bash
# 应用 URL
NEXTAUTH_URL="https://yourdomain.com"

# 认证密钥（用于加密 JWT）
NEXTAUTH_SECRET="your-secret-key-here"
```

**生成 NEXTAUTH_SECRET**:
```bash
# 方法 1: 使用 OpenSSL
openssl rand -base64 32

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法 3: 在线生成
# https://generate-secret.vercel.app/32
```

**注意**:
- 开发环境: `http://localhost:3000`
- 生产环境: `https://yourdomain.com`
- 每个环境使用不同的 `NEXTAUTH_SECRET`

---

### 3. 支付 (Stripe)

```bash
# 公钥（客户端使用）
STRIPE_PUBLIC_KEY="pk_test_..."  # 测试环境
STRIPE_PUBLIC_KEY="pk_live_..."  # 生产环境

# 密钥（服务器端使用）
STRIPE_SECRET_KEY="sk_test_..."  # 测试环境
STRIPE_SECRET_KEY="sk_live_..."  # 生产环境

# Webhook 密钥
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**获取方式**:
1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. 复制 API 密钥
3. 创建 Webhook 端点获取 Webhook 密钥

**测试 vs 生产**:
- 测试密钥: 用于开发和测试
- 生产密钥: 用于真实交易
- 不要混用！

---

### 4. 邮件服务 (Resend)

```bash
# API 密钥
RESEND_API_KEY="re_..."

# 发件人地址
EMAIL_FROM="MyPilot <noreply@yourdomain.com>"
```

**获取方式**:
1. 访问 [Resend](https://resend.com/api-keys)
2. 创建 API 密钥
3. 验证域名（生产环境）

**注意**:
- 开发环境: 可以使用 `onboarding@resend.dev`
- 生产环境: 必须使用已验证的域名

---

## 🔧 可选的环境变量

这些环境变量是可选的，但建议在生产环境中配置：

### 5. OAuth 提供商（可选）

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

**获取方式**:
- Google: [Google Cloud Console](https://console.cloud.google.com/)
- GitHub: [GitHub Developer Settings](https://github.com/settings/developers)

---

### 6. Redis（可选 - 用于速率限制）

```bash
# Redis 连接字符串
REDIS_URL="redis://localhost:6379"
```

**获取方式**:
- 本地: Docker 或本地安装
- 云服务: [Upstash](https://upstash.com)、[Redis Cloud](https://redis.com/cloud/)

**用途**:
- 速率限制存储
- 会话存储
- 缓存

---

### 7. AWS S3（可选 - 用于文件上传）

```bash
# AWS 访问密钥
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."

# AWS 区域
AWS_REGION="us-east-1"

# S3 存储桶
AWS_S3_BUCKET="mypilot-uploads"
```

**获取方式**:
1. 访问 [AWS IAM](https://console.aws.amazon.com/iam/)
2. 创建 IAM 用户
3. 创建 S3 存储桶

---

### 8. 外部 API

```bash
# 汇率 API（用于货币转换）
EXCHANGE_RATE_API_KEY="your-api-key"
```

**获取方式**:
- [ExchangeRate-API](https://www.exchangerate-api.com/)
- [Fixer.io](https://fixer.io/)

---

### 9. 监控和分析

```bash
# Sentry（错误追踪）
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="..."
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."

# PostHog（产品分析）
POSTHOG_API_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

**获取方式**:
- Sentry: [Sentry.io](https://sentry.io/)
- PostHog: [PostHog](https://posthog.com/)

---

### 10. 功能开关

```bash
# 启用用户注册
ENABLE_REGISTRATION="true"

# 启用游客结账
ENABLE_GUEST_CHECKOUT="true"

# 维护模式
MAINTENANCE_MODE="false"
```

---

### 11. 安全

```bash
# 加密密钥（用于敏感数据加密）
ENCRYPTION_KEY="your-encryption-key"
```

**生成方式**:
```bash
openssl rand -base64 32
```

---

## 📁 环境文件

### 开发环境 (`.env`)

```bash
# 复制 .env.example
cp .env.example .env

# 编辑 .env 文件
# 添加开发环境的值
```

### 生产环境 (`.env.production`)

```bash
# 复制 .env.production.example
cp .env.production.example .env.production

# 编辑 .env.production 文件
# 添加生产环境的值
```

**注意**: 
- `.env` 和 `.env.production` 已添加到 `.gitignore`
- 永远不要提交包含真实密钥的文件到 Git

---

## 🔒 安全最佳实践

### 1. 密钥管理

- ✅ 使用强随机密钥
- ✅ 每个环境使用不同的密钥
- ✅ 定期轮换密钥
- ❌ 不要在代码中硬编码密钥
- ❌ 不要提交密钥到 Git

### 2. 访问控制

- ✅ 限制谁可以访问生产密钥
- ✅ 使用最小权限原则
- ✅ 记录密钥访问日志

### 3. 密钥存储

**开发环境**:
- `.env` 文件（本地）
- 不要提交到 Git

**生产环境**:
- Vercel 环境变量
- AWS Secrets Manager
- HashiCorp Vault

---

## 🚀 Vercel 配置

### 添加环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目
3. 点击 "Settings" → "Environment Variables"
4. 添加变量

### 环境类型

- **Production**: 生产环境（`main` 分支）
- **Preview**: 预览环境（PR 和其他分支）
- **Development**: 开发环境（本地）

### 批量导入

```bash
# 使用 Vercel CLI
vercel env pull .env.local

# 批量添加
vercel env add < .env.production
```

---

## ✅ 验证配置

### 检查必需变量

```bash
# 运行部署检查脚本
npm run deploy:check

# 或手动检查
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL ? '✅ DATABASE_URL' : '❌ DATABASE_URL')"
```

### 测试连接

```bash
# 测试数据库连接
npx prisma db pull

# 测试 Stripe
curl https://api.stripe.com/v1/charges \
  -u $STRIPE_SECRET_KEY:

# 测试 Resend
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json"
```

---

## 📝 环境变量检查清单

### 开发环境

- [ ] `DATABASE_URL` - 本地或测试数据库
- [ ] `NEXTAUTH_URL` - `http://localhost:3000`
- [ ] `NEXTAUTH_SECRET` - 开发密钥
- [ ] `STRIPE_PUBLIC_KEY` - 测试公钥
- [ ] `STRIPE_SECRET_KEY` - 测试密钥
- [ ] `RESEND_API_KEY` - API 密钥

### 生产环境

- [ ] `DATABASE_URL` - 生产数据库（Neon）
- [ ] `NEXTAUTH_URL` - 生产域名
- [ ] `NEXTAUTH_SECRET` - 生产密钥（强随机）
- [ ] `STRIPE_PUBLIC_KEY` - 生产公钥
- [ ] `STRIPE_SECRET_KEY` - 生产密钥
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook 密钥
- [ ] `RESEND_API_KEY` - 生产 API 密钥
- [ ] `EMAIL_FROM` - 已验证的域名
- [ ] `NODE_ENV` - `production`

### 可选（生产环境）

- [ ] `REDIS_URL` - Redis 连接
- [ ] `SENTRY_DSN` - 错误追踪
- [ ] `POSTHOG_API_KEY` - 产品分析
- [ ] `AWS_*` - 文件上传
- [ ] `EXCHANGE_RATE_API_KEY` - 货币转换

---

## 🆘 故障排除

### 问题: 环境变量未生效

**解决方案**:
1. 检查变量名拼写
2. 重启开发服务器
3. 清除 Next.js 缓存: `rm -rf .next`
4. 在 Vercel 中重新部署

### 问题: 数据库连接失败

**解决方案**:
1. 检查 `DATABASE_URL` 格式
2. 确保包含 `?sslmode=require`
3. 验证数据库正在运行
4. 检查防火墙规则

### 问题: Stripe Webhook 失败

**解决方案**:
1. 验证 `STRIPE_WEBHOOK_SECRET`
2. 检查 Webhook URL
3. 查看 Stripe Dashboard 日志

---

## 📚 相关文档

- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel 环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma 环境变量](https://www.prisma.io/docs/guides/development-environment/environment-variables)

---

**需要帮助？** 查看 `DEPLOYMENT_GUIDE.md` 或联系支持团队。
