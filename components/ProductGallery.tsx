'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={handleZoomToggle}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={currentIndex === 0}
        />

        {/* Zoom Icon */}
        {!isZoomed && (
          <button
            onClick={handleZoomToggle}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            aria-label="Zoom image"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black bg-opacity-60 text-white text-sm rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Touch Swipe Hint for Mobile */}
      {images.length > 1 && (
        <p className="text-xs text-gray-500 text-center sm:hidden">
          Swipe left or right to view more images
        </p>
      )}
    </div>
  );
}
