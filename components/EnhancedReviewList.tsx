'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  StarIcon, 
  HandThumbUpIcon, 
  CheckBadgeIcon,
  FunnelIcon,
  PhotoIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { 
  StarIcon as StarOutlineIcon, 
  HandThumbUpIcon as HandThumbUpOutlineIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface SellerReply {
  content: string;
  createdAt: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
  sellerReply?: SellerReply;
}

interface EnhancedReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  locale: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onHelpful?: (reviewId: string) => void;
  userHelpfulReviews?: string[];
}

// 示例评价数据
const sampleReviews: Review[] = [
  {
    id: '1',
    userId: 'u1',
    userName: '张先生',
    rating: 5,
    title: '非常满意，安装简单',
    comment: '买来给我的Model 3用的，安装非常简单，大概20分钟就搞定了。使用了一周，高速上的辅助驾驶体验非常好，比原厂的AP还要稳定。客服也很耐心，有问必答。强烈推荐！',
    images: ['/images/products/主图 (1).jpg', '/images/products/主图 (2).jpg'],
    verified: true,
    helpful: 42,
    createdAt: '2026-01-15T10:30:00Z',
    sellerReply: {
      content: '感谢您的支持和认可！如有任何问题随时联系我们，祝您驾驶愉快！',
      createdAt: '2026-01-16T09:00:00Z',
    },
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Michael L.',
    rating: 5,
    title: 'Best aftermarket ADAS I\'ve used',
    comment: 'I\'ve tried several aftermarket driving assistance systems, and MyPilot is by far the best. The lane keeping is smooth, and the adaptive cruise control works flawlessly. Worth every penny!',
    images: ['/images/products/主图 (3).jpg'],
    verified: true,
    helpful: 38,
    createdAt: '2026-01-12T14:20:00Z',
  },
  {
    id: '3',
    userId: 'u3',
    userName: '李女士',
    rating: 4,
    title: '整体不错，期待更多功能',
    comment: '产品质量很好，做工精细。安装后使用了两周，高速场景表现优秀。希望后续OTA能增加更多城市道路的辅助功能。',
    verified: true,
    helpful: 25,
    createdAt: '2026-01-10T08:45:00Z',
    sellerReply: {
      content: '感谢您的反馈！城市道路辅助功能正在开发中，预计下个季度通过OTA推送，敬请期待！',
      createdAt: '2026-01-10T15:30:00Z',
    },
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'David K.',
    rating: 5,
    comment: 'Quick shipping, easy installation, great performance. The customer support team was very helpful when I had questions about compatibility with my Honda Accord.',
    verified: true,
    helpful: 19,
    createdAt: '2026-01-08T16:00:00Z',
  },
  {
    id: '5',
    userId: 'u5',
    userName: '王先生',
    rating: 3,
    title: '功能不错，但安装有点麻烦',
    comment: '产品功能确实强大，但我的车型安装起来比较复杂，花了差不多一个小时。建议官方能提供更详细的安装视频。',
    verified: true,
    helpful: 12,
    createdAt: '2026-01-05T11:20:00Z',
    sellerReply: {
      content: '非常抱歉给您带来不便！我们已经针对您的车型制作了详细的安装教程视频，已发送到您的邮箱，如有问题可随时联系客服。',
      createdAt: '2026-01-05T18:00:00Z',
    },
  },
];

