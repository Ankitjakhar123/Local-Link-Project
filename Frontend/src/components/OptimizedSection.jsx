import React, { useEffect, useState, useRef } from 'react';
import { useIntersectionObserver } from '../utils/performance';
import { motion } from 'framer-motion';

/**
 * OptimizedSection component that implements multiple performance optimizations
 * 
 * Features:
 * - Lazy loading using Intersection Observer
 * - Hardware-accelerated animations
 * - Deferred rendering of non-critical elements
 * - Only animates when visible in viewport
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @param {string} props.className Additional CSS classes
 * @param {string} props.id Section ID
 * @param {string} props.tag HTML tag to use for the section (default: 'section')
 * @param {boolean} props.animate Whether to animate the section on scroll
 * @param {Object} props.animationVariants Animation variants for motion component
 * @param {number} props.threshold Visibility threshold for animation (0-1)
 * @param {number} props.delay Animation delay in seconds
 * @param {boolean} props.deferLoad Whether to defer loading until visible
 * @param {React.ReactNode} props.fallback Component to render while loading
 * @returns {React.ReactNode} Optimized section component
 */
const OptimizedSection = ({
  children,
  className = '',
  id,
  tag: Tag = 'section',
  animate = true,
  animationVariants,
  threshold = 0.1,
  delay = 0,
  deferLoad = false,
  fallback = null,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(!deferLoad);
  const [isAnimated, setIsAnimated] = useState(false);
  const hasAnimated = useRef(false);
  
  // Default animation variants
  const defaultVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: 'blur(5px)',
      transform: 'translateZ(0)', // Hardware acceleration
      willChange: 'opacity, transform', // Hint to browser
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transform: 'translateZ(0)', // Hardware acceleration
      transition: { 
        duration: 0.7, 
        ease: [0.25, 0.1, 0.25, 1.0], 
        delay,
        staggerChildren: 0.1,
      },
      willChange: 'auto', // Return to auto when animation complete
    },
  };
  
  // Use custom variants or default
  const variants = animationVariants || defaultVariants;
  
  // Use Intersection Observer to detect when section is visible
  const sectionRef = useIntersectionObserver(
    (entry) => {
      // Set visible when section enters viewport
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
      
      // Trigger animation only once when section is visible
      if (entry.isIntersecting && !hasAnimated.current && animate) {
        setIsAnimated(true);
        hasAnimated.current = true;
      }
    },
    { threshold, rootMargin: '50px' }
  );
  
  // For SSR support, set visible after mount if not deferring
  useEffect(() => {
    if (!deferLoad && !isVisible) {
      setIsVisible(true);
    }
  }, [deferLoad, isVisible]);
  
  // Handle non-visible state when deferring load
  if (!isVisible && deferLoad) {
    return fallback || <div className={className} style={{ minHeight: '100px' }} />;
  }
  
  // Render with or without animation
  if (animate) {
    return (
      <motion.div
        ref={sectionRef}
        id={id}
        as={Tag}
        className={`${className} transform-gpu`} // Add transform-gpu for hardware acceleration
        initial="hidden"
        animate={isAnimated ? "visible" : "hidden"}
        variants={variants}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
  
  // Render without animation
  return (
    <Tag
      ref={sectionRef}
      id={id}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/**
 * Optimized child item that animates in a staggered sequence
 */
export const OptimizedItem = ({ children, className = '', delay = 0, ...rest }) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transform: 'translateZ(0)', // Hardware acceleration
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      transform: 'translateZ(0)', // Hardware acceleration
      transition: { 
        duration: 0.5, 
        delay,
      },
    },
  };
  
  return (
    <motion.div
      className={`${className} transform-gpu`} // Add transform-gpu for hardware acceleration
      variants={itemVariants}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default OptimizedSection; 