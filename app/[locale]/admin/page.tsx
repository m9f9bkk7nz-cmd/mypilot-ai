'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

// Mock data - In production, this would come from API/database
const mockStats = {
  totalSales: 125430.50,
  totalOrders: 342,
  totalProducts: 156,
  lowStockCount: 8,
  salesChange: 12.5, // percentage
  ordersChange: -3.2,
  productsChange: 5.0,
};

const mockRecentOrders = [
  {
    id: '1',
    orderNumber: 'MP-2024-045',
    customer: 'John Doe',
    total: 1299.99,
    status: 'PENDING' as const,
    createdAt: '2024-01-28T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'MP-2024-044',
    customer: 'Jane Smith',
    total: 649.98,
    status: 'PROCESSING' as const,
    createdAt: '2024-01-28T09:15:00Z',
  },
  {
    id: '3',
    orderNumber: 'MP-2024-043',
    customer: 'Bob Johnson',
    total: 899.99,
    status: 'SHIPPED' as const,
    createdAt: '2024-01-27T16:45:00Z',
  },
  {
    id: '4',
    orderNumber: 'MP-2024-042',
    customer: 'Alice Williams',
    total: 449.99,
    status: 'DELIVERED' as const,
    createdAt: '2024-01-27T14:20:00Z',
  },
];

const mockLowStockProducts = [
  {
    id: '1',
    name: 'HD Camera Module - 1080p Wide Angle',
    sku: 'CAM-1080-001',
    stock: 3,
    minStock: 10,
  },
  {
    id: '2',
    name: 'Radar Sensor Kit - Long Range Detection',
    sku: 'RAD-LR-002',
    stock: 5,
    minStock: 15,
  },
  {
    id: '3',
    name: 'Control Unit Pro - Neural Network Processor',
    sku: 'CTL-PRO-003',
    stock: 2,
    minStock: 8,
  },
  {
    id: '4',
    name: 'GPS Module - High Precision',
    sku: 'GPS-HP-004',
    stock: 4,
    minStock: 12,
  },
];

export default function AdminDashboard({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('admin');
  const tOrder = useTranslations('order');
  const tCommon = useTranslations('common');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      PENDING: tOrder('statusPending'),
      PROCESSING: tOrder('statusProcessing'),
      SHIPPED: tOrder('statusShipped'),
      DELIVERED: tOrder('statusDelivered'),
      CANCELLED: tOrder('statusCancelled'),
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="mt-1 text-sm text-gray-600">{t('overview')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{t('totalSales')}</p>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(mockStats.totalSales)}
            </p>
            <div className="flex items-center mt-2">
              {mockStats.salesChange >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  mockStats.salesChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(mockStats.salesChange)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{t('totalOrders')}</p>
              <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders}</p>
            <div className="flex items-center mt-2">
              {mockStats.ordersChange >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  mockStats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(mockStats.ordersChange)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{t('totalProducts')}</p>
              <CubeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockStats.totalProducts}</p>
            <div className="flex items-center mt-2">
              {mockStats.productsChange >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  mockStats.productsChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(mockStats.productsChange)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{t('lowStock')}</p>
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockStats.lowStockCount}</p>
            <Link
              href={`/${locale}/admin/products?filter=low-stock`}
              className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              View products →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('recentOrders')}</h2>
              <Link
                href={`/${locale}/admin/orders`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {mockRecentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('lowStockProducts')}
              </h2>
              <Link
                href={`/${locale}/admin/products`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {mockLowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {product.stock} / {product.minStock}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">in stock / min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href={`/${locale}/admin/products`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <CubeIcon className="h-5 w-5" />
            {t('products')}
          </Link>
          <Link
            href={`/${locale}/admin/orders`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            {t('orders')}
          </Link>
          <Link
            href={`/${locale}/admin/categories`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="h-5 w-5" />
            {t('categories')}
          </Link>
          <Link
            href={`/${locale}/admin/reports`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="h-5 w-5" />
            {t('reports')}
          </Link>
        </div>
      </div>
    </div>
  );
}
