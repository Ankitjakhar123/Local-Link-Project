import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '../utils/performance';

/**
 * OptimizedImage component for better image loading performance
 * 
 * Features:
 * - Lazy loading using Intersection Observer
 * - WebP format with fallback
 * - Responsive image sizes with srcset
 * - Blur-up image loading effect
 * - Aspect ratio preservation to prevent layout shifts
 * 
 * @param {Object} props Component props
 * @param {string} props.src Image source path
 * @param {string} props.alt Alt text for the image
 * @param {string} props.className Additional CSS classes
 * @param {number} props.width Image width
 * @param {number} props.height Image height
 * @param {boolean} props.priority Whether to load the image with priority
 * @param {string} props.objectFit CSS object-fit property
 * @param {React.ReactNode} props.fallback Fallback component to show when image fails to load
 * @returns {React.ReactNode} The optimized image component
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  fallback = null,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  
  // Get the base path and file extension
  const basePath = src.substring(0, src.lastIndexOf('.')) || src;
  const ext = src.split('.').pop();
  
  // Generate srcset for responsive images if in the optimized directory
  const isOptimized = src.includes('/optimized/');
  
  // Use Intersection Observer to detect when the image is in the viewport
  const containerRef = useIntersectionObserver(
    (entry) => {
      if (entry.isIntersecting && imgRef.current && !isLoaded && !priority) {
        imgRef.current.loading = 'eager'; // Start loading when visible
      }
    },
    { rootMargin: '200px' } // Start loading when image is 200px from viewport
  );
  
  // Calculate aspect ratio to prevent layout shift
  const aspectRatio = height && width ? `${(height / width) * 100}%` : '56.25%'; // Default to 16:9
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  // Handle image error
  const handleError = () => {
    setError(true);
  };
  
  // Show fallback component or error state if image fails to load
  if (error) {
    return fallback || (
      <div 
        className={`bg-muted animate-pulse flex items-center justify-center ${className}`}
        style={{ width, height, aspectRatio: width ? undefined : aspectRatio }}
      >
        <span className="text-muted-foreground text-sm">Image not available</span>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        paddingBottom: height ? undefined : aspectRatio,
        background: 'rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Blur-up placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <picture>
        {/* WebP source */}
        {isOptimized ? (
          <>
            <source
              type="image/webp"
              srcSet={`
                ${basePath}_sm.webp 640w,
                ${basePath}_md.webp 1024w,
                ${basePath}_lg.webp 1920w,
                ${basePath}.webp
              `}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Original format source */}
            <source
              srcSet={`
                ${basePath}_sm.${ext} 640w,
                ${basePath}_md.${ext} 1024w,
                ${basePath}_lg.${ext} 1920w,
                ${basePath}.${ext}
              `}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </>
        ) : null}
        
        {/* Fallback image */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
          {...rest}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage; 