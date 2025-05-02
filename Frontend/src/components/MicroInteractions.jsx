import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Custom Button with micro-interactions
export const InteractiveButton = ({ 
  children, 
  type = 'button',
  variant = 'primary', // primary, secondary, accent, outline
  size = 'md', // sm, md, lg
  disabled = false,
  className = '',
  magneticEffect = true,
  rippleEffect = true,
  glowEffect = false,
  onClick,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  
  // Generate a unique ID for the ripple
  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Handle magnetic effect
  const handleMouseMove = (e) => {
    if (disabled || !magneticEffect) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calculate center of the button
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to center
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    
    // Calculate magnetic pull (max 10px movement)
    const magneticPullX = distanceX * 0.2;
    const magneticPullY = distanceY * 0.2;
    
    // Update mouse position for magnetic effect
    setMousePosition({
      x: magneticPullX,
      y: magneticPullY
    });
  };
  
  // Handle ripple effect
  const handleMouseDown = (e) => {
    if (disabled || !rippleEffect) return;
    
    setIsPressed(true);
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calculate ripple position relative to button
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    
    // Add new ripple
    const newRipple = {
      id: generateUniqueId(),
      x: rippleX,
      y: rippleY
    };
    
    setRipples([...ripples, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
    
    // Call the onClick handler
    if (onClick) onClick(e);
  };
  
  // Reset button state
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setMousePosition({ x: 0, y: 0 });
  };
  
  // Determine button styles based on variant
  let buttonClasses = 'relative overflow-hidden font-medium rounded-xl focus:outline-none transition-all';
  
  // Add size classes
  switch (size) {
    case 'sm':
      buttonClasses += ' px-3 py-1.5 text-sm';
      break;
    case 'lg':
      buttonClasses += ' px-6 py-3.5 text-lg';
      break;
    default: // md
      buttonClasses += ' px-5 py-2.5';
  }
  
  // Add variant classes
  switch (variant) {
    case 'secondary':
      buttonClasses += ` bg-secondary text-secondary-foreground ${
        disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:bg-secondary/90'
      }`;
      break;
    case 'accent':
      buttonClasses += ` bg-accent text-accent-foreground ${
        disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:bg-accent/90'
      }`;
      break;
    case 'outline':
      buttonClasses += ` border-2 ${
        disabled 
          ? 'border-muted/50 text-muted-foreground opacity-60 cursor-not-allowed' 
          : 'border-primary text-primary bg-transparent hover:bg-primary/10'
      }`;
      break;
    default: // primary
      buttonClasses += ` bg-primary text-primary-foreground ${
        disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:bg-primary/90'
      }`;
  }
  
  // Custom shadow based on variant and theme
  let shadowClass = '';
  if (!disabled && isDarkMode) {
    switch (variant) {
      case 'secondary':
        shadowClass = isHovered ? 'shadow-[0_0_20px_rgba(76,212,245,0.3)]' : '';
        break;
      case 'accent':
        shadowClass = isHovered ? 'shadow-[0_0_20px_rgba(255,95,159,0.3)]' : '';
        break;
      case 'outline':
        shadowClass = '';
        break;
      default: // primary
        shadowClass = isHovered ? 'shadow-[0_0_20px_rgba(132,90,223,0.3)]' : '';
    }
  }
  
  return (
    <motion.button
      type={type}
      className={`${buttonClasses} ${shadowClass} ${className}`}
      disabled={disabled}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isPressed ? 0.97 : isHovered ? 1.03 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          className="absolute rounded-full bg-white/20 animate-ripple"
        />
      ))}
      
      {/* Glow effect overlay for dark mode */}
      {glowEffect && isDarkMode && !disabled && (
        <motion.div 
          className={`absolute inset-0 -z-1 rounded-xl opacity-0 pointer-events-none ${
            variant === 'primary' ? 'bg-primary' : 
            variant === 'secondary' ? 'bg-secondary' : 
            variant === 'accent' ? 'bg-accent' : 'bg-primary'
          }`}
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ filter: 'blur(8px)' }}
        />
      )}
    </motion.button>
  );
};

