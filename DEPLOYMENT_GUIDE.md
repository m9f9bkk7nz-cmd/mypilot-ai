# 🚀 部署指南

本指南将帮助你将 MyPilot 电商网站部署到生产环境。

---

## 📋 部署前准备

### 1. 必需的账户

在开始部署之前，请确保你有以下账户：

- ✅ [Vercel](https://vercel.com) - 用于托管应用
- ✅ [Neon](https://neon.tech) - PostgreSQL 数据库（已有）
- ✅ [Stripe](https://stripe.com) - 支付处理
- ✅ [Resend](https://resend.com) - 邮件服务
- ✅ [GitHub](https://github.com) - 代码托管

### 2. 必需的环境变量

以下环境变量必须在 Vercel 中配置：

```bash
# 数据库
DATABASE_URL="postgresql://..."

# 认证
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"

# 支付
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 邮件
RESEND_API_KEY="re_..."
EMAIL_FROM="MyPilot <noreply@yourdomain.com>"
```

---

## 🎯 部署步骤

### 步骤 1: 准备代码仓库

#### 1.1 初始化 Git 仓库（如果还没有）

```bash
git init
git add .
git commit -m "Initial commit"
```

#### 1.2 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com/new)
2. 创建新仓库（例如：`mypilot-website`）
3. 不要初始化 README、.gitignore 或 license

#### 1.3 推送代码到 GitHub

```bash
git remote add origin https://github.com/yourusername/mypilot-website.git
git branch -M main
git push -u origin main
```

---

### 步骤 2: 配置 Vercel

#### 2.1 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 选择你的 GitHub 仓库
4. 点击 "Import"

#### 2.2 配置项目设置

**Framework Preset**: Next.js

**Root Directory**: `./` (默认)

**Build Command**: 
```bash
prisma generate && prisma migrate deploy && next build
```

**Output Directory**: `.next` (默认)

**Install Command**: 
```bash
npm install
```

#### 2.3 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

1. 点击 "Settings" → "Environment Variables"
2. 添加所有必需的环境变量（见上文）
3. 确保选择 "Production", "Preview", "Development" 环境

**重要环境变量**:

```bash
# 数据库（使用 Neon 生产数据库）
DATABASE_URL=postgresql://neondb_owner:npg_bJOErdW1vc6p@ep-morning-breeze-ahg3oivk-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# 认证（生成新的密钥）
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=<使用 openssl rand -base64 32 生成>

# Stripe（使用生产密钥）
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend（使用生产 API 密钥）
RESEND_API_KEY=re_...
EMAIL_FROM=MyPilot <noreply@yourdomain.com>

# 环境
NODE_ENV=production
```

#### 2.4 生成 NEXTAUTH_SECRET

```bash
# 在终端运行
openssl rand -base64 32
```

复制输出并设置为 `NEXTAUTH_SECRET` 环境变量。

---

### 步骤 3: 配置数据库

#### 3.1 运行数据库迁移

Vercel 构建时会自动运行 `prisma migrate deploy`，但你也可以手动运行：

```bash
# 设置生产数据库 URL
export DATABASE_URL="postgresql://..."

# 运行迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

#### 3.2 添加种子数据（可选）

```bash
npm run prisma:seed
```

---

### 步骤 4: 配置 Stripe Webhook

#### 4.1 创建 Webhook 端点

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. 点击 "Add endpoint"
3. 输入 URL: `https://yourdomain.vercel.app/api/webhooks/stripe`
4. 选择事件:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

#### 4.2 获取 Webhook 密钥

1. 点击新创建的 webhook
2. 复制 "Signing secret"
3. 在 Vercel 中设置 `STRIPE_WEBHOOK_SECRET` 环境变量

---

### 步骤 5: 配置自定义域名（可选）

#### 5.1 添加域名

1. 在 Vercel 项目中，点击 "Settings" → "Domains"
2. 输入你的域名（例如：`yourdomain.com`）
3. 点击 "Add"

#### 5.2 配置 DNS

根据 Vercel 的提示，在你的域名注册商处添加 DNS 记录：

**A 记录**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 记录**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 5.3 更新环境变量

更新 `NEXTAUTH_URL` 为你的自定义域名：

```bash
NEXTAUTH_URL=https://yourdomain.com
```

---

### 步骤 6: 部署

#### 6.1 触发部署

```bash
git add .
git commit -m "Ready for production"
git push origin main
```

Vercel 会自动检测推送并开始部署。

#### 6.2 监控部署

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 查看部署状态
3. 检查构建日志

#### 6.3 验证部署

部署完成后，访问以下 URL 验证：

- ✅ 主页: `https://yourdomain.vercel.app`
- ✅ 健康检查: `https://yourdomain.vercel.app/api/health`
- ✅ 产品页面: `https://yourdomain.vercel.app/en/products`

---

## 🔍 部署后检查

### 1. 功能测试

- [ ] 用户注册和登录
- [ ] 产品浏览和搜索
- [ ] 添加到购物车
- [ ] 结账流程
- [ ] 支付处理
- [ ] 订单确认邮件
- [ ] 管理员后台

### 2. 性能测试

使用以下工具测试性能：

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### 3. 安全检查

- [ ] HTTPS 已启用
- [ ] 安全响应头已设置
- [ ] 速率限制正常工作
- [ ] 敏感数据已加密

---

## 📊 监控和分析

### 1. Vercel Analytics

Vercel 自动提供基础分析：

1. 访问项目 → "Analytics"
2. 查看页面浏览量、性能指标等

### 2. 错误追踪（可选）

#### 集成 Sentry

```bash
npm install @sentry/nextjs
```

在 Vercel 中添加环境变量：

```bash
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### 3. 日志监控

Vercel 提供实时日志：

1. 访问项目 → "Logs"
2. 查看实时请求日志
3. 过滤错误和警告

---

## 🔄 持续部署

### 自动部署

Vercel 已配置自动部署：

- **Production**: 推送到 `main` 分支
- **Preview**: 推送到其他分支或创建 PR

### 手动部署

如果需要手动触发部署：

1. 访问 Vercel Dashboard
2. 选择项目
3. 点击 "Deployments" → "Redeploy"

---

## 🛠️ 故障排除

### 构建失败

**问题**: 构建时出现 Prisma 错误

**解决方案**:
```bash
# 确保 package.json 中有 postinstall 脚本
"postinstall": "prisma generate"
```

---

### 数据库连接失败

**问题**: 无法连接到数据库

**解决方案**:
1. 检查 `DATABASE_URL` 是否正确
2. 确保 Neon 数据库正在运行
3. 检查 SSL 模式: `?sslmode=require`

---

### 环境变量未生效

**问题**: 环境变量在生产环境中不可用

**解决方案**:
1. 在 Vercel 中重新检查环境变量
2. 确保选择了 "Production" 环境
3. 重新部署项目

---

### Stripe Webhook 失败

**问题**: Webhook 事件未被处理

**解决方案**:
1. 检查 Webhook URL 是否正确
2. 验证 `STRIPE_WEBHOOK_SECRET`
3. 查看 Stripe Dashboard 中的 Webhook 日志

---

## 📝 部署检查清单

### 部署前

- [ ] 所有测试通过
- [ ] 代码已提交到 GitHub
- [ ] 环境变量已准备好
- [ ] 数据库迁移已测试
- [ ] Stripe 测试模式正常工作

### 部署中

- [ ] Vercel 项目已创建
- [ ] 环境变量已配置
- [ ] 构建成功
- [ ] 数据库迁移已运行

### 部署后

- [ ] 网站可访问
- [ ] 健康检查通过
- [ ] 所有功能正常
- [ ] Stripe Webhook 已配置
- [ ] 邮件发送正常
- [ ] 性能指标良好
- [ ] 错误追踪已设置

---

## 🎉 完成！

恭喜！你的 MyPilot 电商网站已成功部署到生产环境。

### 下一步

1. **监控**: 定期检查日志和分析
2. **优化**: 根据性能指标进行优化
3. **更新**: 定期更新依赖和安全补丁
4. **备份**: 定期备份数据库

### 有用的链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
- [Stripe Webhook 文档](https://stripe.com/docs/webhooks)

---

**需要帮助？** 查看项目文档或联系支持团队。
