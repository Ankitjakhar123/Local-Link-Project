import React, { memo } from 'react';

/**
 * Higher-order component for memoizing components to prevent unnecessary re-renders
 * Only re-renders when props actually change
 *
 * @param {React.ComponentType} Component The component to memoize
 * @param {Function} [propsAreEqual] Optional custom comparison function
 * @returns {React.ComponentType} Memoized component
 */
const Memoized = (Component, propsAreEqual) => {
  // Create display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  
  // Apply React.memo with optional custom comparison
  const MemoizedComponent = memo(Component, propsAreEqual);
  
  // Set display name for dev tools
  MemoizedComponent.displayName = `Memoized(${displayName})`;
  
  return MemoizedComponent;
};

/**
 * Default deep comparison function for complex objects
 * More thorough than React's shallow comparison
 * 
 * @param {Object} prevProps Previous props
 * @param {Object} nextProps Next props
 * @returns {boolean} Whether props are equal
 */
export const deepPropsComparison = (prevProps, nextProps) => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  // Different number of props
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  // Check each prop for equality
  return prevKeys.every(key => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];
    
    // Handle functions - assume they're equal if both are functions
    // This helps with inline function props
    if (typeof prevValue === 'function' && typeof nextValue === 'function') {
      return true;
    }
    
    // Handle arrays - deep compare elements
    if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
      if (prevValue.length !== nextValue.length) {
        return false;
      }
      
      return prevValue.every((val, i) => 
        JSON.stringify(val) === JSON.stringify(nextValue[i])
      );
    }
    
    // Handle objects - deep compare properties
    if (
      typeof prevValue === 'object' && 
      prevValue !== null && 
      typeof nextValue === 'object' && 
      nextValue !== null
    ) {
      return JSON.stringify(prevValue) === JSON.stringify(nextValue);
    }
    
    // Default comparison
    return prevValue === nextValue;
  });
};

/**
 * Create a memoized component with deep comparison
 * 
 * @param {React.ComponentType} Component The component to memoize
 * @returns {React.ComponentType} Deeply memoized component
 */
export const DeepMemoized = (Component) => {
  return Memoized(Component, deepPropsComparison);
};

export default Memoized; 