// Custom Input with micro-interactions
export const InteractiveInput = ({ 
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  error,
  disabled = false,
  className = '',
  glowEffect = true,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine if the input has a value for floating label
  const hasValue = value && value.toString().trim().length > 0;
  
  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={id || name}
          className={`absolute left-3 transition-all pointer-events-none ${
            isFocused || hasValue
              ? 'text-xs -top-2.5 px-1 bg-background text-primary z-10'
              : 'text-muted-foreground top-3 text-base'
          }`}
          initial={false}
          animate={{
            y: isFocused || hasValue ? 0 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
          }}
        >
          {label}
        </motion.label>
      )}
      
      {/* Input wrapper for animations */}
      <div className="relative">
        <input
          type={type}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={isFocused || !label ? placeholder : ''}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 rounded-xl transition-all
            ${label ? 'pt-4 pb-2' : ''} 
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''} 
            ${error ? 'border-error focus:border-error ring-error/30' : 
              isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-muted/50 hover:border-primary/30'} 
            ${isDarkMode 
              ? 'bg-muted/30 border-2 text-foreground' 
              : 'bg-muted/5 border-2 text-foreground'
            } focus:outline-none`}
          {...props}
        />
        
        {/* Glow effect overlay for dark mode */}
        {glowEffect && isDarkMode && isFocused && !disabled && (
          <motion.div 
            className="absolute inset-0 -z-1 rounded-xl bg-primary opacity-0 pointer-events-none"
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ filter: 'blur(8px)' }}
          />
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <motion.p 
          className="mt-1 text-sm text-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Checkbox with micro-interactions
export const InteractiveCheckbox = ({ 
  label, 
  checked = false, 
  onChange, 
  id,
  name,
  disabled = false,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center">
        {/* Hidden actual checkbox */}
        <input
          type="checkbox"
          id={id || name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute w-0 h-0 opacity-0"
        />
        
        {/* Custom checkbox */}
        <motion.div 
          className={`w-5 h-5 flex items-center justify-center rounded border-2 cursor-pointer
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${checked 
              ? 'bg-primary border-primary' 
              : isDarkMode
                ? 'border-muted/70 hover:border-primary/70'
                : 'border-muted/70 hover:border-primary/70'
            }
          `}
          animate={{
            scale: isHovered ? 1.1 : 1,
            borderColor: checked ? 'hsl(var(--primary))' : isHovered ? 'hsl(var(--primary) / 0.7)' : 'hsl(var(--muted) / 0.7)'
          }}
          onClick={() => !disabled && onChange && onChange({ target: { checked: !checked } })}
        >
          {checked && (
            <motion.svg 
              viewBox="0 0 24 24" 
              width="14" 
              height="14" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.path 
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          )}
        </motion.div>
        
        {/* Glow effect for dark mode */}
        {isDarkMode && checked && (
          <div 
            className="absolute inset-0 bg-primary rounded-sm opacity-20 pointer-events-none"
            style={{ filter: 'blur(8px)' }}
          />
        )}
      </div>
      
      {/* Label */}
      {label && (
        <label 
          htmlFor={id || name} 
          className={`ml-2 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

// Radio button with micro-interactions
export const InteractiveRadio = ({ 
  label, 
  checked = false, 
  onChange, 
  value,
  id,
  name,
  disabled = false,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center">
        {/* Hidden actual radio */}
        <input
          type="radio"
          id={id || `${name}-${value}`}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute w-0 h-0 opacity-0"
        />
        
        {/* Custom radio */}
        <motion.div 
          className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${checked 
              ? 'border-primary' 
              : isDarkMode
                ? 'border-muted/70 hover:border-primary/70'
                : 'border-muted/70 hover:border-primary/70'
            }
          `}
          animate={{
            scale: isHovered ? 1.1 : 1,
            borderColor: checked ? 'hsl(var(--primary))' : isHovered ? 'hsl(var(--primary) / 0.7)' : 'hsl(var(--muted) / 0.7)'
          }}
          onClick={() => !disabled && onChange && onChange({ target: { value, checked: true } })}
        >
          {checked && (
            <motion.div 
              className="w-2.5 h-2.5 rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>
        
        {/* Glow effect for dark mode */}
        {isDarkMode && checked && (
          <div 
            className="absolute inset-0 bg-primary rounded-full opacity-20 pointer-events-none"
            style={{ filter: 'blur(8px)' }}
          />
        )}
      </div>
      
      {/* Label */}
      {label && (
        <label 
          htmlFor={id || `${name}-${value}`} 
          className={`ml-2 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

// Select dropdown with micro-interactions
export const InteractiveSelect = ({ 
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  className = '',
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Determine if the select has a value for floating label
  const hasValue = value !== undefined && value !== '';
  
  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={id || name}
          className={`absolute left-3 transition-all pointer-events-none ${
            isFocused || hasValue
              ? 'text-xs -top-2.5 px-1 bg-background text-primary z-10'
              : 'text-muted-foreground top-3 text-base'
          }`}
          initial={false}
          animate={{
            y: isFocused || hasValue ? 0 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
          }}
        >
          {label}
        </motion.label>
      )}
      
      {/* Select wrapper */}
      <div className="relative">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsOpen(false);
          }}
          className={`w-full px-4 py-3 rounded-xl appearance-none transition-all
            ${label ? 'pt-4 pb-2' : ''} 
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''} 
            ${error ? 'border-error focus:border-error ring-error/30' : 
              isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-muted/50 hover:border-primary/30'} 
            ${isDarkMode 
              ? 'bg-muted/30 border-2 text-foreground' 
              : 'bg-muted/5 border-2 text-foreground'
            } focus:outline-none`}
          {...props}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <motion.svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground"
            animate={{ 
              rotate: isOpen ? 180 : 0,
              y: isOpen ? -2 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <path 
              d="M2.5 4.5L6 8L9.5 4.5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
        
        {/* Glow effect overlay for dark mode */}
        {isDarkMode && isFocused && !disabled && (
          <motion.div 
            className="absolute inset-0 -z-1 rounded-xl bg-primary opacity-0 pointer-events-none"
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ filter: 'blur(8px)' }}
          />
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <motion.p 
          className="mt-1 text-sm text-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Export all interactive components
const MicroInteractions = {
  Button: InteractiveButton,
  Input: InteractiveInput,
  Checkbox: InteractiveCheckbox,
  Radio: InteractiveRadio,
  Select: InteractiveSelect
};

export default MicroInteractions; 