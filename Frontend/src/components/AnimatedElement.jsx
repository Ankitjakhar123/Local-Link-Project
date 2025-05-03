import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

// Animation variants for different effects
const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  slideUp: {
    hidden: { y: 50 },
    visible: { y: 0 }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

const AnimatedElement = forwardRef(({ 
  children, 
  className, 
  animation = 'fadeInUp', 
  delay = 0, 
  duration = 0.5,
  amount = 0.2,
  once = true,
  runOnScroll = true,
  ...props 
}, ref) => {
  
  // Select the animation variant
  const selectedVariant = variants[animation] || variants.fadeIn;
  
  // For container elements that need to stagger their children
  const isContainer = animation === 'staggerContainer';
  
  // Transition settings
  const transition = {
    duration: duration,
    delay: delay,
    ease: [0.25, 0.1, 0.25, 1] // Custom easing
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={selectedVariant}
      initial="hidden"
      animate={!runOnScroll ? "visible" : undefined}
      whileInView={runOnScroll ? "visible" : undefined}
      viewport={{ once: once, amount: amount }}
      transition={isContainer ? undefined : transition}
      {...props}
    >
      {children}
    </motion.div>
  );
});

AnimatedElement.displayName = 'AnimatedElement';

export default AnimatedElement; 