'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  currency: string;
  itemCount: number;
  trackingNumber?: string;
}

interface OrderHistoryProps {
  orders: Order[];
  locale: string;
  currency: string;
}

export default function OrderHistory({ orders, locale, currency }: OrderHistoryProps) {
  const t = useTranslations('order');
  const tCommon = useTranslations('common');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
      SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      PENDING: t('statusPending'),
      PROCESSING: t('statusProcessing'),
      SHIPPED: t('statusShipped'),
      DELIVERED: t('statusDelivered'),
      CANCELLED: t('statusCancelled'),
    };
    return statusMap[status] || status;
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">View and track your orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="PENDING">{t('statusPending')}</option>
            <option value="PROCESSING">{t('statusProcessing')}</option>
            <option value="SHIPPED">{t('statusShipped')}</option>
            <option value="DELIVERED">{t('statusDelivered')}</option>
            <option value="CANCELLED">{t('statusCancelled')}</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : "You haven't placed any orders yet"}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              href={`/${locale}/products`}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                {/* Order Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Order Total */}
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">{t('total')}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(order.total, order.currency)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <Link
                  href={`/${locale}/account/orders/${order.id}`}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t('viewDetails')}
                </Link>

                {order.trackingNumber && (
                  <Link
                    href={`/${locale}/account/orders/${order.id}/tracking`}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <TruckIcon className="h-4 w-4" />
                    {t('trackShipment')}
                  </Link>
                )}

                {order.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      // Handle cancel order
                      console.log('Cancel order:', order.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    {t('cancelOrder')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
}
