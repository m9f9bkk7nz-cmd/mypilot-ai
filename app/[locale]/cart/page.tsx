'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Mock cart data
const mockCartItems = [
  {
    id: '1',
    productId: 'prod1',
    name: 'Comma 3X - Advanced Driver Assistance System',
    slug: 'comma-3x-adas',
    image: '/products/comma-3x.jpg',
    price: 1299.99,
    quantity: 1,
    maxQuantity: 10,
    inStock: true,
  },
  {
    id: '2',
    productId: 'prod2',
    name: 'HD Camera Module - 1080p Wide Angle',
    slug: 'hd-camera-module',
    image: '/products/camera.jpg',
    price: 199.99,
    quantity: 2,
    maxQuantity: 15,
    inStock: true,
  },
];

export default function CartPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');

  const [cartItems, setCartItems] = useState(mockCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('empty')}</h1>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to get started
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    href={`/${locale}/products/${item.slug}`}
                    className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <Link
                          href={`/${locale}/products/${item.slug}`}
                          className="block"
                        >
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        aria-label={t('removeItem')}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-medium w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← {t('continueShopping')}
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                {shipping > 0 && subtotal < 500 && (
                  <p className="text-xs text-gray-500">
                    Add {formatPrice(500 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (estimated)</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">{t('total')}</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href={`/${locale}/checkout`}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-3"
              >
                {t('checkout')}
                <ArrowRightIcon className="inline-block h-5 w-5 ml-2" />
              </Link>

              <p className="text-xs text-gray-500 text-center">
                Secure checkout powered by Stripe
              </p>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
