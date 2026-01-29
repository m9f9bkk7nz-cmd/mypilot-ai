'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  StarIcon, 
  PhotoIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface EnhancedReviewFormProps {
  productId: string;
  productName: string;
  productImage?: string;
  onSubmit: (review: {
    rating: number;
    title: string;
    comment: string;
    images?: File[];
  }) => Promise<void>;
  onCancel?: () => void;
}

const ratingLabels = ['', '很差', '较差', '一般', '满意', '非常满意'];

export default function EnhancedReviewForm({
  productId,
  productName,
  productImage,
  onSubmit,
  onCancel,
}: EnhancedReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: { file: File; preview: string }[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const preview = URL.createObjectURL(file);
        newImages.push({ file, preview });
      }
    });

    setImages([...images, ...newImages].slice(0, 5));
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = '请选择评分';
    }

    if (comment.trim().length < 10) {
      newErrors.comment = '评价内容至少需要10个字符';
    }

    if (comment.trim().length > 1000) {
      newErrors.comment = '评价内容不能超过1000个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images: images.length > 0 ? images.map(img => img.file) : undefined,
      });

      setIsSuccess(true);
      
      // Cleanup
      images.forEach(img => URL.revokeObjectURL(img.preview));
      
    } catch (error) {
      console.error('Failed to submit review:', error);
      setErrors({ submit: '提交失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass-holo rounded-2xl border border-neon-green/30 p-8 text-center">
        <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-10 h-10 text-neon-green" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">评价提交成功！</h3>
        <p className="text-gray-400 mb-6">感谢您的评价，这将帮助其他买家做出更好的选择。</p>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl hover:bg-neon-cyan/30 transition-all"
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="glass-holo rounded-2xl border border-neon-blue/20 p-6">
      {/* Product Info */}
      <div className="flex items-center gap-4 pb-6 mb-6 border-b border-neon-blue/20">
        {productImage && (
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-neon-blue/30">
            <Image
              src={productImage}
              alt={productName}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div>
          <p className="text-sm text-gray-400">评价商品</p>
          <h3 className="text-lg font-semibold text-white">{productName}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            商品评分 <span className="text-neon-pink">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110 p-1"
                >
                  {value <= (hoverRating || rating) ? (
                    <StarIcon className="h-10 w-10 text-yellow-400 drop-shadow-lg" />
                  ) : (
                    <StarOutlineIcon className="h-10 w-10 text-gray-600" />
                  )}
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <span className={`text-lg font-medium ${
                (hoverRating || rating) >= 4 ? 'text-neon-green' : 
                (hoverRating || rating) >= 3 ? 'text-yellow-400' : 'text-neon-pink'
              }`}>
                {ratingLabels[hoverRating || rating]}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-sm text-neon-pink mt-2 flex items-center gap-1">
              <ExclamationCircleIcon className="w-4 h-4" />
              {errors.rating}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            评价标题（可选）
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="用一句话总结您的评价"
            maxLength={50}
            className="w-full px-4 py-3 bg-white/5 border border-neon-blue/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 transition-all"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">{title.length}/50</p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
            详细评价 <span className="text-neon-pink">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) {
                setErrors({ ...errors, comment: '' });
              }
            }}
            rows={5}
            placeholder="分享您的使用体验，帮助其他买家了解这款产品..."
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all resize-none ${
              errors.comment 
                ? 'border-neon-pink/50 focus:border-neon-pink focus:ring-neon-pink/30' 
                : 'border-neon-blue/30 focus:border-neon-cyan/50 focus:ring-neon-cyan/30'
            }`}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.comment ? (
              <p className="text-sm text-neon-pink flex items-center gap-1">
                <ExclamationCircleIcon className="w-4 h-4" />
                {errors.comment}
              </p>
            ) : (
              <p className="text-xs text-gray-500">至少10个字符</p>
            )}
            <p className={`text-xs ${comment.length > 900 ? 'text-neon-pink' : 'text-gray-500'}`}>
              {comment.length}/1000
            </p>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            上传图片（可选）
          </label>
          <p className="text-xs text-gray-500 mb-3">
            最多上传5张图片，每张不超过5MB
          </p>

          {/* Image Preview */}
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((image, index) => (
              <div key={index} className="relative w-24 h-24 group">
                <Image
                  src={image.preview}
                  alt={`上传图片 ${index + 1}`}
                  fill
                  className="object-cover rounded-xl border border-neon-blue/30"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-neon-pink text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-pink/80"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {images.length < 5 && (
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-neon-blue/30 rounded-xl cursor-pointer hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
                <PhotoIcon className="h-8 w-8 text-gray-500" />
                <span className="text-xs text-gray-500 mt-1">添加图片</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                  disabled={isSubmitting}
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-xl">
            <p className="text-sm text-neon-pink flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-neon-blue/20">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white/5 border border-neon-blue/30 rounded-xl text-gray-300 hover:text-white hover:border-neon-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              取消
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-neon-cyan/30"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                提交中...
              </span>
            ) : (
              '提交评价'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
