'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductCard from '@/components/ProductCard';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

// 真实产品数据
const mockProducts = [
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
    category: 'devices',
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
    category: 'devices',
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
    category: 'accessories',
  },
  {
    id: '4',
    name: 'MyPilot 电源线 - 3米',
    slug: 'mypilot-power-cable',
    price: 29.99,
    currency: 'USD',
    images: ['/images/products/主图 (8).jpg'],
    rating: 4.5,
    reviewCount: 87,
    inStock: true,
    category: 'accessories',
  },
  {
    id: '5',
    name: 'MyPilot 保护套',
    slug: 'mypilot-protective-case',
    price: 39.99,
    comparePrice: 49.99,
    currency: 'USD',
    images: ['/images/products/主图 (9).jpg', '/images/products/主图10-白底.jpg'],
    rating: 4.5,
    reviewCount: 98,
    inStock: true,
    category: 'accessories',
  },
];

const categories = [
  { id: 'all', name: '全部产品 / All Products' },
  { id: 'devices', name: '智能设备 / Devices' },
  { id: 'accessories', name: '配件 / Accessories' },
];

const sortOptions = [
  { value: 'newest', label: '最新 / Newest' },
  { value: 'price-low', label: '价格从低到高' },
  { value: 'price-high', label: '价格从高到低' },
  { value: 'rating', label: '评分最高' },
];

export default function ProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('product');
  const tCommon = useTranslations('common');

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort products
  let filteredProducts = [...mockProducts];

  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
  }

  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-neon">{t('title')}</span>
          </h1>
          <p className="text-gray-400">
            显示 {filteredProducts.length} / {mockProducts.length} 个产品
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="glass-holo rounded-2xl border border-neon-blue/30 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">筛选</h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 2000]);
                  }}
                  className="text-sm text-neon-cyan hover:text-neon-blue"
                >
                  清除
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">分类</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-neon-blue focus:ring-neon-blue bg-dark-800 border-neon-blue/30"
                      />
                      <span className="ml-2 text-sm text-gray-300 group-hover:text-white">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">
                  价格范围
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-neon-blue"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">
                  库存状态
                </h3>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-neon-blue focus:ring-neon-blue rounded bg-dark-800 border-neon-blue/30"
                  />
                  <span className="ml-2 text-sm text-gray-300 group-hover:text-white">
                    仅显示有货
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="glass-holo rounded-2xl border border-neon-blue/30 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    排序:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-dark-800 border border-neon-blue/30 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode & Filter Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-neon-blue/30 rounded-lg text-sm font-medium text-gray-300 hover:bg-neon-blue/10"
                  >
                    <FunnelIcon className="h-4 w-4" />
                    筛选
                  </button>

                  <div className="hidden sm:flex items-center gap-1 border border-neon-blue/30 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${
                        viewMode === 'grid'
                          ? 'bg-neon-blue/20 text-neon-cyan'
                          : 'text-gray-400 hover:bg-neon-blue/10'
                      }`}
                    >
                      <Squares2X2Icon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded ${
                        viewMode === 'list'
                          ? 'bg-neon-blue/20 text-neon-cyan'
                          : 'text-gray-400 hover:bg-neon-blue/10'
                      }`}
                    >
                      <ListBulletIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="glass-holo rounded-2xl border border-neon-blue/30 p-12 text-center">
                <p className="text-gray-400 mb-4">没有找到产品</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 2000]);
                  }}
                  className="text-neon-cyan hover:text-neon-blue font-medium"
                >
                  清除筛选
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
