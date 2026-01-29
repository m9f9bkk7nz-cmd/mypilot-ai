'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ClockIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  DocumentArrowDownIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  shippingMethod: string;
  trackingNumber?: string;
  trackingUrl?: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  items: OrderItem[];
}

interface OrderDetailProps {
  order: Order;
  locale: string;
  currency: string;
}

export default function OrderDetail({ order, locale, currency }: OrderDetailProps) {
  const t = useTranslations('order');
  const tCommon = useTranslations('common');

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const getPaymentStatusText = (status: Order['paymentStatus']) => {
    const statusMap = {
      PENDING: 'Pending',
      PAID: 'Paid',
      FAILED: 'Failed',
      REFUNDED: 'Refunded',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href={`/${locale}/account/orders`}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {tCommon('back')} to Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('orderNumber')}: {order.orderNumber}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Download Invoice
            </button>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <TruckIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Tracking Number: {order.trackingNumber}
                </p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Track Shipment →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <Link
                    href={`/${locale}/products/${item.slug}`}
                    className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/products/${item.slug}`}
                      className="block"
                    >
                      <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity, order.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {formatPrice(order.subtotal, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {formatPrice(order.shippingCost, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  {formatPrice(order.tax, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {formatPrice(order.total, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="mt-1">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">{order.shippingAddress.phone}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Shipping Method</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {order.shippingMethod}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Method</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === 'PAID'
                      ? 'text-green-600'
                      : order.paymentStatus === 'FAILED'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {getPaymentStatusText(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'PENDING' && (
            <button
              onClick={() => {
                // Handle cancel order
                console.log('Cancel order:', order.id);
              }}
              className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md font-medium hover:bg-red-50 transition-colors"
            >
              {t('cancelOrder')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
