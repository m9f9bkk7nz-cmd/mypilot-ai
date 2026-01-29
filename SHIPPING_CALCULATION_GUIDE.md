# 🚚 配送费用计算指南

## 概述

本系统实现了基于目的地、重量和配送方式的动态配送费用计算功能。

---

## 功能特点

- ✅ 基于国家/地区的费率
- ✅ 基于重量范围的计算
- ✅ 多种配送方式（标准、快递等）
- ✅ 自动计算购物车总重量
- ✅ 管理员可配置费率
- ✅ 支持全球配送（WORLDWIDE 费率）

---

## 配送费率结构

### 数据库模型

```prisma
model ShippingRate {
  id            String  @id @default(cuid())
  name          String  // 配送方式名称
  description   String? // 描述
  country       String  // 国家代码或 "WORLDWIDE"
  minWeight     Decimal // 最小重量（kg）
  maxWeight     Decimal // 最大重量（kg）
  price         Decimal // 价格
  currency      String  // 货币
  estimatedDays Int     // 预计送达天数
  active        Boolean // 是否启用
}
```

### 示例费率

```typescript
{
  name: "Standard Shipping - US",
  description: "Standard shipping within United States (5-7 business days)",
  country: "US",
  minWeight: 0,
  maxWeight: 10,
  price: 9.99,
  currency: "USD",
  estimatedDays: 5,
  active: true
}
```

---

## API 端点

### 1. 计算配送费用

```
POST /api/shipping/calculate
```

**请求体**：

```json
{
  "country": "US",
  "weight": 2.5,
  "cartId": "cart_id_here",  // 可选，自动计算购物车重量
  "shippingMethod": "Standard Shipping - US"  // 可选，筛选特定方式
}
```

**响应**：

```json
{
  "shippingOptions": [
    {
      "id": "rate_id",
      "name": "Standard Shipping - US",
      "description": "Standard shipping within United States (5-7 business days)",
      "price": 9.99,
      "currency": "USD",
      "estimatedDays": 5
    },
    {
      "id": "rate_id_2",
      "name": "Express Shipping - US",
      "description": "Express shipping within United States (2-3 business days)",
      "price": 24.99,
      "currency": "USD",
      "estimatedDays": 2
    }
  ],
  "weight": 2.5,
  "country": "US"
}
```

### 2. 获取配送方式列表

```
GET /api/shipping/methods
```

**响应**：

```json
{
  "methods": [
    {
      "name": "Standard Shipping - US",
      "description": "Standard shipping within United States",
      "countries": ["US"]
    },
    {
      "name": "Express Shipping - US",
      "description": "Express shipping within United States",
      "countries": ["US"]
    }
  ]
}
```

### 3. 管理配送费率（管理员）

#### 获取所有费率

```
GET /api/admin/shipping-rates?country=US&active=true
```

#### 创建费率

```
POST /api/admin/shipping-rates
```

**请求体**：

```json
{
  "name": "Standard Shipping - CA",
  "description": "Standard shipping to Canada",
  "country": "CA",
  "minWeight": 0,
  "maxWeight": 10,
  "price": 12.99,
  "currency": "USD",
  "estimatedDays": 7,
  "active": true
}
```

#### 更新费率

```
PUT /api/admin/shipping-rates/[id]
```

#### 删除费率

```
DELETE /api/admin/shipping-rates/[id]
```

---

## 计算逻辑

### 1. 重量计算

系统会自动计算购物车中所有商品的总重量：

```typescript
总重量 = Σ (商品重量 × 数量)
```

### 2. 费率匹配

根据以下条件匹配费率：

1. **国家匹配**：
   - 优先匹配特定国家（如 "US"）
   - 如果没有，使用 "WORLDWIDE" 费率

2. **重量范围**：
   - `minWeight <= 总重量 <= maxWeight`

3. **配送方式**（可选）：
   - 如果指定了配送方式，只返回该方式

4. **状态**：
   - 只返回 `active: true` 的费率

### 3. 排序

返回的配送选项按价格从低到高排序。

---

## 使用示例

### 前端集成

```typescript
// 计算配送费用
async function calculateShipping(country: string, cartId: string) {
  const response = await fetch('/api/shipping/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, cartId }),
  });

  const data = await response.json();
  return data.shippingOptions;
}

// 使用
const options = await calculateShipping('US', 'cart_123');
console.log(options);
// [
//   { name: "Standard Shipping", price: 9.99, estimatedDays: 5 },
//   { name: "Express Shipping", price: 24.99, estimatedDays: 2 }
// ]
```

### 结账流程集成

```typescript
// 1. 用户选择配送地址
const shippingAddress = {
  country: 'US',
  // ... 其他地址信息
};

// 2. 计算可用的配送选项
const shippingOptions = await calculateShipping(
  shippingAddress.country,
  cartId
);

// 3. 用户选择配送方式
const selectedShipping = shippingOptions[0];

// 4. 计算订单总额
const orderTotal = cartSubtotal + selectedShipping.price + tax;

// 5. 创建订单
await createOrder({
  ...orderData,
  shippingCost: selectedShipping.price,
  shippingMethod: selectedShipping.name,
});
```

