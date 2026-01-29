'use client';

import { useState } from 'react';
import ProductDetail from '@/components/ProductDetail';
import EnhancedReviewList from '@/components/EnhancedReviewList';
import EnhancedReviewForm from '@/components/EnhancedReviewForm';
import ProductCard from '@/components/ProductCard';

// 产品数据 - 使用真实图片
const productsData: Record<string, any> = {
  'mypilot-pro': {
    id: '1',
    name: 'MyPilot Pro - 专业版自动驾驶设备',
    slug: 'mypilot-pro',
    description: `MyPilot Pro 是一款专业级自动驾驶设备，专为与您的车辆无缝集成而设计。

功能特点：
• 先进的AI驱动驾驶辅助
• 多角度高清摄像系统
• 实时道路分析和障碍物检测
• 即插即用，安装简便
• 兼容大多数车型
• 支持OTA空中升级
• 7x24小时客户支持

MyPilot Pro 将您的普通车辆转变为智能半自动驾驶机器。立即体验驾驶的未来。

Features:
• Advanced AI-powered driving assistance
• High-definition camera system with multiple angles
• Real-time road analysis and obstacle detection
• Easy plug-and-play installation
• Compatible with most vehicle models
• Over-the-air software updates
• 24/7 customer support`,
    price: 999.99,
    comparePrice: 1299.99,
    currency: 'USD',
    images: [
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
    ],
    inventory: 100,
    specifications: {
      '处理器': 'AI专用芯片',
      '内存': '8GB LPDDR5',
      '存储': '128GB',
      '显示屏': '5.5" IPS LCD',
      '摄像头': '多角度高清摄像系统',
      '连接': 'Wi-Fi 6, 蓝牙 5.2, 4G LTE',
      '电源': '12V DC, 20W',
      '尺寸': '180 x 95 x 35 mm',
      '重量': '450g',
      '工作温度': '-20°C 至 70°C',
    },
  },
  'mypilot-standard': {
    id: '2',
    name: 'MyPilot 标准版 - 入门级设备',
    slug: 'mypilot-standard',
    description: `MyPilot 标准版是进入自动驾驶技术的完美起点。

功能特点：
• AI辅助车道保持
• 前向碰撞预警
• 自适应巡航控制支持
• 安装过程简单
• 兼容500+车型
• 定期软件更新

适合想要体验自动驾驶功能但预算有限的驾驶者。`,
    price: 599.99,
    comparePrice: 799.99,
    currency: 'USD',
    images: [
      '/images/products/主图 (3).jpg',
      '/images/products/主图 (4).jpg',
      '/images/products/主图 (5).jpg',
    ],
    inventory: 150,
    specifications: {
      '处理器': 'AI芯片',
      '内存': '4GB LPDDR4',
      '存储': '64GB',
      '显示屏': '4.5" LCD',
      '摄像头': '前置高清摄像头',
      '连接': 'Wi-Fi, 蓝牙 5.0',
      '电源': '12V DC, 15W',
      '尺寸': '160 x 85 x 30 mm',
      '重量': '350g',
      '工作温度': '-20°C 至 60°C',
    },
  },
  'mypilot-mount-kit': {
    id: '3',
    name: 'MyPilot 通用安装套件',
    slug: 'mypilot-mount-kit',
    description: `MyPilot设备通用安装套件。

包含：
• 可调节仪表盘支架
• 挡风玻璃吸盘支架
• 线缆管理夹
• 安装工具
• 详细安装指南

兼容所有MyPilot设备型号。`,
    price: 49.99,
    comparePrice: 69.99,
    currency: 'USD',
    images: [
      '/images/products/主图 (6).jpg',
      '/images/products/主图 (7).jpg',
    ],
    inventory: 200,
    specifications: {
      '材质': '航空级铝合金 + ABS',
      '兼容性': '所有MyPilot设备',
      '安装方式': '吸盘/粘贴',
      '可调角度': '360°',
      '重量': '180g',
    },
  },
  'mypilot-power-cable': {
    id: '4',
    name: 'MyPilot 电源线 - 3米',
    slug: 'mypilot-power-cable',
    description: `MyPilot设备专用高品质3米电源线。

特点：
• 优质铜芯线材
• 耐用编织外层
• 附带通用车载适配器
• 内置浪涌保护

完美适合车内隐藏式布线。`,
    price: 29.99,
    currency: 'USD',
    images: [
      '/images/products/主图 (8).jpg',
    ],
    inventory: 300,
    specifications: {
      '长度': '3米',
      '线材': '优质铜芯',
      '外层': '编织尼龙',
      '输出': '12V 2A',
      '保护': '过流/过压保护',
    },
  },
  'mypilot-protective-case': {
    id: '5',
    name: 'MyPilot 保护套',
    slug: 'mypilot-protective-case',
    description: `MyPilot设备专用高级保护套。

特点：
• 减震设计
• 耐热材料
• 所有端口便捷访问
• 时尚专业外观

保护您的MyPilot设备安全美观。`,
    price: 39.99,
    comparePrice: 49.99,
    currency: 'USD',
    images: [
      '/images/products/主图 (9).jpg',
      '/images/products/主图10-白底.jpg',
    ],
    inventory: 250,
    specifications: {
      '材质': '硅胶 + PC',
      '兼容': 'MyPilot Pro / 标准版',
      '颜色': '黑色',
      '特性': '防摔/防尘/散热',
    },
  },
};

