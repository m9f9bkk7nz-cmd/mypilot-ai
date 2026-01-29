'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import ProductGallery from './ProductGallery';
import VehicleSelector from './VehicleSelector';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  inventory: number;
  specifications?: Record<string, string>;
  requiresVehicle?: boolean; // 是否需要选择车型
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface SelectedVehicle {
  brand: string;
  model: string;
  year: string;
}

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
  locale: string;
  currency: string;
}

export default function ProductDetail({
  product,
  reviews,
  relatedProducts,
  locale,
  currency,
}: ProductDetailProps) {
  const t = useTranslations('product');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);

  // 判断是否需要选择车型（主设备产品需要）
  const requiresVehicle = product.requiresVehicle !== false && 
    (product.slug?.includes('mypilot-pro') || product.slug?.includes('mypilot-standard') || product.name?.includes('MyPilot'));

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.inventory) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product.inventory > 0) {
      // 检查是否需要选择车型
      if (requiresVehicle && !selectedVehicle) {
        alert(locale.startsWith('zh') ? '请先选择您的车型' : 'Please select your vehicle first');
        return;
      }
      // TODO: Implement add to cart functionality
      console.log('Add to cart:', product.id, 'quantity:', quantity, 'vehicle:', selectedVehicle);
      // You can add toast notification here
    }
  };

  const handleVehicleSelect = (brand: string, model: string, year: string) => {
    setSelectedVehicle({ brand, model, year });
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <div>
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">
                  ({reviews.length} {t('reviews')})
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-4">
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price, currency)}
            </p>
          </div>

          {/* Stock Status */}
          <div>
            {product.inventory > 0 ? (
              <p className="text-green-600 font-medium">
                {t('inStock')} ({product.inventory} {t('available')})
              </p>
            ) : (
              <p className="text-red-600 font-medium">{t('outOfStock')}</p>
            )}
          </div>

          {/* Quantity Selector */}
          {product.inventory > 0 && (
            <div className="space-y-4">
              {/* Vehicle Selector - 仅对需要选择车型的产品显示 */}
              {requiresVehicle && (
                <div className="mb-4">
                  <VehicleSelector
                    onSelect={handleVehicleSelect}
                    selectedVehicle={selectedVehicle}
                    locale={locale}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quantity')}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.inventory}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={requiresVehicle && !selectedVehicle}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  requiresVehicle && !selectedVehicle
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {requiresVehicle && !selectedVehicle 
                  ? (locale.startsWith('zh') ? '请先选择车型' : 'Select Vehicle First')
                  : t('addToCart')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('description')}
          </button>
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'specifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('specifications')}
            </button>
          )}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('reviews')} ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && product.specifications && (
            <div className="max-w-2xl">
              <dl className="divide-y divide-gray-200">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">{t('noReviews')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
