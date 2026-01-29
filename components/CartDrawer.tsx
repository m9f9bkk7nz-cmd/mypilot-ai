'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  slug: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  currency: string;
  locale: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  total,
  currency,
  locale,
  onUpdateQuantity,
  onRemove,
}: CartDrawerProps) {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('title')} ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={tCommon('close')}
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBagIcon className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">{t('empty')}</p>
                <button
                  onClick={onClose}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('continueShopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                    {/* Product Image */}
                    <Link
                      href={`/${locale}/products/${item.slug}`}
                      onClick={onClose}
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

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/${locale}/products/${item.slug}`}
                        onClick={onClose}
                        className="block"
                      >
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="ml-auto p-1 text-red-600 hover:text-red-700"
                          aria-label={t('removeItem')}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-600">{t('subtotal')}</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-gray-900">{t('total')}</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>

              {/* Checkout Button */}
              <Link
                href={`/${locale}/checkout`}
                onClick={onClose}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('checkout')}
              </Link>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="block w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                {t('continueShopping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