// 默认产品（兼容旧链接）
const defaultProduct = productsData['mypilot-pro'];

const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    userName: '张先生',
    userImage: '/avatars/user1.jpg',
    rating: 5,
    comment: '非常棒的产品！安装简单，性能超出预期。车道保持非常平稳，自适应巡航在拥堵路况下也能完美工作。强烈推荐！',
    verified: true,
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing device! The installation was straightforward and the performance exceeded my expectations. The lane keeping is incredibly smooth.',
    verified: true,
    createdAt: '2026-01-10T14:20:00Z',
  },
  {
    id: '3',
    userId: 'user3',
    userName: '李女士',
    rating: 4,
    comment: '整体很满意，做工精良，功能丰富。唯一的小问题是校准需要一点时间，但设置好后就完美运行了。',
    verified: true,
    createdAt: '2026-01-05T09:15:00Z',
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Mike Chen',
    rating: 5,
    comment: '这是我为车买的最好的东西。安全功能让我在长途驾驶时非常安心。客服在安装过程中也非常有帮助。',
    verified: true,
    createdAt: '2026-01-02T16:45:00Z',
  },
];

const relatedProducts = [
  {
    id: '2',
    name: 'MyPilot 标准版',
    slug: 'mypilot-standard',
    price: 599.99,
    currency: 'USD',
    images: ['/images/products/主图 (3).jpg'],
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
  },
  {
    id: '3',
    name: 'MyPilot 安装套件',
    slug: 'mypilot-mount-kit',
    price: 49.99,
    currency: 'USD',
    images: ['/images/products/主图 (6).jpg'],
    rating: 4.6,
    reviewCount: 124,
    inStock: true,
  },
  {
    id: '5',
    name: 'MyPilot 保护套',
    slug: 'mypilot-protective-case',
    price: 39.99,
    currency: 'USD',
    images: ['/images/products/主图 (9).jpg'],
    rating: 4.5,
    reviewCount: 98,
    inStock: true,
  },
];

export default function ProductDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  // 获取产品数据，如果找不到则使用默认产品
  const product = productsData[slug] || defaultProduct;

  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Product Detail */}
      <ProductDetail
        product={product}
        reviews={mockReviews}
        relatedProducts={[]}
        locale={locale}
        currency="USD"
      />

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              <span className="gradient-text-neon">用户评价</span>
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-neon-purple/50 transition-all"
            >
              {showReviewForm ? '取消' : '写评价'}
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <EnhancedReviewForm
                productId={product.id}
                productName={product.name}
                productImage={product.images[0]}
                onSubmit={async (review) => {
                  console.log('Review submitted:', review);
                  // 这里可以调用API提交评价
                  await new Promise(resolve => setTimeout(resolve, 1500));
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}
        </div>

        <EnhancedReviewList
          reviews={[]}
          averageRating={averageRating}
          totalReviews={256}
          locale={locale}
          onHelpful={(reviewId) => {
            console.log('Helpful clicked:', reviewId);
            // 这里可以调用API记录有帮助
          }}
        />
      </div>

      {/* Related Products */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">相关产品 / Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
