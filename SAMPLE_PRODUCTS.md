# 📦 示例产品数据

用于快速添加产品到你的商店

---

## 🚗 自动驾驶硬件产品

### 1. AI 处理单元

```json
{
  "name": "AI Processing Unit - NVIDIA Xavier",
  "slug": "ai-processing-unit-nvidia-xavier",
  "description": "High-performance AI chip designed specifically for autonomous driving. Features 30 TOPS of compute power and supports multiple neural networks simultaneously.",
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
    "memory": "32GB LPDDR4x",
    "power": "30W",
    "interface": "PCIe 4.0",
    "compute": "30 TOPS",
    "temperature": "-40°C to 85°C"
  },
  "weight": 0.5,
  "dimensions": {
    "length": 10,
    "width": 8,
    "height": 2
  }
}
```

### 2. 高清摄像头

```json
{
  "name": "4K Autonomous Driving Camera",
  "slug": "4k-autonomous-driving-camera",
  "description": "Professional-grade 4K camera with HDR support and advanced image processing. Perfect for object detection and lane recognition.",
  "price": 299.99,
  "currency": "USD",
  "stock": 100,
  "lowStockThreshold": 20,
  "categoryId": "sensors",
  "images": [
    "/images/products/camera-1.jpg",
    "/images/products/camera-2.jpg",
    "/images/products/camera-3.jpg"
  ],
  "specifications": {
    "resolution": "3840x2160",
    "fps": "60",
    "sensor": "Sony IMX586",
    "lens": "120° wide angle",
    "hdr": "Yes",
    "nightVision": "Yes",
    "interface": "USB 3.0"
  },
  "weight": 0.3,
  "dimensions": {
    "length": 8,
    "width": 6,
    "height": 4
  }
}
```

### 3. LiDAR 传感器

```json
{
  "name": "360° LiDAR Sensor",
  "slug": "360-lidar-sensor",
  "description": "High-precision 360-degree LiDAR sensor with 200m range. Essential for accurate 3D mapping and obstacle detection.",
  "price": 1299.99,
  "currency": "USD",
  "stock": 30,
  "lowStockThreshold": 5,
  "categoryId": "sensors",
  "images": [
    "/images/products/lidar-1.jpg",
    "/images/products/lidar-2.jpg"
  ],
  "specifications": {
    "range": "200m",
    "accuracy": "±2cm",
    "scanRate": "20Hz",
    "channels": "64",
    "fov": "360° horizontal, 40° vertical",
    "wavelength": "905nm",
    "interface": "Ethernet"
  },
  "weight": 1.2,
  "dimensions": {
    "length": 15,
    "width": 15,
    "height": 12
  }
}
```

### 4. 雷达传感器

```json
{
  "name": "77GHz Automotive Radar",
  "slug": "77ghz-automotive-radar",
  "description": "Advanced 77GHz radar sensor for all-weather detection. Works perfectly in rain, fog, and darkness.",
  "price": 399.99,
  "currency": "USD",
  "stock": 75,
  "lowStockThreshold": 15,
  "categoryId": "sensors",
  "images": [
    "/images/products/radar-1.jpg",
    "/images/products/radar-2.jpg"
  ],
  "specifications": {
    "frequency": "77GHz",
    "range": "250m",
    "accuracy": "±0.1m",
    "fov": "±60°",
    "targets": "Up to 64",
    "interface": "CAN FD",
    "power": "5W"
  },
  "weight": 0.4,
  "dimensions": {
    "length": 12,
    "width": 8,
    "height": 3
  }
}
```

### 5. GPS/IMU 模块

```json
{
  "name": "High-Precision GPS/IMU Module",
  "slug": "high-precision-gps-imu-module",
  "description": "RTK GPS with integrated IMU for centimeter-level positioning accuracy. Essential for autonomous navigation.",
  "price": 599.99,
  "currency": "USD",
  "stock": 60,
  "lowStockThreshold": 10,
  "categoryId": "navigation",
  "images": [
    "/images/products/gps-imu-1.jpg",
    "/images/products/gps-imu-2.jpg"
  ],
  "specifications": {
    "accuracy": "±2cm (RTK)",
    "updateRate": "100Hz",
    "channels": "GPS, GLONASS, BeiDou, Galileo",
    "imu": "9-axis",
    "interface": "UART, USB",
    "power": "3W"
  },
  "weight": 0.2,
  "dimensions": {
    "length": 8,
    "width": 6,
    "height": 2
  }
}
```

