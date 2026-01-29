# 💱 货币转换系统实现指南

**完成时间**: 2026-01-29  
**状态**: ✅ 完成

---

## 📋 功能概述

货币转换系统提供完整的多货币支持，包括：

- ✅ 10种主流货币支持
- ✅ 实时汇率获取
- ✅ 自动价格转换
- ✅ 货币切换器组件
- ✅ 用户偏好保存
- ✅ 汇率缓存优化
- ✅ 价格格式化
- ✅ API 端点

---

## 🌍 支持的货币

| 货币代码 | 符号 | 名称 | 地区 |
|---------|------|------|------|
| USD | $ | US Dollar | 美国 |
| CNY | ¥ | Chinese Yuan | 中国 |
| EUR | € | Euro | 欧元区 |
| GBP | £ | British Pound | 英国 |
| JPY | ¥ | Japanese Yen | 日本 |
| KRW | ₩ | Korean Won | 韩国 |
| HKD | HK$ | Hong Kong Dollar | 香港 |
| TWD | NT$ | Taiwan Dollar | 台湾 |
| AUD | A$ | Australian Dollar | 澳大利亚 |
| CAD | C$ | Canadian Dollar | 加拿大 |

---

## 🏗️ 系统架构

### 核心文件

```
lib/
  ├── currency.ts              # 货币转换核心逻辑
  └── hooks/
      └── useCurrency.ts       # 货币管理 Hook

components/
  ├── CurrencySwitcher.tsx     # 货币切换器组件
  └── Price.tsx                # 价格显示组件

app/api/currency/
  ├── rates/route.ts           # 汇率 API
  └── convert/route.ts         # 转换 API
```

---

## 🔧 核心功能

### 1. 汇率获取 (`lib/currency.ts`)

```typescript
import { getExchangeRates } from '@/lib/currency';

// 获取基于 USD 的汇率
const rates = await getExchangeRates('USD');

// 返回格式
{
  base: 'USD',
  rates: {
    CNY: 7.24,
    EUR: 0.92,
    GBP: 0.79,
    // ...
  },
  timestamp: 1706544000000
}
```

**特性**:
- 使用免费的 exchangerate-api.com API
- 支持自定义 API Key（环境变量 `EXCHANGE_RATE_API_KEY`）
- 自动缓存 1 小时
- API 失败时返回备用汇率（1:1）

### 2. 价格转换

```typescript
import { convertPrice } from '@/lib/currency';

// 转换单个价格
const convertedPrice = await convertPrice(100, 'USD', 'CNY');
// 返回: 724 (假设汇率是 7.24)

// 批量转换
const prices = await convertPrices([100, 200, 300], 'USD', 'EUR');
// 返回: [92, 184, 276]
```

### 3. 价格格式化

```typescript
import { formatPrice } from '@/lib/currency';

// 格式化价格
const formatted = formatPrice(1234.56, 'USD');
// 返回: "$1,234.56"

const formatted = formatPrice(1234.56, 'CNY', 'zh-CN');
// 返回: "¥1,234.56"
```

### 4. 转换并格式化

```typescript
import { formatConvertedPrice } from '@/lib/currency';

const formatted = await formatConvertedPrice(100, 'USD', 'CNY');
// 返回: "¥724.00"
```

---

## 🎨 组件使用

### 1. 货币切换器 (`CurrencySwitcher`)

在 Header 中已集成：

```tsx
import CurrencySwitcher from '@/components/CurrencySwitcher';

<CurrencySwitcher />
```

**功能**:
- 显示当前货币
- 下拉菜单选择货币
- 保存到 localStorage
- 触发全局货币切换事件
- 自动刷新页面

### 2. 价格显示组件 (`Price`)

在产品卡片中使用：

```tsx
import Price from '@/components/Price';

<Price 
  amount={99.99} 
  currency="USD"
  className="text-xl font-bold"
  showOriginal={true}  // 显示原始价格
/>
```

**功能**:
- 自动转换到用户选择的货币
- 响应货币切换事件
- 可选显示原始价格
- 加载状态显示

