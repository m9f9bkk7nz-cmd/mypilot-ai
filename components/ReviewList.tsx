'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  images?: string[];
  verified: boolean;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  locale: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  locale,
  onLoadMore,
  hasMore = false,
}: ReviewListProps) {
  const t = useTranslations('product');
  const tCommon = useTranslations('common');

  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
            ) : (
              <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  // Filter and sort reviews
  let filteredReviews = [...reviews];
  if (filterRating) {
    filteredReviews = filteredReviews.filter((r) => r.rating === filterRating);
  }

  filteredReviews.sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div>
                <div className="text-5xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div className="mt-2">{renderStars(Math.round(averageRating), 'lg')}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`w-full flex items-center gap-3 text-sm hover:bg-gray-50 p-2 rounded transition-colors ${
                  filterRating === rating ? 'bg-blue-50' : ''
                }`}
              >
                <span className="flex items-center gap-1 w-12">
                  <span className="font-medium">{rating}</span>
                  <StarIcon className="h-3 w-3 text-yellow-400" />
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-600 w-12 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        {filterRating && (
          <button
            onClick={() => setFilterRating(null)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Reviews */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">{t('noReviews')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {review.userImage ? (
                    <Image
                      src={review.userImage}
                      alt={review.userName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{review.userName}</p>
                      {review.verified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* Review Content */}
              <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {tCommon('loading')}
          </button>
        </div>
      )}
    </div>
  );
}
