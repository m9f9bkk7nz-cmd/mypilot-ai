# 📦 物流追踪功能指南

## 概述

本系统实现了完整的订单物流追踪功能，包括追踪号生成、追踪查询和状态时间线。

---

## 功能特点

- ✅ 自动生成追踪号
- ✅ 支持自定义追踪号（第三方物流）
- ✅ 追踪号查询接口
- ✅ 订单状态时间线
- ✅ 支持多种物流商
- ✅ 自动发送追踪通知邮件

---

## 追踪号格式

### 内部追踪号

系统自动生成的追踪号格式：

```
TRACK-YYYYMMDD-XXXXX
```

示例：
- `TRACK-20260128-12345`
- `TRACK-20260128-98765`

组成部分：
- `TRACK-` - 前缀
- `YYYYMMDD` - 日期（年月日）
- `XXXXX` - 5位随机数字

### 第三方追踪号

支持使用第三方物流商的追踪号：
- UPS: `1Z999AA10123456784`
- FedEx: `123456789012`
- USPS: `9400 1000 0000 0000 0000 00`
- DHL: `1234567890`

---

## API 端点

### 1. 查询追踪信息（公开）

```
GET /api/tracking/[trackingNumber]
```

**示例**：
```bash
GET /api/tracking/TRACK-20260128-12345
```

**响应**：
```json
{
  "trackingNumber": "TRACK-20260128-12345",
  "trackingUrl": "http://localhost:3000/track/TRACK-20260128-12345",
  "orderNumber": "ORD-20260128-001",
  "status": "SHIPPED",
  "estimatedDelivery": null,
  "shippingAddress": {
    "city": "San Francisco",
    "state": "CA",
    "country": "US",
    "postalCode": "94102"
  },
  "items": [
    {
      "name": "HD Camera Module",
      "quantity": 1,
      "image": "/images/products/camera.jpg"
    }
  ],
  "timeline": [
    {
      "date": "2026-01-28T10:00:00Z",
      "status": "Order Placed",
      "description": "Your order has been placed successfully"
    },
    {
      "date": "2026-01-28T10:05:00Z",
      "status": "Payment Confirmed",
      "description": "Payment has been confirmed"
    },
    {
      "date": "2026-01-28T11:00:00Z",
      "status": "Processing",
      "description": "Your order is being prepared for shipment"
    },
    {
      "date": "2026-01-28T15:00:00Z",
      "status": "Shipped",
      "description": "Your order has been shipped (Tracking: TRACK-20260128-12345)"
    }
  ],
  "createdAt": "2026-01-28T10:00:00Z",
  "updatedAt": "2026-01-28T15:00:00Z"
}
```

### 2. 分配追踪号（管理员）

```
POST /api/admin/orders/[id]/tracking
```

**请求体**：

```json
{
  "carrier": "UPS",  // 可选：物流商
  "customTrackingNumber": "1Z999AA10123456784"  // 可选：自定义追踪号
}
```

**响应**：
```json
{
  "success": true,
  "trackingNumber": "1Z999AA10123456784",
  "trackingUrl": "https://www.ups.com/track?tracknum=1Z999AA10123456784"
}
```

### 3. 更新追踪信息（管理员）

```
PUT /api/admin/orders/[id]/tracking
```

**请求体**：
```json
{
  "trackingNumber": "1Z999AA10123456784",
  "trackingUrl": "https://www.ups.com/track?tracknum=1Z999AA10123456784",
  "carrier": "UPS"
}
```

---

## 使用流程

### 管理员发货流程

1. **订单支付成功**
   - 订单状态：`PENDING` → `PROCESSING`

2. **准备发货**
   - 打包商品
   - 选择物流商

3. **分配追踪号**
   
   **方式 1：自动生成**
   ```bash
   POST /api/admin/orders/order_id/tracking
   {
     "carrier": "UPS"
   }
   ```

   **方式 2：使用物流商追踪号**
   ```bash
   POST /api/admin/orders/order_id/tracking
   {
     "carrier": "UPS",
     "customTrackingNumber": "1Z999AA10123456784"
   }
   ```

4. **系统自动操作**
   - 更新订单状态为 `SHIPPED`
   - 生成追踪 URL
   - 发送追踪通知邮件给客户

### 客户追踪流程

1. **收到发货邮件**
   - 包含追踪号和追踪链接

2. **查询追踪信息**
   - 点击邮件中的追踪链接
   - 或访问 `/track/[trackingNumber]`
   - 或调用 API：`GET /api/tracking/[trackingNumber]`

3. **查看订单状态**
   - 订单时间线
   - 当前状态
   - 配送地址
   - 商品信息

---

## 支持的物流商

### 已集成

系统支持以下物流商的追踪 URL 生成：

| 物流商 | 代码 | 追踪 URL 格式 |
|--------|------|--------------|
| UPS | `UPS` | `https://www.ups.com/track?tracknum={number}` |
| FedEx | `FEDEX` | `https://www.fedex.com/fedextrack/?trknbr={number}` |
| USPS | `USPS` | `https://tools.usps.com/go/TrackConfirmAction?tLabels={number}` |
| DHL | `DHL` | `https://www.dhl.com/en/express/tracking.html?AWB={number}` |

### 添加新物流商

编辑 `lib/tracking.ts` 文件：