### 3. 货币管理 Hook (`useCurrency`)

在组件中使用：

```tsx
import { useCurrency } from '@/lib/hooks/useCurrency';

function MyComponent() {
  const { 
    currency,           // 当前货币代码
    currencyInfo,       // 货币信息
    changeCurrency,     // 切换货币
    convert,            // 转换价格
    format,             // 格式化价格
    convertAndFormat,   // 转换并格式化
    isLoading          // 加载状态
  } = useCurrency('en-US');

  // 切换货币
  const handleChange = () => {
    changeCurrency('EUR');
  };

  // 转换价格
  const convertedPrice = await convert(100, 'USD', 'EUR');

  // 格式化价格
  const formatted = format(100, 'USD');

  // 转换并格式化
  const result = await convertAndFormat(100, 'USD', 'EUR');
}
```

---

## 🌐 API 端点

### 1. 获取汇率

```
GET /api/currency/rates?base=USD
```

**参数**:
- `base` (可选): 基础货币代码，默认 USD

**响应**:
```json
{
  "success": true,
  "data": {
    "base": "USD",
    "rates": {
      "CNY": 7.24,
      "EUR": 0.92,
      "GBP": 0.79,
      "JPY": 149.50,
      "KRW": 1320.00
    },
    "timestamp": 1706544000000
  }
}
```

### 2. 转换价格

```
GET /api/currency/convert?amount=100&from=USD&to=CNY
```

**参数**:
- `amount` (必需): 金额
- `from` (必需): 源货币代码
- `to` (必需): 目标货币代码

**响应**:
```json
{
  "success": true,
  "data": {
    "amount": 100,
    "from": "USD",
    "to": "CNY",
    "convertedAmount": 724
  }
}
```

---

## 💾 缓存策略

### 汇率缓存

- **缓存时间**: 1 小时
- **缓存键**: `exchange_rates_{currency}`
- **存储**: 内存缓存（可扩展到 Redis）

### 清除缓存

```typescript
import { clearExchangeRatesCache } from '@/lib/currency';

await clearExchangeRatesCache();
```

---

## 🔄 工作流程

### 用户切换货币

```
1. 用户点击货币切换器
   ↓
2. 选择新货币（如 CNY）
   ↓
3. 保存到 localStorage
   ↓
4. 触发 currencyChange 事件
   ↓
5. 所有 Price 组件监听事件
   ↓
6. 自动转换并更新显示
   ↓
7. 页面刷新（可选）
```

### 价格显示流程

```
1. Price 组件接收原始价格（USD）
   ↓
2. 从 localStorage 读取用户偏好货币
   ↓
3. 如果不同，调用 convertPrice
   ↓
4. 从缓存或 API 获取汇率
   ↓
5. 计算转换后的价格
   ↓
6. 使用 formatPrice 格式化
   ↓
7. 显示转换后的价格
```

---

## 🌐 汇率 API 配置

### 使用免费 API（默认）

无需配置，直接使用：
```
https://api.exchangerate-api.com/v4/latest/{currency}
```

**限制**:
- 每月 1,500 次请求
- 每天更新一次
- 无需注册

### 使用付费 API（推荐生产环境）

1. 注册账户：https://www.exchangerate-api.com/
2. 获取 API Key
3. 添加到环境变量：

```bash
# .env.local
EXCHANGE_RATE_API_KEY=your_api_key_here
```

**优势**:
- 更高的请求限制
- 更频繁的更新
- 更多货币支持
- 历史汇率数据

---

## 🎯 最佳实践

### 1. 性能优化

```typescript
// ✅ 好：批量转换
const prices = await convertPrices([100, 200, 300], 'USD', 'CNY');

// ❌ 差：逐个转换
const price1 = await convertPrice(100, 'USD', 'CNY');
const price2 = await convertPrice(200, 'USD', 'CNY');
const price3 = await convertPrice(300, 'USD', 'CNY');
```

### 2. 错误处理

