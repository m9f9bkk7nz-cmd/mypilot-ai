'use client';

import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import Price from './Price';
import { type CurrencyCode } from '@/lib/currency';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    images: string[];
    rating: number;
    reviewCount: number;
    inStock: boolean;
  };
  locale: string;
  onAddToCart?: (productId: string) => void;
}

// 星级渲染组件 - 提取为独立组件避免重复渲染
const StarRating = memo(function StarRating({ rating }: { rating: number }) {
  const stars = useMemo(() => {
    const result = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        result.push(<StarIcon key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        result.push(
          <div key={i} className="relative h-4 w-4">
            <StarOutlineIcon className="absolute h-4 w-4 text-yellow-400" />
            <div className="absolute overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        result.push(<StarOutlineIcon key={i} className="h-4 w-4 text-gray-500" />);
      }
    }
    return result;
  }, [rating]);

  return <div className="flex items-center">{stars}</div>;
});

function ProductCard({ product, locale, onAddToCart }: ProductCardProps) {
  const t = useTranslations('product');

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inStock && onAddToCart) {
      onAddToCart(product.id);
    }
  }, [product.id, product.inStock, onAddToCart]);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group block glass-holo rounded-2xl overflow-hidden card-hover glow-hover border border-neon-blue/20 relative"
    >
      {/* Cyber glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-purple/0 to-neon-pink/0 group-hover:from-neon-blue/10 group-hover:via-neon-purple/10 group-hover:to-neon-pink/10 transition-all duration-500 pointer-events-none rounded-2xl"></div>
      
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-cyber-dark to-black overflow-hidden">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {t('noImage')}
          </div>
        )}

        {/* Neon Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-transparent to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 glass-holo flex items-center justify-center backdrop-blur-sm">
            <span className="bg-gradient-to-r from-neon-pink to-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-neon-pink/50 animate-neon-pulse">
              {t('outOfStock')}
            </span>
          </div>
        )}

        {/* Quick View Badge */}
        {product.inStock && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            <span className="glass-holo px-3 py-1 rounded-full text-xs text-neon-cyan border border-neon-cyan/50 shadow-lg shadow-neon-cyan/30">
              Quick View
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 relative z-10">
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-neon-purple transition-all duration-300">
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <Price 
            amount={product.price} 
            currency={product.currency as CurrencyCode}
            className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent animate-gradient-text"
          />

          {/* Quick Add to Cart Button */}
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue text-white hover:from-neon-blue hover:to-neon-purple transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-black shadow-lg shadow-neon-purple/50 hover:shadow-neon-blue/50 hover:scale-110 relative overflow-hidden group/btn"
              aria-label={t('addToCart')}
            >
              <ShoppingCartIcon className="h-5 w-5 relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            </button>
          )}
        </div>

        {/* Stock Status */}
        {product.inStock && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-lg shadow-neon-cyan/50"></div>
            <p className="text-xs text-neon-cyan">
              {t('inStock')}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

// 使用 memo 优化，避免不必要的重新渲染
export default memo(ProductCard);