export default function EnhancedReviewList({
  reviews = sampleReviews,
  averageRating = 4.6,
  totalReviews = 256,
  locale,
  onLoadMore,
  hasMore = true,
  onHelpful,
  userHelpfulReviews = [],
}: EnhancedReviewListProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('helpful');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showWithImages, setShowWithImages] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [helpfulClicked, setHelpfulClicked] = useState<string[]>(userHelpfulReviews);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
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
          <StarIcon
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  // Filter and sort reviews
  let filteredReviews = [...reviews];
  
  if (filterRating) {
    filteredReviews = filteredReviews.filter((r) => r.rating === filterRating);
  }
  
  if (showWithImages) {
    filteredReviews = filteredReviews.filter((r) => r.images && r.images.length > 0);
  }

  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'helpful':
        return b.helpful - a.helpful;
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const handleHelpful = (reviewId: string) => {
    if (helpfulClicked.includes(reviewId)) return;
    setHelpfulClicked([...helpfulClicked, reviewId]);
    onHelpful?.(reviewId);
  };

  const reviewsWithImages = reviews.filter((r) => r.images && r.images.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="glass-holo rounded-2xl border border-neon-blue/20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Average Rating */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="text-6xl font-bold gradient-text-neon">
                {averageRating.toFixed(1)}
              </div>
              <div className="mt-2">{renderStars(Math.round(averageRating), 'lg')}</div>
              <p className="text-gray-400 mt-2">
                基于 {totalReviews} 条评价
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2 lg:col-span-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`w-full flex items-center gap-3 text-sm p-2 rounded-lg transition-all ${
                  filterRating === rating 
                    ? 'bg-neon-cyan/20 border border-neon-cyan/30' 
                    : 'hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-1 w-16 text-gray-300">
                  <span className="font-medium">{rating}</span>
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                </span>
                <div className="flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-400 w-12 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="appearance-none px-4 py-2 pr-10 bg-white/5 border border-neon-blue/30 rounded-xl text-white text-sm focus:outline-none focus:border-neon-cyan/50 cursor-pointer"
          >
            <option value="helpful" className="bg-gray-900">最有帮助</option>
            <option value="recent" className="bg-gray-900">最新评价</option>
            <option value="highest" className="bg-gray-900">评分最高</option>
            <option value="lowest" className="bg-gray-900">评分最低</option>
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Image Filter */}
        <button
          onClick={() => setShowWithImages(!showWithImages)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
            showWithImages
              ? 'bg-neon-purple/20 border border-neon-purple/50 text-neon-purple'
              : 'bg-white/5 border border-neon-blue/30 text-gray-300 hover:border-neon-blue/50'
          }`}
        >
          <PhotoIcon className="w-4 h-4" />
          带图评价 ({reviewsWithImages})
        </button>

        {/* Clear Filters */}
        {(filterRating || showWithImages) && (
          <button
            onClick={() => {
              setFilterRating(null);
              setShowWithImages(false);
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-neon-pink hover:text-neon-pink/80 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            清除筛选
          </button>
        )}

        <span className="text-gray-500 text-sm ml-auto">
          显示 {filteredReviews.length} 条评价
        </span>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 glass-holo rounded-2xl border border-neon-blue/20">
          <FunnelIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">没有符合条件的评价</p>
          <button
            onClick={() => {
              setFilterRating(null);
              setShowWithImages(false);
            }}
            className="mt-4 text-neon-cyan hover:text-neon-cyan/80 text-sm"
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="glass-holo rounded-2xl border border-neon-blue/20 p-6 hover:border-neon-blue/40 transition-all"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.userImage ? (
                    <Image
                      src={review.userImage}
                      alt={review.userName}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-neon-cyan/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 flex items-center justify-center border border-neon-cyan/30">
                      <span className="text-white font-semibold text-lg">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{review.userName}</p>
                      {review.verified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-neon-green/20 text-neon-green text-xs rounded-full border border-neon-green/30">
                          <CheckBadgeIcon className="w-3 h-3" />
                          已购买
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* Review Title */}
              {review.title && (
                <h4 className="text-lg font-semibold text-white mb-2">{review.title}</h4>
              )}

              {/* Review Content */}
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {review.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setExpandedImage(image)}
                      className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-neon-blue/30 hover:border-neon-cyan/50 transition-all group"
                    >
                      <Image
                        src={image}
                        alt={`评价图片 ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="mt-4 pt-4 border-t border-neon-blue/10 flex items-center justify-between">
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpfulClicked.includes(review.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    helpfulClicked.includes(review.id)
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-transparent'
                  }`}
                >
                  {helpfulClicked.includes(review.id) ? (
                    <HandThumbUpIcon className="w-4 h-4" />
                  ) : (
                    <HandThumbUpOutlineIcon className="w-4 h-4" />
                  )}
                  有帮助 ({review.helpful + (helpfulClicked.includes(review.id) ? 1 : 0)})
                </button>
              </div>

              {/* Seller Reply */}
              {review.sellerReply && (
                <div className="mt-4 ml-6 p-4 bg-neon-purple/10 rounded-xl border border-neon-purple/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ChatBubbleLeftIcon className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm font-semibold text-neon-purple">卖家回复</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.sellerReply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{review.sellerReply.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-white/5 border border-neon-blue/30 rounded-xl text-gray-300 hover:text-white hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all"
          >
            加载更多评价
          </button>
        </div>
      )}

      {/* Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={expandedImage}
              alt="评价图片"
              width={800}
              height={800}
              className="object-contain max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
