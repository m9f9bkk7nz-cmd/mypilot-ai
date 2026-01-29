'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  UserIcon,
  ShoppingBagIcon,
  MapPinIcon,
  CogIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  currency: string;
  itemCount: number;
}

interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AccountDashboardProps {
  user: User;
  orders: Order[];
  addresses: Address[];
  locale: string;
}

export default function AccountDashboard({
  user,
  orders,
  addresses,
  locale,
}: AccountDashboardProps) {
  const t = useTranslations('order');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
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
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  const recentOrders = orders.slice(0, 3);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {tNav('myAccount')}
        </h1>
        <p className="text-gray-600">
          Welcome back, {user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <Link
              href={`/${locale}/account/profile`}
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {tCommon('edit')} Profile
            </Link>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                href={`/${locale}/account/orders`}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{tNav('orders')}</span>
              </Link>
              <Link
                href={`/${locale}/account/addresses`}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{tNav('addresses')}</span>
              </Link>
              <Link
                href={`/${locale}/account/settings`}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <CogIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{tNav('settings')}</span>
              </Link>
            </nav>
          </div>

          {/* Default Address */}
          {defaultAddress && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Default Address</h3>
                <Link
                  href={`/${locale}/account/addresses`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {tCommon('edit')}
                </Link>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium">{defaultAddress.name}</p>
                <p className="mt-1">{defaultAddress.line1}</p>
                {defaultAddress.line2 && <p>{defaultAddress.line2}</p>}
                <p>
                  {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                </p>
                <p>{defaultAddress.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href={`/${locale}/account/orders`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link
                  href={`/${locale}/products`}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {t('orderNumber')}: {order.orderNumber}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} •{' '}
                        <span className="font-semibold text-gray-900">
                          {formatPrice(order.total, order.currency)}
                        </span>
                      </div>
                      <Link
                        href={`/${locale}/account/orders/${order.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {t('viewDetails')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
