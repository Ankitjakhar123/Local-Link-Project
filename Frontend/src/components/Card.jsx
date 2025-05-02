import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  hoverable = false,
  animate = true,
  glitter = false,
  floating = false,
  glassmorphism = false,
  hoverGlow = false,
  staggerDelay = 0,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  
  const baseClasses = 'rounded-lg overflow-hidden';
  
  const variantClasses = {
    default: `bg-card text-card-foreground border ${isDarkMode ? 'border-muted shadow-[0_4px_25px_rgba(0,0,0,0.2)]' : 'border-border shadow-md'}`,
    flat: 'bg-card text-card-foreground',
    outlined: `bg-transparent text-card-foreground border ${isDarkMode ? 'border-muted/50' : 'border-border'}`,
    elevated: `bg-card text-card-foreground border-none ${isDarkMode ? 'shadow-[0_8px_30px_rgba(0,0,0,0.3)]' : 'shadow-lg'}`,
    gradient: 'bg-gradient-to-br from-primary/5 via-background to-secondary/5 text-card-foreground border-none',
    glass: 'backdrop-blur-md bg-background/30 border border-white/10 text-card-foreground'
  };
  
  // Special effect classes
  const hoverableClass = hoverable && !animate 
    ? isDarkMode 
      ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:translate-y-[-2px] transition-all duration-300' 
      : 'hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300'
    : '';
  
  const glitterClass = glitter ? 'glitter' : '';
  const floatingClass = floating ? 'floating' : '';
  const glassmorphismClass = glassmorphism ? 'glass-effect' : '';
  const glowClass = hoverGlow ? 'glow' : '';
  
  const selectedVariant = glassmorphism ? 'glass' : variant;
  
  const classes = `${baseClasses} ${variantClasses[selectedVariant]} ${hoverableClass} ${glitterClass} ${floatingClass} ${glassmorphismClass} ${glowClass} ${className}`;
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: staggerDelay
      }
    },
    hover: hoverable ? { 
      y: -10,
      boxShadow: isDarkMode 
        ? '0 20px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(156, 81, 161, 0.2)' 
        : '0 20px 25px rgba(0, 0, 0, 0.15)',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    } : {}
  };
  
  // If animation is disabled, return a regular div
  if (!animate) {
    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      className={classes}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : undefined}
      variants={cardVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card subcomponents
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className = '', gradient = false, ...props }) => {
  const gradientClass = gradient ? 'gradient-text' : '';
  return (
    <h3 className={`text-xl font-semibold ${gradientClass} ${className}`} {...props}>
      {children}
    </h3>
  );
};

Card.Description = ({ children, className = '', ...props }) => (
  <p className={`text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

export default Card; 