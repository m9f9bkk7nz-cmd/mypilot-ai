import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ========================================
  // 1. 创建用户
  // ========================================
  console.log('👤 Creating users...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mypilot.com' },
    update: {},
    create: {
      email: 'admin@mypilot.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('  ✅ Admin:', admin.email);

  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });
  console.log('  ✅ Customer:', customer.email);

  // ========================================
  // 2. 创建地址
  // ========================================
  console.log('\n📍 Creating addresses...');
  
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      name: 'John Doe',
      phone: '+1-555-0123',
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
      isDefault: true,
    },
  });
  console.log('  ✅ Created default address for customer');

  // ========================================
  // 3. 创建分类
  // ========================================
  console.log('\n📁 Creating categories...');
  
  const hardwareCategory = await prisma.category.upsert({
    where: { slug: 'hardware' },
    update: {},
    create: {
      slug: 'hardware',
      name: 'Hardware',
      description: 'Autonomous driving hardware components',
      order: 1,
    },
  });

  const devicesCategory = await prisma.category.upsert({
    where: { slug: 'devices' },
    update: {},
    create: {
      slug: 'devices',
      name: 'Devices',
      description: 'Complete autonomous driving devices',
      parentId: hardwareCategory.id,
      order: 1,
    },
  });

  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      slug: 'accessories',
      name: 'Accessories',
      description: 'Accessories and add-ons for MyPilot devices',
      parentId: hardwareCategory.id,
      order: 2,
    },
  });

  console.log('  ✅ Created 3 categories');

  // ========================================
  // 4. 创建产品 - 主打产品 MyPilot 设备
  // ========================================
  console.log('\n📦 Creating products...');
  
  // 主图片数组 - 使用你提供的真实产品图片
  const mainProductImages = [
    '/images/products/主图 (1).jpg',
    '/images/products/主图 (2).jpg',
    '/images/products/主图 (3).jpg',
    '/images/products/主图 (4).jpg',
    '/images/products/主图 (5).jpg',
    '/images/products/主图 (6).jpg',
    '/images/products/主图 (7).jpg',
    '/images/products/主图 (8).jpg',
    '/images/products/主图 (9).jpg',
    '/images/products/主图10-白底.jpg',
  ];

  const products = [
    // 主打产品 - MyPilot 自动驾驶设备
    {
      slug: 'mypilot-pro',
      sku: 'MP-PRO-001',
      name: 'MyPilot Pro - Autonomous Driving Device',
      description: `MyPilot Pro is a professional-grade autonomous driving device designed for seamless integration with your vehicle. 

Features:
• Advanced AI-powered driving assistance
• High-definition camera system with multiple angles
• Real-time road analysis and obstacle detection
• Easy plug-and-play installation
• Compatible with most vehicle models
• Over-the-air software updates
• 24/7 customer support

The MyPilot Pro transforms your regular vehicle into a smart, semi-autonomous driving machine. Experience the future of driving today.`,
      price: 999.99,
      comparePrice: 1299.99,
      costPrice: 600.00,
      inventory: 100,
      lowStockThreshold: 10,
      weight: 1.5,
      images: mainProductImages,
      published: true,
      featured: true,
      categoryId: devicesCategory.id,
    },
    // MyPilot 标准版
    {
      slug: 'mypilot-standard',
      sku: 'MP-STD-001',
      name: 'MyPilot Standard - Entry Level Device',
      description: `MyPilot Standard is the perfect entry point into autonomous driving technology.

Features:
• AI-assisted lane keeping
• Forward collision warning
• Adaptive cruise control support
• Simple installation process
• Compatible with 500+ vehicle models
• Regular software updates

Ideal for drivers who want to experience autonomous driving features without the premium price tag.`,
      price: 599.99,
      comparePrice: 799.99,
      costPrice: 350.00,
      inventory: 150,
      lowStockThreshold: 15,
      weight: 1.2,
      images: [
        '/images/products/主图 (3).jpg',
        '/images/products/主图 (4).jpg',
        '/images/products/主图 (5).jpg',
      ],
      published: true,
      featured: true,
      categoryId: devicesCategory.id,
    },
    // MyPilot 配件 - 安装套件
    {
      slug: 'mypilot-mount-kit',
      sku: 'MP-MNT-001',
      name: 'MyPilot Universal Mount Kit',
      description: `Universal mounting kit for MyPilot devices.

Includes:
• Adjustable dashboard mount
• Windshield suction mount
• Cable management clips
• Installation tools
• Detailed installation guide

Compatible with all MyPilot device models.`,
      price: 49.99,
      comparePrice: 69.99,
      costPrice: 25.00,
      inventory: 200,
      lowStockThreshold: 30,
      weight: 0.5,
      images: [
        '/images/products/主图 (6).jpg',
        '/images/products/主图 (7).jpg',
      ],
      published: true,
      featured: false,
      categoryId: accessoriesCategory.id,
    },
    // MyPilot 配件 - 电源线
    {
      slug: 'mypilot-power-cable',
      sku: 'MP-PWR-001',
      name: 'MyPilot Power Cable - 3m',
      description: `High-quality 3-meter power cable for MyPilot devices.

Features:
• Premium copper wiring
• Durable braided exterior
• Universal car adapter included
• Surge protection built-in

Perfect for clean, hidden cable routing in your vehicle.`,
      price: 29.99,
      costPrice: 12.00,
      inventory: 300,
      lowStockThreshold: 50,
      weight: 0.2,
      images: [
        '/images/products/主图 (8).jpg',
      ],
      published: true,
      featured: false,
      categoryId: accessoriesCategory.id,
    },
    // MyPilot 配件 - 保护套
    {
      slug: 'mypilot-protective-case',
      sku: 'MP-CASE-001',
      name: 'MyPilot Protective Case',
      description: `Premium protective case for your MyPilot device.

Features:
• Shock-absorbing design
• Heat-resistant material
• Easy access to all ports
• Sleek, professional look

Keep your MyPilot device safe and looking great.`,
      price: 39.99,
      comparePrice: 49.99,
      costPrice: 18.00,
      inventory: 250,
      lowStockThreshold: 40,
      weight: 0.3,
      images: [
        '/images/products/主图 (9).jpg',
        '/images/products/主图10-白底.jpg',
      ],
      published: true,
      featured: false,
      categoryId: accessoriesCategory.id,
    },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData,
    });
    createdProducts.push(product);
    console.log(`  ✅ ${product.name} - $${product.price}`);
  }

  // ========================================
  // 5. 创建产品翻译（中文）
  // ========================================
  console.log('\n🌐 Creating product translations...');
  
  const translations = [
    {
      productId: createdProducts[0].id,
      locale: 'zh-CN',
      name: 'MyPilot Pro - 专业版自动驾驶设备',
      description: `MyPilot Pro 是一款专业级自动驾驶设备，专为与您的车辆无缝集成而设计。

功能特点：
• 先进的AI驱动驾驶辅助
• 多角度高清摄像系统
• 实时道路分析和障碍物检测
• 即插即用，安装简便
• 兼容大多数车型
• 支持OTA空中升级
• 7x24小时客户支持

MyPilot Pro 将您的普通车辆转变为智能半自动驾驶机器。立即体验驾驶的未来。`,
    },
    {
      productId: createdProducts[1].id,
      locale: 'zh-CN',
      name: 'MyPilot 标准版 - 入门级设备',
      description: `MyPilot 标准版是进入自动驾驶技术的完美起点。

功能特点：
• AI辅助车道保持
• 前向碰撞预警
• 自适应巡航控制支持
• 安装过程简单
• 兼容500+车型
• 定期软件更新

适合想要体验自动驾驶功能但预算有限的驾驶者。`,
    },
    {
      productId: createdProducts[2].id,
      locale: 'zh-CN',
      name: 'MyPilot 通用安装套件',
      description: `MyPilot设备通用安装套件。

包含：
• 可调节仪表盘支架
• 挡风玻璃吸盘支架
• 线缆管理夹
• 安装工具
• 详细安装指南

兼容所有MyPilot设备型号。`,
    },
    {
      productId: createdProducts[3].id,
      locale: 'zh-CN',
      name: 'MyPilot 电源线 - 3米',
      description: `MyPilot设备专用高品质3米电源线。

特点：
• 优质铜芯线材
• 耐用编织外层
• 附带通用车载适配器
• 内置浪涌保护

完美适合车内隐藏式布线。`,
    },
    {
      productId: createdProducts[4].id,
      locale: 'zh-CN',
      name: 'MyPilot 保护套',
      description: `MyPilot设备专用高级保护套。

特点：
• 减震设计
• 耐热材料
• 所有端口便捷访问
• 时尚专业外观

保护您的MyPilot设备安全美观。`,
    },
  ];

  // 繁体中文翻译
  const zhTWTranslations = [
    {
      productId: createdProducts[0].id,
      locale: 'zh-TW',
      name: 'MyPilot Pro - 專業版自動駕駛設備',
      description: `MyPilot Pro 是一款專業級自動駕駛設備，專為與您的車輛無縫整合而設計。

功能特點：
• 先進的AI驅動駕駛輔助
• 多角度高清攝像系統
• 即時道路分析和障礙物檢測
• 即插即用，安裝簡便
• 相容大多數車型
• 支援OTA空中升級
• 7x24小時客戶支援

MyPilot Pro 將您的普通車輛轉變為智慧半自動駕駛機器。立即體驗駕駛的未來。`,
    },
    {
      productId: createdProducts[1].id,
      locale: 'zh-TW',
      name: 'MyPilot 標準版 - 入門級設備',
      description: `MyPilot 標準版是進入自動駕駛技術的完美起點。

功能特點：
• AI輔助車道保持
• 前向碰撞預警
• 自適應巡航控制支援
• 安裝過程簡單
• 相容500+車型
• 定期軟體更新

適合想要體驗自動駕駛功能但預算有限的駕駛者。`,
    },
  ];

  for (const trans of [...translations, ...zhTWTranslations]) {
    await prisma.productTranslation.upsert({
      where: {
        productId_locale: {
          productId: trans.productId,
          locale: trans.locale,
        },
      },
      update: trans,
      create: trans,
    });
  }
  console.log('  ✅ Created translations for all products (zh-CN, zh-TW)');

  // ========================================
  // 6. 创建配送费率
  // ========================================
  console.log('\n🚚 Creating shipping rates...');
  
  const shippingRates = [
    {
      name: 'Standard Shipping - US',
      description: 'Standard shipping within United States (5-7 business days)',
      country: 'US',
      minWeight: 0,
      maxWeight: 10,
      price: 9.99,
      currency: 'USD',
      estimatedDays: 5,
      active: true,
    },
    {
      name: 'Express Shipping - US',
      description: 'Express shipping within United States (2-3 business days)',
      country: 'US',
      minWeight: 0,
      maxWeight: 10,
      price: 24.99,
      currency: 'USD',
      estimatedDays: 2,
      active: true,
    },
    {
      name: 'Standard Shipping - CN',
      description: 'Standard shipping to China (10-15 business days)',
      country: 'CN',
      minWeight: 0,
      maxWeight: 10,
      price: 19.99,
      currency: 'USD',
      estimatedDays: 10,
      active: true,
    },
    {
      name: 'Express Shipping - CN',
      description: 'Express shipping to China (5-7 business days)',
      country: 'CN',
      minWeight: 0,
      maxWeight: 10,
      price: 39.99,
      currency: 'USD',
      estimatedDays: 5,
      active: true,
    },
    {
      name: 'Standard Shipping - EU',
      description: 'Standard shipping to European Union (7-10 business days)',
      country: 'EU',
      minWeight: 0,
      maxWeight: 10,
      price: 14.99,
      currency: 'USD',
      estimatedDays: 7,
      active: true,
    },
    {
      name: 'Standard Shipping - JP',
      description: 'Standard shipping to Japan (7-10 business days)',
      country: 'JP',
      minWeight: 0,
      maxWeight: 10,
      price: 16.99,
      currency: 'USD',
      estimatedDays: 7,
      active: true,
    },
    {
      name: 'Standard Shipping - KR',
      description: 'Standard shipping to South Korea (7-10 business days)',
      country: 'KR',
      minWeight: 0,
      maxWeight: 10,
      price: 16.99,
      currency: 'USD',
      estimatedDays: 7,
      active: true,
    },
  ];

  // 先删除旧的配送费率
  await prisma.shippingRate.deleteMany({});
  
  for (const rateData of shippingRates) {
    await prisma.shippingRate.create({
      data: rateData,
    });
  }
  console.log('  ✅ Created 7 shipping rates');

  // ========================================
  // 7. 创建示例评价
  // ========================================
  console.log('\n⭐ Creating sample reviews...');
  
  const reviews = [
    {
      userId: customer.id,
      productId: createdProducts[0].id,
      rating: 5,
      comment: 'Amazing device! The installation was super easy and the autonomous features work flawlessly. Highly recommended!',
      verified: true,
      approved: true,
    },
    {
      userId: customer.id,
      productId: createdProducts[0].id,
      rating: 5,
      comment: 'Best investment for my car. The AI driving assistance is incredibly smooth and safe.',
      verified: true,
      approved: true,
    },
    {
      userId: customer.id,
      productId: createdProducts[1].id,
      rating: 4,
      comment: 'Great entry-level device. Does exactly what it promises. Would recommend for beginners.',
      verified: true,
      approved: true,
    },
  ];

  // 先删除旧评价
  await prisma.review.deleteMany({});
  
  for (const reviewData of reviews) {
    await prisma.review.create({
      data: reviewData,
    });
  }
  console.log('  ✅ Created 3 sample reviews');

  // ========================================
  // 总结
  // ========================================
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Database seed completed successfully!');
  console.log('='.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`  • Users: 2 (1 admin, 1 customer)`);
  console.log(`  • Categories: 3`);
  console.log(`  • Products: ${createdProducts.length}`);
  console.log(`  • Translations: ${translations.length + zhTWTranslations.length}`);
  console.log(`  • Shipping Rates: 7`);
  console.log(`  • Reviews: 3`);
  console.log(`  • Addresses: 1`);
  console.log('\n👤 Test Accounts:');
  console.log(`  Admin: admin@mypilot.com / admin123`);
  console.log(`  Customer: customer@example.com / customer123`);
  console.log('\n🚀 Next steps:');
  console.log(`  1. Run: npm run dev`);
  console.log(`  2. Visit: http://localhost:3000`);
  console.log(`  3. Login with test accounts`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