### 6. 车载计算平台

```json
{
  "name": "Autonomous Driving Computer",
  "slug": "autonomous-driving-computer",
  "description": "Complete computing platform for autonomous vehicles. Includes AI processor, storage, and all necessary interfaces.",
  "price": 2499.99,
  "currency": "USD",
  "stock": 20,
  "lowStockThreshold": 5,
  "categoryId": "hardware",
  "images": [
    "/images/products/computer-1.jpg",
    "/images/products/computer-2.jpg",
    "/images/products/computer-3.jpg"
  ],
  "specifications": {
    "processor": "NVIDIA Orin",
    "memory": "64GB",
    "storage": "1TB NVMe SSD",
    "compute": "254 TOPS",
    "interfaces": "16x Camera, 4x LiDAR, 8x Radar, CAN, Ethernet",
    "power": "60W",
    "os": "Linux Ubuntu 20.04"
  },
  "weight": 3.5,
  "dimensions": {
    "length": 30,
    "width": 25,
    "height": 10
  }
}
```

### 7. 超声波传感器套件

```json
{
  "name": "Ultrasonic Sensor Kit (12 Pack)",
  "slug": "ultrasonic-sensor-kit-12-pack",
  "description": "Complete set of 12 ultrasonic sensors for parking assistance and close-range detection.",
  "price": 149.99,
  "currency": "USD",
  "stock": 150,
  "lowStockThreshold": 30,
  "categoryId": "sensors",
  "images": [
    "/images/products/ultrasonic-1.jpg",
    "/images/products/ultrasonic-2.jpg"
  ],
  "specifications": {
    "range": "0.3m - 5m",
    "accuracy": "±1cm",
    "frequency": "40kHz",
    "beamAngle": "15°",
    "quantity": "12 sensors",
    "interface": "Analog/Digital",
    "power": "0.5W per sensor"
  },
  "weight": 0.6,
  "dimensions": {
    "length": 20,
    "width": 15,
    "height": 5
  }
}
```

### 8. 车载显示屏

```json
{
  "name": "12.3\" Automotive Display",
  "slug": "12-3-automotive-display",
  "description": "High-brightness automotive-grade display for dashboard integration. Supports touch input and multiple video sources.",
  "price": 399.99,
  "currency": "USD",
  "stock": 40,
  "lowStockThreshold": 10,
  "categoryId": "display",
  "images": [
    "/images/products/display-1.jpg",
    "/images/products/display-2.jpg"
  ],
  "specifications": {
    "size": "12.3 inches",
    "resolution": "1920x720",
    "brightness": "1000 nits",
    "touchscreen": "Yes (capacitive)",
    "interface": "HDMI, LVDS",
    "temperature": "-30°C to 85°C",
    "power": "15W"
  },
  "weight": 1.5,
  "dimensions": {
    "length": 30,
    "width": 12,
    "height": 2
  }
}
```

### 9. 电源管理模块

```json
{
  "name": "Automotive Power Management Unit",
  "slug": "automotive-power-management-unit",
  "description": "Intelligent power distribution and management for all autonomous driving components. Includes battery backup.",
  "price": 249.99,
  "currency": "USD",
  "stock": 80,
  "lowStockThreshold": 15,
  "categoryId": "power",
  "images": [
    "/images/products/power-1.jpg",
    "/images/products/power-2.jpg"
  ],
  "specifications": {
    "inputVoltage": "9-36V DC",
    "outputs": "12V, 5V, 3.3V",
    "maxPower": "300W",
    "efficiency": "95%",
    "protection": "Over-voltage, Over-current, Short-circuit",
    "backup": "30 minutes",
    "interface": "CAN"
  },
  "weight": 0.8,
  "dimensions": {
    "length": 15,
    "width": 10,
    "height": 5
  }
}
```

### 10. 开发套件

