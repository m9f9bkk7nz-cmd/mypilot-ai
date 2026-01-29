import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { supportedVehicles, getTotalVehicleCount } from '@/lib/vehicles';

// 使用真实产品图片
const featuredProducts = [
  {
    id: '1',
    name: 'MyPilot Pro - 专业版自动驾驶设备',
    slug: 'mypilot-pro',
    price: 999.99,
    comparePrice: 1299.99,
    currency: 'USD',
    images: ['/images/products/主图 (1).jpg', '/images/products/主图 (2).jpg'],
    rating: 4.9,
    reviewCount: 256,
    inStock: true,
  },
  {
    id: '2',
    name: 'MyPilot 标准版 - 入门级设备',
    slug: 'mypilot-standard',
    price: 599.99,
    comparePrice: 799.99,
    currency: 'USD',
    images: ['/images/products/主图 (3).jpg', '/images/products/主图 (4).jpg'],
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
  },
  {
    id: '3',
    name: 'MyPilot 通用安装套件',
    slug: 'mypilot-mount-kit',
    price: 49.99,
    comparePrice: 69.99,
    currency: 'USD',
    images: ['/images/products/主图 (6).jpg', '/images/products/主图 (7).jpg'],
    rating: 4.6,
    reviewCount: 124,
    inStock: true,
  },
  {
    id: '4',
    name: 'MyPilot 保护套',
    slug: 'mypilot-protective-case',
    price: 39.99,
    comparePrice: 49.99,
    currency: 'USD',
    images: ['/images/products/主图 (9).jpg', '/images/products/主图10-白底.jpg'],
    rating: 4.5,
    reviewCount: 98,
    inStock: true,
  },
];

const categories = [
  { name: '智能驾驶设备', icon: '🚗', href: '/products?category=devices', gradient: 'from-neon-blue to-neon-cyan' },
  { name: '安装配件', icon: '🔧', href: '/products?category=accessories', gradient: 'from-neon-purple to-neon-pink' },
  { name: '连接线缆', icon: '🔌', href: '/products?category=cables', gradient: 'from-neon-cyan to-neon-blue' },
  { name: '升级服务', icon: '⚡', href: '/products?category=services', gradient: 'from-neon-pink to-neon-purple' },
];

