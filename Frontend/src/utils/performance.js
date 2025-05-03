// Performance optimization utilities
import React from 'react';
import { useEffect, useRef } from 'react';
import loadable from '@loadable/component';

/**
 * Dynamically import components using @loadable/component
 * Usage: const Component = lazyLoadComponent(() => import('./path/to/Component'))
 */
export const lazyLoadComponent = (importFunc) => loadable(importFunc, {
  fallback: <div className="loading-skeleton w-full h-full min-h-[200px]"></div>
});

/**
 * Intersection Observer hook for triggering animations when elements are visible
 * Usage: const ref = useIntersectionObserver(callback, { threshold: 0.1 })
 */
export const useIntersectionObserver = (callback, options = {}) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    }, { threshold: 0.1, ...options });
    
    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [callback, options]);
  
  return elementRef;
};

/**
 * Create a Web Worker for heavy computations
 * Usage: const worker = createWorker(workerFunction)
 */
export const createWorker = (workerFunction) => {
  const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

/**
 * Debounce function to limit how often a function can be called
 * Usage: const debouncedFn = debounce(originalFn, 300)
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit the rate at which a function can fire
 * Usage: const throttledFn = throttle(originalFn, 300)
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Image lazy loading helper
 * Usage: <img {...lazyLoadImage("path/to/image.jpg", "Alt text")} />
 */
export const lazyLoadImage = (src, alt, className = "") => ({
  src,
  alt,
  loading: "lazy",
  className,
  decoding: "async",
  onError: (e) => {
    e.target.onerror = null;
    e.target.src = '/path/to/fallback-image.jpg'; // Provide a fallback image path
  }
}); 