---

## 配送费率配置

### 预设费率

系统已包含以下预设费率：

| 国家/地区 | 配送方式 | 重量范围 | 价格 | 预计天数 |
|----------|---------|---------|------|---------|
| US | Standard | 0-10kg | $9.99 | 5-7天 |
| US | Express | 0-10kg | $24.99 | 2-3天 |
| CN | Standard | 0-10kg | $19.99 | 10-15天 |
| CN | Express | 0-10kg | $39.99 | 5-7天 |
| EU | Standard | 0-10kg | $14.99 | 7-10天 |
| JP | Standard | 0-10kg | $16.99 | 7-10天 |

### 添加新费率

#### 通过管理后台

1. 登录管理员账户
2. 进入 "配送管理" 页面
3. 点击 "添加费率"
4. 填写表单并保存

#### 通过 API

```bash
curl -X POST http://localhost:3000/api/admin/shipping-rates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Shipping - AU",
    "description": "Standard shipping to Australia",
    "country": "AU",
    "minWeight": 0,
    "maxWeight": 10,
    "price": 18.99,
    "currency": "USD",
    "estimatedDays": 10,
    "active": true
  }'
```

#### 通过数据库

```sql
INSERT INTO "ShippingRate" (
  id, name, description, country, 
  "minWeight", "maxWeight", price, currency, 
  "estimatedDays", active
) VALUES (
  'rate_id', 'Standard Shipping - AU', 'Standard shipping to Australia',
  'AU', 0, 10, 18.99, 'USD', 10, true
);
```

---

## 高级配置

### 1. 重量分段定价

为不同重量范围设置不同价格：

```typescript
// 0-5kg: $9.99
{
  name: "Standard Shipping - US",
  country: "US",
  minWeight: 0,
  maxWeight: 5,
  price: 9.99,
  // ...
}

// 5-10kg: $14.99
{
  name: "Standard Shipping - US",
  country: "US",
  minWeight: 5,
  maxWeight: 10,
  price: 14.99,
  // ...
}

// 10-20kg: $24.99
{
  name: "Standard Shipping - US",
  country: "US",
  minWeight: 10,
  maxWeight: 20,
  price: 24.99,
  // ...
}
```

### 2. 全球配送

设置默认的全球配送费率：

```typescript
{
  name: "Worldwide Standard",
  description: "Standard shipping worldwide",
  country: "WORLDWIDE",
  minWeight: 0,
  maxWeight: 999,
  price: 29.99,
  currency: "USD",
  estimatedDays: 15,
  active: true
}
```

### 3. 免费配送

设置满足条件的免费配送：

```typescript
// 方式 1：在前端判断
if (cartSubtotal >= 100) {
  shippingCost = 0;
}

// 方式 2：创建免费配送费率
{
  name: "Free Shipping - US",
  description: "Free shipping for orders over $100",
  country: "US",
  minWeight: 0,
  maxWeight: 999,
  price: 0,
  currency: "USD",
  estimatedDays: 7,
  active: true
}
```

---

## 测试

### 测试配送费用计算

```bash
# 测试美国配送
curl -X POST http://localhost:3000/api/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{"country": "US", "weight": 2.5}'

# 测试中国配送
curl -X POST http://localhost:3000/api/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{"country": "CN", "weight": 5.0}'

# 使用购物车 ID
curl -X POST http://localhost:3000/api/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{"country": "US", "cartId": "cart_123"}'
```

---

## 常见问题

### Q: 如何处理没有配送费率的国家？
A: 系统会自动使用 "WORLDWIDE" 费率。如果没有 WORLDWIDE 费率，返回 404 错误。

### Q: 如何设置不同货币的费率？
A: 在创建费率时指定 `currency` 字段。建议统一使用 USD，然后在前端根据用户选择的货币进行转换。

### Q: 如何禁用某个配送方式？
A: 将费率的 `active` 字段设置为 `false`。

### Q: 如何处理超重商品？
A: 
1. 设置更大的重量范围费率
2. 或者在前端提示用户联系客服

### Q: 配送费用何时计算？
A: 
1. 用户选择配送地址后
2. 结账页面加载时
3. 用户更改配送方式时

---

## 🎉 完成！

配送费用计算功能已经完全实现！

**功能清单**：
- ✅ 动态费用计算 API
- ✅ 自动购物车重量计算
- ✅ 多配送方式支持
- ✅ 管理员费率管理
- ✅ 国家/地区支持
- ✅ 重量分段定价

**下一步**：
1. 在结账页面集成配送费用计算
2. 添加管理后台的配送费率管理界面
3. 测试不同国家和重量的计算

需要帮助？查看 API 文档或联系开发团队。
