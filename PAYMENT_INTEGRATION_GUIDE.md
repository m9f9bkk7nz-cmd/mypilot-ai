# 💳 支付集成指南（Stripe）

## 概述

本指南将帮助你集成 Stripe 支付网关，让用户能够使用信用卡、借记卡等方式支付订单。

---

## 为什么选择 Stripe？

- ✅ 全球最流行的支付网关
- ✅ 支持 135+ 种货币
- ✅ 支持多种支付方式（信用卡、Apple Pay、Google Pay、Alipay 等）
- ✅ 强大的 API 和文档
- ✅ 自动处理 PCI 合规
- ✅ 测试模式（无需真实支付）

---

## 快速设置（10 分钟）

### 步骤 1：安装 Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

### 步骤 2：注册 Stripe 账号

访问：https://dashboard.stripe.com/register

使用以下方式注册：
- 邮箱注册
- Google 账号

### 步骤 3：获取 API 密钥

登录后，进入：https://dashboard.stripe.com/apikeys

你会看到两组密钥：

**测试模式密钥**（用于开发）：
- Publishable key: `pk_test_...`
- Secret key: `sk_test_...`

**生产模式密钥**（用于正式环境）：
- Publishable key: `pk_live_...`
- Secret key: `sk_live_...`

**现在使用测试模式密钥！**

### 步骤 4：更新 .env 文件

打开项目的 `.env` 文件，添加：

```env
# Stripe Payment
STRIPE_PUBLIC_KEY="pk_test_your_publishable_key_here"
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
STRIPE_WEBHOOK_SECRET=""  # 稍后配置
```

### 步骤 5：运行数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行迁移（添加支付相关字段）
npx prisma migrate dev --name add_payment_fields
```

### 步骤 6：重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

---

## 支付流程

### 1. 用户结账

用户在结账页面填写配送信息并选择支付方式。

### 2. 创建支付意图

前端调用 API 创建 Stripe Payment Intent：

```typescript
POST /api/payment/create-intent
{
  "orderId": "order_id_here"
}
```

返回：
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### 3. 用户输入支付信息

使用 Stripe Elements 组件让用户输入信用卡信息。

### 4. 确认支付

Stripe 处理支付并返回结果。

### 5. 更新订单状态

前端调用 API 确认支付：

```typescript
POST /api/payment/confirm
{
  "paymentIntentId": "pi_xxx"
}
```

### 6. 发送确认邮件

系统自动发送订单确认邮件给用户。

---

## 配置 Webhook（重要！）

Webhook 让 Stripe 能够通知你的服务器支付事件（成功、失败、退款等）。

### 本地开发测试

#### 1. 安装 Stripe CLI

访问：https://stripe.com/docs/stripe-cli

**Windows**:
```bash
# 使用 Scoop
scoop install stripe

# 或下载安装包
# https://github.com/stripe/stripe-cli/releases
```

**Mac**:
```bash
brew install stripe/stripe-cli/stripe
```

#### 2. 登录 Stripe CLI

```bash
stripe login
```

会打开浏览器让你授权。

#### 3. 转发 Webhook 到本地

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

会显示 webhook signing secret：
```
> Ready! Your webhook signing secret is whsec_xxx...
```

#### 4. 更新 .env 文件

```env
STRIPE_WEBHOOK_SECRET="whsec_xxx..."
```

#### 5. 测试 Webhook

在另一个终端触发测试事件：

```bash
stripe trigger payment_intent.succeeded
```

查看你的应用控制台，应该能看到 webhook 事件被处理。

### 生产环境配置

#### 1. 在 Stripe Dashboard 配置 Webhook

访问：https://dashboard.stripe.com/webhooks

点击 "Add endpoint"

**Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`

**监听的事件**：
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

#### 2. 获取 Signing Secret

创建后会显示 signing secret：`whsec_xxx...`

#### 3. 更新生产环境变量

在 Vercel 或你的部署平台添加：
```
STRIPE_WEBHOOK_SECRET=whsec_xxx...
```

---

## 测试支付

### 测试卡号

Stripe 提供测试卡号用于开发：

**成功支付**：
- 卡号：`4242 4242 4242 4242`
- 过期日期：任何未来日期（如 `12/34`）
- CVC：任何 3 位数字（如 `123`）
- 邮编：任何 5 位数字（如 `12345`）

**支付失败**：
- 卡号：`4000 0000 0000 0002`

**需要 3D 验证**：
- 卡号：`4000 0025 0000 3155`

更多测试卡：https://stripe.com/docs/testing

### 测试流程

1. 访问你的网站
2. 添加产品到购物车
3. 进入结账页面
4. 使用测试卡号支付
5. 查看订单状态是否更新
6. 检查是否收到确认邮件

---

## API 端点

### 创建支付意图

```
POST /api/payment/create-intent
```

**请求体**：
```json
{
  "orderId": "order_id"
}
```

**响应**：
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### 确认支付

```
POST /api/payment/confirm
```