```typescript
const carrierUrls: Record<string, string> = {
  UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
  FEDEX: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
  // 添加新物流商
  SF_EXPRESS: `https://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/${trackingNumber}`,
};
```

---

## 追踪时间线

系统自动生成订单状态时间线：

### 状态事件

1. **Order Placed** - 订单创建
2. **Payment Confirmed** - 支付确认
3. **Processing** - 订单处理中
4. **Shipped** - 已发货
5. **Delivered** - 已送达
6. **Cancelled** - 已取消

### 时间线示例

```typescript
[
  {
    date: "2026-01-28T10:00:00Z",
    status: "Order Placed",
    description: "Your order has been placed successfully"
  },
  {
    date: "2026-01-28T10:05:00Z",
    status: "Payment Confirmed",
    description: "Payment has been confirmed"
  },
  {
    date: "2026-01-28T11:00:00Z",
    status: "Processing",
    description: "Your order is being prepared for shipment"
  },
  {
    date: "2026-01-28T15:00:00Z",
    status: "Shipped",
    description: "Your order has been shipped (Tracking: TRACK-20260128-12345)"
  }
]
```

---

## 前端集成

### 追踪页面

创建追踪页面 `app/track/[trackingNumber]/page.tsx`：

```typescript
export default async function TrackingPage({
  params,
}: {
  params: { trackingNumber: string };
}) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tracking/${params.trackingNumber}`
  );
  
  if (!response.ok) {
    return <div>Tracking information not found</div>;
  }

  const data = await response.json();

  return (
    <div>
      <h1>Order Tracking</h1>
      <p>Tracking Number: {data.trackingNumber}</p>
      <p>Order Number: {data.orderNumber}</p>
      <p>Status: {data.status}</p>
      
      <h2>Timeline</h2>
      <ul>
        {data.timeline.map((event, index) => (
          <li key={index}>
            <strong>{event.status}</strong>
            <p>{event.description}</p>
            <small>{new Date(event.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 订单详情页集成

在订单详情页显示追踪信息：

```typescript
{order.trackingNumber && (
  <div>
    <h3>Tracking Information</h3>
    <p>Tracking Number: {order.trackingNumber}</p>
    <a href={order.trackingUrl} target="_blank">
      Track Package
    </a>
  </div>
)}
```

---

## 邮件通知

### 发货通知邮件

当分配追踪号时，系统自动发送邮件：

**主题**：`Order Update - {orderNumber}`

**内容**：
```
Order Has Been Shipped

Hi {customerName},

Your order is on its way!

Order #{orderNumber}
Status: SHIPPED

Tracking Information
Tracking Number: {trackingNumber}

[Track Package Button]

View your order: {orderUrl}
```

---

## 测试

### 测试追踪号生成

```bash
# 为订单分配追踪号
curl -X POST http://localhost:3000/api/admin/orders/order_id/tracking \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{}'
```

### 测试追踪查询

```bash
# 查询追踪信息
curl http://localhost:3000/api/tracking/TRACK-20260128-12345
```

### 测试自定义追踪号

```bash
# 使用 UPS 追踪号
curl -X POST http://localhost:3000/api/admin/orders/order_id/tracking \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "carrier": "UPS",
    "customTrackingNumber": "1Z999AA10123456784"
  }'
```

---

## 常见问题

### Q: 追踪号何时生成？
A: 当管理员标记订单为"已发货"时，可以选择：
1. 自动生成内部追踪号
2. 输入第三方物流商的追踪号

### Q: 客户如何查询追踪信息？
A: 三种方式：
1. 点击发货邮件中的追踪链接
2. 在订单详情页点击追踪链接
3. 访问 `/track/[trackingNumber]` 页面

### Q: 追踪信息是否需要登录？
A: 不需要。追踪查询是公开的，任何人只要有追踪号就可以查询。

### Q: 如何更新追踪号？
A: 管理员可以通过 API 更新：
```bash
PUT /api/admin/orders/[id]/tracking
```

### Q: 支持实时物流更新吗？
A: 当前版本显示订单状态时间线。如需实时物流更新，需要集成第三方物流 API（如 AfterShip、EasyPost）。

---

## 高级功能（可选）

### 1. 集成第三方追踪服务

使用 AfterShip 或 EasyPost 获取实时物流更新：

```typescript
// 示例：AfterShip 集成
import Aftership from 'aftership';

const aftership = new Aftership(process.env.AFTERSHIP_API_KEY);

// 添加追踪
await aftership.tracking.create({
  tracking_number: trackingNumber,
  slug: 'ups', // 物流商代码
});

// 获取追踪信息
const tracking = await aftership.tracking.get(trackingNumber, 'ups');
```

### 2. Webhook 通知

接收物流商的状态更新：

```typescript
// app/api/webhooks/tracking/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // 更新订单状态
  await prisma.order.update({
    where: { trackingNumber: body.tracking_number },
    data: { status: body.status },
  });
  
  // 发送通知邮件
  // ...
}
```

### 3. 预计送达时间

根据配送方式计算预计送达：

```typescript
function calculateEstimatedDelivery(
  shippedDate: Date,
  estimatedDays: number
): Date {
  const delivery = new Date(shippedDate);
  delivery.setDate(delivery.getDate() + estimatedDays);
  return delivery;
}
```

---

## 🎉 完成！

物流追踪功能已经完全实现！

**功能清单**：
- ✅ 追踪号自动生成
- ✅ 追踪查询 API
- ✅ 订单状态时间线
- ✅ 多物流商支持
- ✅ 追踪 URL 生成
- ✅ 发货通知邮件

**下一步**：
1. 创建追踪页面前端
2. 在订单详情页显示追踪信息
3. 测试追踪功能
4. （可选）集成第三方追踪服务

需要帮助？查看 API 文档或联系开发团队。