const features = [
  {
    icon: TruckIcon,
    title: '全球配送',
    description: '支持全球主要国家配送',
    gradient: 'from-neon-blue to-neon-cyan',
  },
  {
    icon: ShieldCheckIcon,
    title: '2年质保',
    description: '所有硬件产品享受质保',
    gradient: 'from-neon-purple to-neon-pink',
  },
  {
    icon: CreditCardIcon,
    title: '安全支付',
    description: '支持多种支付方式',
    gradient: 'from-neon-cyan to-neon-blue',
  },
  {
    icon: ShoppingBagIcon,
    title: '7天退换',
    description: '7天无理由退换货',
    gradient: 'from-neon-pink to-neon-purple',
  },
];

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');

  return (
    <main className="min-h-screen gradient-bg">
      {/* Hero Section with Product Image */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-blue rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-purple rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-pink rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="gradient-text-neon">
                  MyPilot 智能驾驶系统
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                让您的爱车拥有 L2+ 级别自动驾驶能力
              </p>
              <ul className="text-gray-400 mb-8 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <li className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-neon-cyan">✓</span> AI智能驾驶辅助
                </li>
                <li className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-neon-cyan">✓</span> 高清多角度摄像系统
                </li>
                <li className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-neon-cyan">✓</span> 即插即用，安装简便
                </li>
                <li className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-neon-cyan">✓</span> 支持OTA空中升级
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
                <Link
                  href={`/${locale}/products/mypilot-pro`}
                  className="inline-block cyber-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-neon-blue/50 hover:shadow-neon-purple/50 hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10">立即购买 $999.99</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="inline-block glass-holo text-white px-8 py-4 rounded-full font-semibold hover:bg-neon-blue/10 transition-all duration-300 border border-neon-blue/30 shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/40 hover:scale-105"
                >
                  查看全部产品
                </Link>
              </div>
            </div>

            {/* Right: Product Image */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 rounded-3xl blur-2xl"></div>
                {/* Product Image */}
                <div className="relative glass-holo rounded-3xl overflow-hidden border border-neon-blue/30 p-4">
                  <Image
                    src="/images/products/主图 (1).jpg"
                    alt="MyPilot Pro"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover rounded-2xl"
                    priority
                  />
                </div>
                {/* Price Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-neon-purple/50">
                  <span className="line-through text-gray-300 text-sm mr-2">$1299.99</span>
                  <span className="text-xl">$999.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Image Section */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="gradient-text-neon">产品详情</span>
          </h2>
          <div className="glass-holo rounded-3xl overflow-hidden border border-neon-blue/30 p-2">
            <Image
              src="/images/products/详情长图.jpg"
              alt="MyPilot 产品详情"
              width={1200}
              height={3000}
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            <span className="gradient-text-neon">产品分类</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/${locale}${category.href}`}
                className="glass-holo rounded-2xl p-8 text-center card-hover glow-hover border border-neon-blue/20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-purple/0 group-hover:from-neon-blue/10 group-hover:to-neon-purple/10 transition-all duration-500"></div>
                <div className="text-5xl mb-4 float relative z-10">{category.icon}</div>
                <h3 className="font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-neon-purple transition-all duration-300 relative z-10">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">
              <span className="gradient-text-neon">热门产品</span>
            </h2>
            <Link
              href={`/${locale}/products`}
              className="text-neon-cyan hover:text-neon-blue font-medium flex items-center gap-2 group transition-all duration-300"
            >
              查看全部
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            <span className="gradient-text-neon">产品展示</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div
                key={num}
                className="glass-holo rounded-xl overflow-hidden border border-neon-blue/20 card-hover group"
              >
                <div className="aspect-square relative">
                  <Image
                    src={`/images/products/主图 (${num}).jpg`}
                    alt={`MyPilot 产品图 ${num}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
            <div className="glass-holo rounded-xl overflow-hidden border border-neon-blue/20 card-hover group">
              <div className="aspect-square relative">
                <Image
                  src="/images/products/主图10-白底.jpg"
                  alt="MyPilot 产品图 10"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Vehicles Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text-neon">支持 {supportedVehicles.length}+ 品牌，{getTotalVehicleCount()}+ 车型</span>
            </h2>
            <p className="text-gray-400 text-lg">
              覆盖主流汽车品牌，持续更新中
            </p>
          </div>
          
          {/* Brand Logos Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-4 mb-8">
            {supportedVehicles.slice(0, 20).map((brand, index) => (
              <div
                key={brand.brand}
                className="glass-holo rounded-xl p-3 text-center border border-neon-blue/20 hover:border-neon-cyan/50 transition-all group"
              >
                <div className="text-2xl mb-1">🚗</div>
                <p className="text-xs text-gray-400 group-hover:text-neon-cyan truncate">
                  {brand.brandZh}
                </p>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              href={`/${locale}/vehicles`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 rounded-full text-neon-cyan hover:text-white hover:border-neon-cyan/50 transition-all group"
            >
              查看全部支持车型
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-holo rounded-2xl p-8 text-center card-hover border border-neon-blue/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-purple/0 group-hover:from-neon-blue/5 group-hover:to-neon-purple/5 transition-all duration-500"></div>
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full mb-4 shadow-lg shadow-neon-blue/30 group-hover:shadow-neon-purple/50 transition-all duration-300 relative z-10`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-400 relative z-10">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-glow-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-pink rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-holo rounded-3xl p-12 border border-neon-blue/30 glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-neon-purple/5 to-neon-pink/5"></div>
            <h2 className="text-4xl font-bold mb-4 relative z-10">
              <span className="gradient-text-neon">准备好升级您的爱车了吗？</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 relative z-10">
              加入数万名车主，体验 MyPilot 智能驾驶系统
            </p>
            <Link
              href={`/${locale}/products/mypilot-pro`}
              className="inline-block cyber-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-10 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-neon-blue/50 hover:shadow-neon-purple/50 hover:scale-105 relative z-10 overflow-hidden group"
            >
              <span className="relative z-10">立即购买 MyPilot Pro</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
