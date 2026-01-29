'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Mock data - In production, this would come from API/database
const mockOrders = [
  {
    id: '1',
    orderNumber: 'MP-2024-045',
    customer: 'John Doe',
    email: 'john@example.com',
    total: 1299.99,
    status: 'PENDING' as const,
    createdAt: '2024-01-28T10:30:00Z',
    itemCount: 2,
  },
  {
    id: '2',
    orderNumber: 'MP-2024-044',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    total: 649.98,
    status: 'PROCESSING' as const,
    createdAt: '2024-01-28T09:15:00Z',
    itemCount: 3,
  },
  {
    id: '3',
    orderNumber: 'MP-2024-043',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    total: 899.99,
    status: 'SHIPPED' as const,
    createdAt: '2024-01-27T16:45:00Z',
    itemCount: 1,
  },
  {
    id: '4',
    orderNumber: 'MP-2024-042',
    customer: 'Alice Williams',
    email: 'alice@example.com',
    total: 449.99,
    status: 'DELIVERED' as const,
    createdAt: '2024-01-27T14:20:00Z',
    itemCount: 1,
  },
  {
    id: '5',
    orderNumber: 'MP-2024-041',
    customer: 'Charlie Brown',
    email: 'charlie@example.com',
    total: 1799.97,
    status: 'PROCESSING' as const,
    createdAt: '2024-01-26T11:00:00Z',
    itemCount: 4,
  },
  {
    id: '6',
    orderNumber: 'MP-2024-040',
    customer: 'Diana Prince',
    email: 'diana@example.com',
    total: 299.99,
    status: 'CANCELLED' as const,
    createdAt: '2024-01-26T08:30:00Z',
    itemCount: 1,
  },
];

export default function AdminOrdersPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('admin');
  const tOrder = useTranslations('order');
  const tCommon = useTranslations('common');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
      SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log('Update order status:', orderId, newStatus);
    // In production, call update API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('orders')}</h1>
          <p className="mt-1 text-sm text-gray-600">Manage customer orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
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
              <option value="PENDING">{tOrder('statusPending')}</option>
              <option value="PROCESSING">{tOrder('statusProcessing')}</option>
              <option value="SHIPPED">{tOrder('statusShipped')}</option>
              <option value="DELIVERED">{tOrder('statusDelivered')}</option>
              <option value="CANCELLED">{tOrder('statusCancelled')}</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tOrder('orderNumber')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tOrder('total')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tOrder('status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{order.itemCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="PENDING">{tOrder('statusPending')}</option>
                        <option value="PROCESSING">{tOrder('statusProcessing')}</option>
                        <option value="SHIPPED">{tOrder('statusShipped')}</option>
                        <option value="DELIVERED">{tOrder('statusDelivered')}</option>
                        <option value="CANCELLED">{tOrder('statusCancelled')}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/${locale}/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-5 w-5 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Count */}
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {mockOrders.length} orders
              </p>
            </div>
          )}

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No orders found</p>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