```json
{
  "name": "Autonomous Driving Development Kit",
  "slug": "autonomous-driving-development-kit",
  "description": "Complete starter kit for autonomous driving development. Includes camera, radar, GPS, and development board.",
  "price": 1999.99,
  "currency": "USD",
  "stock": 25,
  "lowStockThreshold": 5,
  "categoryId": "kits",
  "images": [
    "/images/products/devkit-1.jpg",
    "/images/products/devkit-2.jpg",
    "/images/products/devkit-3.jpg"
  ],
  "specifications": {
    "includes": "1x Camera, 1x Radar, 1x GPS/IMU, 1x Dev Board, Cables, Software",
    "processor": "NVIDIA Jetson AGX Xavier",
    "software": "ROS2, OpenCV, TensorFlow",
    "documentation": "Complete tutorials and examples",
    "support": "6 months technical support"
  },
  "weight": 5.0,
  "dimensions": {
    "length": 40,
    "width": 30,
    "height": 15
  }
}
```

---

## 📝 使用说明

### 方法 1：通过管理后台添加

1. 访问：http://localhost:3001/en/admin
2. 登录管理员账户
3. 点击 "Products" → "Add Product"
4. 复制上面的 JSON 数据
5. 填写表单（或使用 JSON 导入功能）
6. 保存

### 方法 2：通过 API 批量添加

创建脚本 `scripts/add-products.js`:

```javascript
const products = [
  // 复制上面的产品数据
];

async function addProducts() {
  for (const product of products) {
    const response = await fetch('http://localhost:3001/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
      },
      body: JSON.stringify(product)
    });
    
    if (response.ok) {
      console.log(`✅ Added: ${product.name}`);
    } else {
      console.error(`❌ Failed: ${product.name}`);
    }
  }
}

addProducts();
```

运行：
```bash
node scripts/add-products.js
```

### 方法 3：通过数据库种子

编辑 `prisma/seed.ts`，添加产品数据，然后运行：

```bash
npm run prisma:seed
```

---

## 🖼️ 产品图片

### 图片要求

- **尺寸**: 800x800px（推荐）
- **格式**: JPG, PNG, WebP
- **大小**: < 500KB
- **背景**: 白色或透明

### 图片来源

1. **自己拍摄** - 最佳选择
2. **免费图库**:
   - Unsplash: https://unsplash.com
   - Pexels: https://pexels.com
   - Pixabay: https://pixabay.com
3. **AI 生成**:
   - Midjourney
   - DALL-E
   - Stable Diffusion

### 图片存放位置

```
public/
  images/
    products/
      ai-chip-1.jpg
      ai-chip-2.jpg
      camera-1.jpg
      ...
```

---

## 🏷️ 分类建议

### 主要分类

1. **Hardware** (硬件)
   - AI 处理器
   - 计算平台
   - 电源模块

2. **Sensors** (传感器)
   - 摄像头
   - LiDAR
   - 雷达
   - 超声波

3. **Navigation** (导航)
   - GPS/IMU
   - 地图模块

4. **Display** (显示)
   - 车载屏幕
   - HUD

5. **Kits** (套件)
   - 开发套件
   - 完整解决方案

6. **Accessories** (配件)
   - 线缆
   - 支架
   - 工具

---

## 💡 定价策略

### 定价建议

| 产品类型 | 价格范围 | 利润率 |
|---------|---------|--------|
| 传感器 | $200-$500 | 30-40% |
| 处理器 | $400-$800 | 25-35% |
| 完整系统 | $2000-$5000 | 20-30% |
| 配件 | $50-$200 | 40-50% |
| 套件 | $1500-$3000 | 25-35% |

### 促销策略

- **新品折扣**: 首周 10% off
- **批量优惠**: 购买 3+ 件 15% off
- **套装优惠**: 套件比单买便宜 20%
- **会员折扣**: VIP 会员额外 5% off

---

## 📊 库存管理

### 库存建议

| 产品类型 | 初始库存 | 低库存警告 |
|---------|---------|-----------|
| 热门产品 | 100+ | 20 |
| 普通产品 | 50+ | 10 |
| 高价产品 | 20-30 | 5 |
| 定制产品 | 按需 | 0 |

### 补货策略

- 低库存自动提醒
- 热销产品优先补货
- 季节性产品提前备货
- 滞销产品减少库存

---

## 🎯 下一步

1. **选择产品** - 从上面选择要添加的产品
2. **准备图片** - 下载或创建产品图片
3. **添加产品** - 使用管理后台或 API 添加
4. **测试购买** - 完整测试购买流程
5. **开始销售** - 正式开始销售！

---

**准备好添加产品了吗？** 🚀

