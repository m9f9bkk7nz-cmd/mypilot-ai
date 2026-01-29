# ✅ 部署检查清单

快速参考 - 打印或保存此清单

---

## 📋 部署前准备

### 工具安装
- [ ] Git 已安装
- [ ] Node.js 已安装
- [ ] GitHub 账户已创建
- [ ] Vercel 账户已创建

### 账户准备
- [ ] Neon 数据库已配置
- [ ] Stripe 账户已创建
- [ ] Resend 账户已创建
- [ ] 生产环境密钥已获取

---

## 🚀 部署步骤

### 1. Git 初始化
```powershell
git init
git add .
git commit -m "Initial commit"
```

### 2. 推送到 GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/mypilot-website.git
git branch -M main
git push -u origin main
```

### 3. Vercel 部署
- [ ] 导入 GitHub 仓库
- [ ] 配置环境变量
- [ ] 点击 Deploy
- [ ] 等待构建完成

---

## 🔐 必需的环境变量

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<生成的密钥>
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
EMAIL_FROM=MyPilot <noreply@yourdomain.com>
NODE_ENV=production
```

---

## ✅ 部署后验证

### 功能测试
- [ ] 首页加载
- [ ] 产品页面
- [ ] 用户注册
- [ ] 用户登录
- [ ] 购物车
- [ ] 结账流程
- [ ] 管理后台

### 技术检查
- [ ] 健康检查端点 (`/api/health`)
- [ ] Sitemap (`/sitemap.xml`)
- [ ] Robots.txt (`/robots.txt`)
- [ ] 性能分数 > 90
- [ ] 无控制台错误

---

## 🔧 配置 Stripe Webhook

1. 访问 https://dashboard.stripe.com/webhooks
2. 添加端点：`https://your-project.vercel.app/api/webhooks/stripe`
3. 选择事件：
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.refunded
4. 复制 Signing secret
5. 更新 Vercel 环境变量
6. 重新部署

---

## 📊 监控设置

### Vercel Analytics
- [ ] 访问 Analytics 面板
- [ ] 查看性能指标
- [ ] 设置告警

### Google Search Console
- [ ] 添加网站
- [ ] 验证所有权
- [ ] 提交 Sitemap

---

## 🎯 上线后任务

### 第一天
- [ ] 测试所有功能
- [ ] 配置 Stripe Webhook
- [ ] 添加测试产品
- [ ] 测试支付流程

### 第一周
- [ ] 添加真实产品
- [ ] 配置邮件模板
- [ ] 性能测试
- [ ] 用户测试

### 第一月
- [ ] SEO 优化
- [ ] 内容营销
- [ ] 用户反馈
- [ ] 持续优化

---

## 🆘 快速故障排除

### 构建失败
```powershell
# 本地测试
npm run build
```

### 数据库连接失败
- 检查 DATABASE_URL
- 确保包含 ?sslmode=require
- 验证 Neon 数据库状态

### 环境变量未生效
- 检查 Vercel 环境变量
- 选择正确的环境（Production）
- 重新部署

---

## 📞 获取帮助

### 文档
- `START_DEPLOYMENT.md` - 完整部署步骤
- `QUICK_DEPLOYMENT.md` - 快速部署
- `DEPLOYMENT_GUIDE.md` - 详细指南

### 支持
- Vercel 文档: https://vercel.com/docs
- Next.js 文档: https://nextjs.org/docs
- Stripe 文档: https://stripe.com/docs

---

**打印此清单，逐项完成！** ✅
