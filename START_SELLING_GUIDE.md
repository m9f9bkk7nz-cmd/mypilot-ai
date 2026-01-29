# 🛍️ 开始销售指南

**准备时间**: 30-60 分钟  
**难度**: ⭐⭐ 简单

---

## 🎯 概述

你的电商网站已经完全准备好开始销售了！

**已具备的功能**:
- ✅ 完整的产品管理系统
- ✅ 购物车和结账流程
- ✅ Stripe 支付集成
- ✅ 订单管理系统
- ✅ 邮件通知
- ✅ 多语言支持（5种语言）
- ✅ 多货币支持（10种货币）
- ✅ 库存管理
- ✅ 物流追踪

---

## 📋 开始销售前的准备清单

### 1. 数据库准备 ✅
- [x] Neon 数据库已配置
- [x] 数据库迁移已完成
- [x] 种子数据已添加

### 2. 支付配置 ⚠️
- [ ] Stripe 账户已创建
- [ ] 获取 Stripe 生产密钥
- [ ] 配置 Stripe Webhook
- [ ] 测试支付流程

### 3. 邮件配置 ✅
- [x] Resend 账户已创建
- [x] API Key 已配置
- [x] 邮件模板已设置

### 4. 产品准备 ⏳
- [ ] 添加产品信息
- [ ] 上传产品图片
- [ ] 设置价格和库存
- [ ] 配置分类

### 5. 网站配置 ⏳
- [ ] 配置配送方式和费率
- [ ] 设置税率（如需要）
- [ ] 配置退货政策
- [ ] 添加法律页面

---

## 🚀 第一步：启动开发服务器

### 1. 确保数据库连接正常

```powershell
# 检查环境变量
cat .env

# 应该包含：
# DATABASE_URL=postgresql://neondb_owner:npg_...
# RESEND_API_KEY=re_...
```

### 2. 运行数据库迁移

```powershell
# 应用迁移
npm run prisma:migrate

# 或使用脚本
.\scripts\migrate.ps1
```

### 3. 添加种子数据（如果还没有）

```powershell
# 运行种子脚本
npm run prisma:seed
```

### 4. 启动开发服务器

```powershell
npm run dev
```

访问：http://localhost:3001

---

## 📦 第二步：添加产品

### 方法 1：使用管理后台（推荐）

1. **访问管理后台**
   ```
   http://localhost:3001/en/admin
   ```

2. **登录管理员账户**
   - 使用种子数据中的管理员账户
   - 或创建新的管理员账户

3. **添加分类**
   - 点击 "Categories"
   - 点击 "Add Category"
   - 填写分类信息：
     - 名称（英文）
     - 描述
     - 图片（可选）
   - 保存

4. **添加产品**
   - 点击 "Products"
   - 点击 "Add Product"
   - 填写产品信息：
     - **基本信息**:
       - 产品名称（英文）
       - SKU 代码
       - 描述
       - 分类
     - **价格和库存**:
       - 价格（USD）
       - 库存数量
       - 低库存警告阈值
     - **图片**:
       - 上传产品图片（建议 800x800px）
       - 可以上传多张图片
     - **规格**:
       - 尺寸、重量等
   - 保存

### 方法 2：使用 API

```javascript
// 添加产品
const response = await fetch('/api/admin/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    name: 'Autonomous Driving Camera',
    slug: 'autonomous-driving-camera',
    description: 'High-resolution camera for autonomous vehicles',
    price: 299.99,
    currency: 'USD',
    stock: 100,
    categoryId: 'category-id',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ],
    specifications: {
      resolution: '4K',
      fps: '60',
      sensor: 'Sony IMX'
    }
  })
});
```

### 产品示例数据

```json
{
  "name": "AI Processing Unit",
  "slug": "ai-processing-unit",
  "description": "High-performance AI chip for autonomous driving",
  "price": 499.99,
  "currency": "USD",
  "stock": 50,
  "lowStockThreshold": 10,
  "categoryId": "hardware",
  "images": [
    "/images/products/ai-chip-1.jpg",
    "/images/products/ai-chip-2.jpg"
  ],
  "specifications": {
    "processor": "NVIDIA Xavier",
    "memory": "32GB",
    "power": "30W",
    "interface": "PCIe 4.0"
  },
  "weight": 0.5,
  "dimensions": {
    "length": 10,
    "width": 8,
    "height": 2
  }
}
```

---

## 💳 第三步：配置 Stripe 支付

### 1. 创建 Stripe 账户

访问：https://dashboard.stripe.com/register

### 2. 获取 API 密钥

1. 登录 Stripe Dashboard
2. 切换到 **"Production"** 模式（右上角）
3. 访问：https://dashboard.stripe.com/apikeys
4. 复制以下密钥：
   - **Publishable key** (pk_live_...)
   - **Secret key** (sk_live_...) - 点击 "Reveal live key"