**请求体**：
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**响应**：
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-xxx",
    "status": "PROCESSING",
    "paymentStatus": "PAID"
  }
}
```

### Webhook 端点

```
POST /api/webhooks/stripe
```

自动处理以下事件：
- `payment_intent.succeeded` - 支付成功
- `payment_intent.payment_failed` - 支付失败
- `charge.refunded` - 退款

---

## 前端集成

### 安装 Stripe.js

已包含在项目中：`@stripe/stripe-js`

### 使用示例

```typescript
import { loadStripe } from '@stripe/stripe-js';

// 初始化 Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// 创建支付意图
const response = await fetch('/api/payment/create-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId }),
});

const { clientSecret } = await response.json();

// 确认支付
const stripe = await stripePromise;
const { error, paymentIntent } = await stripe!.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: customerName,
      email: customerEmail,
    },
  },
});

if (error) {
  // 处理错误
  console.error(error.message);
} else if (paymentIntent.status === 'succeeded') {
  // 支付成功，确认订单
  await fetch('/api/payment/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
  });
}
```

---

## 支持的支付方式

Stripe 支持多种支付方式：

### 已启用
- ✅ 信用卡/借记卡（Visa, Mastercard, Amex 等）

### 可选启用
- Apple Pay
- Google Pay
- Alipay（支付宝）
- WeChat Pay（微信支付）
- SEPA Direct Debit（欧洲）
- iDEAL（荷兰）
- Bancontact（比利时）

要启用更多支付方式，在 Stripe Dashboard 的 Settings → Payment methods 中配置。

---

## 安全性

### PCI 合规

Stripe 自动处理 PCI 合规：
- 信用卡信息从不经过你的服务器
- 使用 Stripe Elements 安全收集支付信息
- Stripe 负责加密和存储

### 最佳实践

1. **永远不要记录信用卡信息**
2. **使用 HTTPS**（Vercel 自动提供）
3. **验证 Webhook 签名**（已实现）
4. **使用环境变量存储密钥**
5. **测试模式和生产模式分离**

---

## 退款处理

### 通过 API 退款

```typescript
import { createRefund } from '@/lib/stripe';

// 全额退款
await createRefund(paymentIntentId);

// 部分退款
await createRefund(paymentIntentId, 50.00);
```

### 通过 Dashboard 退款

1. 访问：https://dashboard.stripe.com/payments
2. 找到支付记录
3. 点击 "Refund"
4. 输入退款金额
5. 确认

Webhook 会自动通知你的服务器，订单状态会更新为 REFUNDED。

---

## 常见问题

### Q: 测试模式和生产模式有什么区别？
A: 
- 测试模式：使用测试密钥和测试卡号，不会产生真实交易
- 生产模式：使用生产密钥，处理真实支付

### Q: 如何切换到生产模式？
A:
1. 在 Stripe Dashboard 切换到生产模式
2. 获取生产模式的 API 密钥
3. 更新 `.env` 文件中的密钥
4. 配置生产环境的 Webhook

### Q: Stripe 收费多少？
A:
- 国际卡：3.4% + $0.30 每笔交易
- 中国卡：3.9% + $0.30 每笔交易
- 无月费，无设置费

### Q: 支持哪些货币？
A: 支持 135+ 种货币，包括：
- USD（美元）
- EUR（欧元）
- CNY（人民币）
- JPY（日元）
- KRW（韩元）

### Q: 如何处理争议（Chargeback）？
A: Stripe Dashboard 会通知你争议，你可以：
1. 提供证据（订单记录、物流信息等）
2. Stripe 会代表你处理争议
3. 查看 Dashboard 了解争议状态

---

## 监控和分析

### Stripe Dashboard

访问：https://dashboard.stripe.com

可以查看：
- 实时支付
- 成功率
- 收入统计
- 客户信息
- 争议和退款

### 日志

系统会在控制台输出支付相关日志：

```
✅ Payment succeeded for order: ORD-xxx
❌ Payment failed for order: ORD-xxx
💰 Refund processed for order: ORD-xxx
```

---

## 下一步

### 1. 基础设置（必需）
- ✅ 安装 Stripe SDK
- ✅ 注册 Stripe 账号
- ✅ 获取测试模式 API 密钥
- ✅ 更新 .env 文件
- ✅ 运行数据库迁移

### 2. 测试（推荐）
- 使用测试卡号完成一次支付
- 配置本地 Webhook 测试
- 测试退款流程

### 3. 生产部署（上线前）
- 获取生产模式 API 密钥
- 配置生产环境 Webhook
- 完成 Stripe 账号验证
- 测试真实支付（小额）

### 4. 可选增强
- 启用 Apple Pay / Google Pay
- 启用 Alipay / WeChat Pay
- 配置订阅支付
- 集成 Stripe Radar（欺诈检测）

---

## 🎉 完成！

支付集成已经准备就绪！

**立即测试**：
1. 安装 Stripe SDK：`npm install stripe @stripe/stripe-js`
2. 获取测试密钥并更新 `.env`
3. 运行迁移：`npx prisma migrate dev`
4. 重启服务器：`npm run dev`
5. 使用测试卡号 `4242 4242 4242 4242` 完成支付

需要帮助？查看 Stripe 文档：https://stripe.com/docs