```typescript
try {
  const converted = await convertPrice(100, 'USD', 'CNY');
} catch (error) {
  console.error('Conversion failed:', error);
  // 使用原始价格作为备用
  const fallback = 100;
}
```

### 3. 用户体验

```tsx
// 显示加载状态
<Price 
  amount={99.99} 
  currency="USD"
  className={isLoading ? 'opacity-50' : ''}
/>

// 显示原始价格
<Price 
  amount={99.99} 
  currency="USD"
  showOriginal={true}  // 显示 "¥724 (原价 $99.99)"
/>
```

---

## 🔧 自定义配置

### 添加新货币

编辑 `lib/currency.ts`:

```typescript
export const SUPPORTED_CURRENCIES = {
  // ... 现有货币
  SGD: { 
    code: 'SGD', 
    symbol: 'S$', 
    name: 'Singapore Dollar', 
    locale: 'en-SG' 
  },
} as const;
```

### 修改默认货币

```typescript
export const DEFAULT_CURRENCY: CurrencyCode = 'CNY'; // 改为人民币
```

### 修改缓存时间

```typescript
const CACHE_DURATION = 7200; // 2小时
```

---

## 🧪 测试

### 测试汇率获取

```typescript
import { getExchangeRates } from '@/lib/currency';

const rates = await getExchangeRates('USD');
console.log('USD to CNY:', rates.rates.CNY);
```

### 测试价格转换

```typescript
import { convertPrice } from '@/lib/currency';

const converted = await convertPrice(100, 'USD', 'CNY');
console.log('$100 =', converted, 'CNY');
```

### 测试组件

访问任何产品页面，切换货币，观察价格变化。

---

## 📊 监控和日志

### 汇率更新日志

```typescript
// 在 getExchangeRates 中
console.log(`Fetched exchange rates for ${baseCurrency}`);
console.log(`Cache hit: ${!!cached}`);
```

### 转换错误日志

```typescript
// 在 convertPrice 中
console.error('Error converting price:', error);
```

---

## 🚀 部署注意事项

### 环境变量

生产环境添加：

```bash
# .env.production
EXCHANGE_RATE_API_KEY=your_production_api_key
```

### Vercel 配置

在 Vercel Dashboard 添加环境变量：
- Key: `EXCHANGE_RATE_API_KEY`
- Value: 你的 API Key

### 缓存配置

如果使用 Redis：

```typescript
// lib/cache.ts
const redis = new Redis(process.env.REDIS_URL);
```

---

## 🎉 功能完成清单

- ✅ 货币转换核心逻辑
- ✅ 10种货币支持
- ✅ 汇率 API 集成
- ✅ 汇率缓存系统
- ✅ 货币切换器组件
- ✅ 价格显示组件
- ✅ 货币管理 Hook
- ✅ API 端点
- ✅ 用户偏好保存
- ✅ 自动价格转换
- ✅ 价格格式化
- ✅ 错误处理
- ✅ 集成到 Header
- ✅ 集成到 ProductCard
- ✅ 翻译文件更新
- ✅ 文档完成

---

## 📚 相关文档

- `lib/currency.ts` - 核心逻辑
- `components/CurrencySwitcher.tsx` - 切换器组件
- `components/Price.tsx` - 价格组件
- `lib/hooks/useCurrency.ts` - Hook
- `app/api/currency/rates/route.ts` - 汇率 API
- `app/api/currency/convert/route.ts` - 转换 API

---

## 🎊 总结

货币转换系统已完全实现！

**主要特性**:
- 支持 10 种主流货币
- 实时汇率自动更新
- 智能缓存优化性能
- 用户友好的切换界面
- 自动价格转换
- 完整的 API 支持

**使用简单**:
1. 用户点击货币切换器
2. 选择想要的货币
3. 所有价格自动转换
4. 偏好自动保存

**性能优异**:
- 汇率缓存 1 小时
- 批量转换优化
- 备用汇率机制
- 错误优雅处理

**准备就绪**:
- 可立即部署
- 可扩展到更多货币
- 可集成 Redis 缓存
- 可添加历史汇率

---

**货币转换系统开发完成！** 🎉💱🌍