### 3. 配置环境变量

编辑 `.env`:

```bash
# Stripe 生产密钥
STRIPE_PUBLIC_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here
```

### 4. 配置 Webhook

1. 访问：https://dashboard.stripe.com/webhooks
2. 点击 "Add endpoint"
3. 填写信息：
   - **Endpoint URL**: `http://localhost:3001/api/webhooks/stripe`
   - **Description**: MyPilot Payment Webhook
4. 选择事件：
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. 点击 "Add endpoint"
6. 复制 **Signing secret** (whsec_...)
7. 添加到 `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### 5. 测试支付

使用 Stripe 测试卡：

| 卡号 | 结果 |
|------|------|
| 4242 4242 4242 4242 | 成功 |
| 4000 0000 0000 0002 | 失败 |
| 4000 0000 0000 9995 | 需要验证 |

**测试步骤**:
1. 添加产品到购物车
2. 进入结账页面
3. 填写配送地址
4. 使用测试卡号
5. 完成支付
6. 检查订单是否创建
7. 检查邮件是否发送

---

## 🚚 第四步：配置配送

### 1. 添加配送方式

访问管理后台 → Shipping Rates

**标准配送**:
```json
{
  "name": "Standard Shipping",
  "description": "5-7 business days",
  "baseRate": 9.99,
  "perKgRate": 2.00,
  "estimatedDays": 7,
  "regions": ["US", "CA"]
}
```

**快速配送**:
```json
{
  "name": "Express Shipping",
  "description": "2-3 business days",
  "baseRate": 19.99,
  "perKgRate": 3.00,
  "estimatedDays": 3,
  "regions": ["US", "CA"]
}
```

**免费配送**:
```json
{
  "name": "Free Shipping",
  "description": "Orders over $100",
  "baseRate": 0,
  "perKgRate": 0,
  "estimatedDays": 10,
  "minOrderAmount": 100,
  "regions": ["US"]
}
```

### 2. 使用 API 添加

```javascript
const response = await fetch('/api/admin/shipping-rates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    name: 'Standard Shipping',
    description: '5-7 business days',
    baseRate: 9.99,
    perKgRate: 2.00,
    estimatedDays: 7,
    regions: ['US', 'CA']
  })
});
```

---

## 📧 第五步：测试邮件通知

### 1. 确认 Resend 配置

```bash
# .env
RESEND_API_KEY=re_aPvYQqZn_FhUVdxWTU5bBqhzrq2WP37j1
EMAIL_FROM=MyPilot <noreply@yourdomain.com>
```

### 2. 测试邮件类型

**订单确认邮件**:
- 用户下单后自动发送
- 包含订单详情、总价、配送地址

**订单状态更新**:
- 订单状态变更时发送
- 包含追踪号（如有）

**密码重置**:
- 用户请求重置密码时发送
- 包含重置链接

### 3. 测试步骤

1. 完成一次完整的购买流程
2. 检查邮箱是否收到订单确认邮件
3. 在管理后台更新订单状态
4. 检查是否收到状态更新邮件

---

## 🌍 第六步：测试多语言和多货币

### 1. 测试语言切换

1. 访问网站首页
2. 点击 Header 中的语言切换器
3. 选择不同语言：
   - English (en)
   - 简体中文 (zh-CN)
   - 繁體中文 (zh-TW)
   - 日本語 (ja)
   - 한국어 (ko)
4. 验证页面内容是否正确翻译

### 2. 测试货币转换

1. 点击 Header 中的货币切换器
2. 选择不同货币：
   - USD ($)
   - CNY (¥)
   - EUR (€)
   - GBP (£)
   - JPY (¥)
   - KRW (₩)
   - HKD (HK$)
   - TWD (NT$)
   - AUD (A$)
   - CAD (C$)
3. 验证价格是否自动转换
4. 验证格式是否正确

### 3. 测试完整购买流程

**不同语言和货币组合**:
- 英文 + USD
- 中文 + CNY
- 日文 + JPY
- 韩文 + KRW

---

## 🧪 第七步：完整测试流程

### 测试清单

#### 1. 浏览产品 ✓
- [ ] 访问首页
- [ ] 浏览产品列表
- [ ] 查看产品详情
- [ ] 切换语言
- [ ] 切换货币
- [ ] 搜索产品
- [ ] 筛选产品

#### 2. 用户注册/登录 ✓
- [ ] 注册新账户
- [ ] 验证邮箱（如启用）
- [ ] 登录账户
- [ ] 测试密码重置

#### 3. 购物车 ✓
- [ ] 添加产品到购物车
- [ ] 更新数量
- [ ] 删除产品
- [ ] 查看购物车总价
- [ ] 验证货币转换

#### 4. 结账流程 ✓
- [ ] 填写配送地址
- [ ] 选择配送方式
- [ ] 查看配送费用
- [ ] 填写支付信息
- [ ] 完成支付

#### 5. 订单管理 ✓
- [ ] 查看订单列表
- [ ] 查看订单详情
- [ ] 追踪物流
- [ ] 取消订单（如允许）

#### 6. 管理后台 ✓
- [ ] 查看仪表板
- [ ] 管理产品
- [ ] 管理订单
- [ ] 更新订单状态
- [ ] 查看销售报表
- [ ] 管理库存

---

## 📊 第八步：监控和分析

### 1. 健康检查

访问：http://localhost:3001/api/health

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

### 2. 查看日志

**开发环境**:
- 查看终端输出
- 检查浏览器控制台

**生产环境**:
- Vercel Dashboard → Logs
- 查看错误日志
- 监控性能指标

### 3. 监控指标

**关键指标**:
- 订单数量
- 转化率
- 平均订单价值
- 库存水平
- 支付成功率
- 页面加载时间

---

## 🎯 第九步：优化和改进

### 1. 性能优化

- [ ] 优化图片大小
- [ ] 启用 CDN
- [ ] 配置 Redis 缓存
- [ ] 监控 Web Vitals

### 2. SEO 优化

- [ ] 提交 Sitemap 到 Google
- [ ] 配置 Google Analytics
- [ ] 优化产品描述
- [ ] 添加结构化数据

### 3. 用户体验

- [ ] 收集用户反馈
- [ ] A/B 测试
- [ ] 优化结账流程
- [ ] 改进搜索功能

### 4. 营销准备

- [ ] 配置社交媒体分享
- [ ] 准备营销素材
- [ ] 设置邮件营销
- [ ] 准备促销活动

---

## 🚨 常见问题

### Q: 支付失败怎么办？

**A**: 检查以下几点：
1. Stripe 密钥是否正确
2. Webhook 是否配置
3. 网络连接是否正常
4. 查看 Stripe Dashboard 日志

### Q: 邮件没有发送？

**A**: 检查：
1. RESEND_API_KEY 是否正确
2. EMAIL_FROM 格式是否正确
3. 查看 Resend Dashboard 日志
4. 检查垃圾邮件文件夹

### Q: 库存不同步？

**A**: 
1. 检查数据库连接
2. 查看库存日志
3. 手动同步库存
4. 检查并发控制是否正常

### Q: 价格转换不正确？

**A**:
1. 检查汇率 API 是否正常
2. 清除汇率缓存
3. 验证货币代码
4. 查看浏览器控制台错误

---

## 📝 上线前最终检查

### 必需项 ✓

- [ ] 所有产品已添加
- [ ] 产品图片已上传
- [ ] 价格和库存已设置
- [ ] Stripe 生产密钥已配置
- [ ] Webhook 已配置并测试
- [ ] 邮件发送正常
- [ ] 配送方式已配置
- [ ] 完整购买流程测试通过
- [ ] 多语言测试通过
- [ ] 多货币测试通过

### 推荐项 ✓

- [ ] 法律页面已添加（隐私政策、服务条款）
- [ ] 退货政策已设置
- [ ] 客服联系方式已添加
- [ ] FAQ 页面已创建
- [ ] 社交媒体链接已添加
- [ ] Google Analytics 已配置
- [ ] 性能测试通过

---

## 🎉 开始销售！

### 准备就绪的功能

✅ **产品管理** - 添加、编辑、删除产品  
✅ **购物车** - 完整的购物车功能  
✅ **结账** - 安全的结账流程  
✅ **支付** - Stripe 支付集成  
✅ **订单** - 完整的订单管理  
✅ **邮件** - 自动邮件通知  
✅ **多语言** - 5种语言支持  
✅ **多货币** - 10种货币支持  
✅ **库存** - 实时库存管理  
✅ **物流** - 物流追踪系统  
✅ **管理** - 完整的管理后台  

### 下一步

1. **添加产品** - 开始添加你的产品
2. **测试流程** - 完整测试购买流程
3. **配置支付** - 设置 Stripe 生产环境
4. **准备上线** - 部署到 Vercel

---

## 📞 需要帮助？

### 文档
- `QUICK_START.md` - 快速开始
- `PAYMENT_INTEGRATION_GUIDE.md` - 支付集成
- `SHIPPING_CALCULATION_GUIDE.md` - 配送计算
- `CURRENCY_SYSTEM_GUIDE.md` - 货币系统
- `EMAIL_SERVICE_SETUP.md` - 邮件服务

### 在线资源
- Stripe 文档: https://stripe.com/docs
- Resend 文档: https://resend.com/docs
- Next.js 文档: https://nextjs.org/docs

---

**准备好开始销售了吗？** 🚀💰

**第一步**: 添加你的第一个产品！

