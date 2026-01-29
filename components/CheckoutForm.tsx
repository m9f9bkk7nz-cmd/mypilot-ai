'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'alipay';
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutFormProps {
  addresses: Address[];
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  cartItems: CartItem[];
  subtotal: number;
  currency: string;
  locale: string;
  onSubmit: (data: {
    addressId: string;
    shippingMethodId: string;
    paymentMethodId: string;
  }) => Promise<void>;
  onAddAddress?: () => void;
}

export default function CheckoutForm({
  addresses,
  shippingMethods,
  paymentMethods,
  cartItems,
  subtotal,
  currency,
  locale,
  onSubmit,
  onAddAddress,
}: CheckoutFormProps) {
  const t = useTranslations('checkout');
  const tCommon = useTranslations('common');

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.id)?.id || ''
  );
  const [selectedShippingId, setSelectedShippingId] = useState(
    shippingMethods[0]?.id || ''
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    paymentMethods[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const selectedShipping = shippingMethods.find((m) => m.id === selectedShippingId);
  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddressId || !selectedShippingId || !selectedPaymentId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        addressId: selectedAddressId,
        shippingMethodId: selectedShippingId,
        paymentMethodId: selectedPaymentId,
      });
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('shippingAddress')}
              </h2>
              {onAddAddress && (
                <button
                  type="button"
                  onClick={onAddAddress}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {tCommon('add')}
                </button>
              )}
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved addresses</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAddressId === address.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{address.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.line1}
                          {address.line2 && `, ${address.line2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                        <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('shippingMethod')}
            </h2>

            <div className="space-y-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedShippingId === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={selectedShippingId === method.id}
                    onChange={(e) => setSelectedShippingId(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TruckIcon className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Estimated delivery: {method.estimatedDays} days
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(method.price)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('paymentMethod')}
            </h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentId === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPaymentId === method.id}
                    onChange={(e) => setSelectedPaymentId(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="h-6 w-6 text-gray-400" />
                    <p className="font-medium text-gray-900">{method.name}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('orderSummary')}
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedAddressId || !selectedShippingId || !selectedPaymentId}
              className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? t('processing') : t('placeOrder')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
