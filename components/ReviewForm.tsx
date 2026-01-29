'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmit: (review: {
    rating: number;
    comment: string;
    images?: string[];
  }) => Promise<void>;
  onCancel?: () => void;
}

export default function ReviewForm({
  productId,
  productName,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const t = useTranslations('product');
  const tCommon = useTranslations('common');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real implementation, upload to server/cloud storage
    // For now, create local URLs
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newImages.push(url);
      }
    });

    setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }

    if (comment.trim().length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
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
        comment: comment.trim(),
        images: images.length > 0 ? images : undefined,
      });

      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
      setErrors({});
    } catch (error) {
      console.error('Failed to submit review:', error);
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review for {productName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('rating')} <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                {value <= (hoverRating || rating) ? (
                  <StarIcon className="h-8 w-8 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="h-8 w-8 text-gray-300" />
                )}
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
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
            placeholder="Share your experience with this product..."
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.comment ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.comment ? (
              <p className="text-sm text-red-600">{errors.comment}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Minimum 10 characters ({comment.length}/1000)
              </p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Upload up to 5 images to help others see your experience
          </p>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {images.length < 5 && (
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
              <PhotoIcon className="h-5 w-5" />
              <span>Upload Photos</span>
              <input
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

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {tCommon('cancel')}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Submitting...' : tCommon('submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
