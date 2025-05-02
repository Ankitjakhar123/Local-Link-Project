import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  className = '',
  full = false,
  icon,
  iconPosition = 'left',
  animate = true,
  glowEffect = false,
  glitter = false,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  
  const baseClasses = 'rounded-md font-medium focus:outline-none inline-flex items-center justify-center overflow-hidden';
  
  const variantClasses = {
    primary: `bg-primary text-primary-foreground hover:bg-primary/90 ${isDarkMode ? 'shadow-[0_0_15px_rgba(156,81,161,0.25)]' : 'shadow-md'} hover:shadow-lg`,
    secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/90 ${isDarkMode ? 'shadow-[0_0_15px_rgba(217,70,161,0.25)]' : 'shadow-md'} hover:shadow-lg`,
    accent: `bg-accent text-accent-foreground hover:bg-accent/90 ${isDarkMode ? 'shadow-[0_0_15px_rgba(255,153,0,0.25)]' : 'shadow-md'} hover:shadow-lg`,
    outline: `border border-muted bg-transparent hover:bg-accent/10 text-foreground ${isDarkMode ? 'hover:border-accent' : 'hover:border-primary'}`,
    ghost: 'bg-transparent hover:bg-muted/50 text-foreground',
    link: 'bg-transparent hover:underline text-primary p-0',
    glass: `backdrop-blur-md bg-primary/20 text-foreground border border-primary/20 hover:bg-primary/30 ${isDarkMode ? 'shadow-[0_0_15px_rgba(156,81,161,0.15)]' : ''}`,
    gradient: 'text-white bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2'
  };
  
  const widthClass = full ? 'w-full' : '';
  
  const iconClasses = icon 
    ? `${iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'} gap-2` 
    : '';
    
  const glowClass = glowEffect ? 'glow' : '';
  const glitterClass = glitter ? 'glitter' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${iconClasses} ${glowClass} ${glitterClass} ${className}`;
  
  // Animation variants
  const buttonVariants = {
    hover: { 
      scale: 1.03,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { 
      scale: 0.97,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 10 
      }
    },
    initial: {
      scale: 1
    }
  };
  
  // If animation is disabled, return a regular button
  if (!animate) {
    return (
      <button className={classes} {...props}>
        {icon && icon}
        {children}
      </button>
    );
  }
  
  return (
    <motion.button
      className={classes}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      {...props}
    >
      {icon && icon}
      {children}
    </motion.button>
  );
};

export default Button; 