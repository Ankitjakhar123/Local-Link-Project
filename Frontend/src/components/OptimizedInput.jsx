import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { debounce } from '../utils/performance';

/**
 * Optimized Input component that reduces re-renders during typing
 * 
 * Features:
 * - Controlled locally but reports to parent only when needed
 * - Debounced onChange to reduce state updates during fast typing
 * - Memoized to prevent unnecessary re-renders
 * - Supports validation with visual feedback
 * 
 * @param {Object} props Component props
 * @param {string} props.id Input ID
 * @param {string} props.name Input name
 * @param {string} props.type Input type (text, email, password, etc.)
 * @param {string} props.label Input label
 * @param {string} props.value Initial input value
 * @param {Function} props.onChange Handler for value changes (receives name and value)
 * @param {Function} props.onBlur Handler for blur events
 * @param {Function} props.validate Validation function (receives value, returns error message or null)
 * @param {number} props.debounceTime Time in ms to debounce onChange events (0 to disable)
 * @param {string} props.className Additional CSS classes
 * @param {Object} props.inputProps Additional props for the input element
 * @returns {React.ReactNode} Optimized input component
 */
const OptimizedInput = ({
  id,
  name,
  type = 'text',
  label,
  value: initialValue = '',
  onChange,
  onBlur,
  validate,
  debounceTime = 300,
  className = '',
  ...inputProps
}) => {
  // Local state for immediate feedback
  const [localValue, setLocalValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Keep track of whether the component is mounted
  const isMounted = useRef(true);
  
  // Update local value when prop value changes
  useEffect(() => {
    if (initialValue !== localValue && !isFocused) {
      setLocalValue(initialValue);
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [initialValue, isFocused]);
  
  // Create debounced onChange handler
  const debouncedOnChange = useRef(
    debounce((name, value) => {
      if (isMounted.current && onChange) {
        onChange(name, value);
      }
    }, debounceTime)
  ).current;
  
  // Handle input changes
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Set dirty state on first change
    if (!isDirty) {
      setIsDirty(true);
    }
    
    // Validate if needed
    if (validate && isDirty) {
      const validationError = validate(newValue);
      setError(validationError || '');
    }
    
    // Report to parent through debounced handler
    if (debounceTime > 0) {
      debouncedOnChange(name, newValue);
    } else if (onChange) {
      onChange(name, newValue);
    }
  }, [name, onChange, debouncedOnChange, validate, isDirty, debounceTime]);
  
  // Handle blur events
  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    setIsDirty(true);
    
    // Validate on blur
    if (validate) {
      const validationError = validate(localValue);
      setError(validationError || '');
    }
    
    // Call parent onBlur if provided
    if (onBlur) {
      onBlur(e);
    }
    
    // Ensure parent has latest value
    if (onChange && localValue !== initialValue) {
      onChange(name, localValue);
    }
  }, [name, localValue, initialValue, validate, onBlur, onChange]);
  
  // Handle focus events
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-2 text-sm font-medium transition-all duration-200
            ${error ? 'text-error' : isFocused ? 'text-primary' : 'text-foreground'}
          `}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`input w-full transition-all duration-200
            ${error ? 'border-error focus:ring-error' : ''}
            ${isFocused ? 'border-primary focus:ring-primary' : ''}
          `}
          {...inputProps}
        />
      </div>
      
      {error && isDirty && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(OptimizedInput); 