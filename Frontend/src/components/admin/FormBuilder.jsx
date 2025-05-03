import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Upload, Plus, Minus } from 'lucide-react';

const FormBuilder = ({
  schema,
  initialValues,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  loading = false,
  errors = {},
  showCancelButton = true,
  successMessage = null,
  errorMessage = null,
}) => {
  const [values, setValues] = useState(initialValues || {});
  const [touched, setTouched] = useState({});
  const [formErrors, setFormErrors] = useState(errors);
  const [isDirty, setIsDirty] = useState(false);
  
  useEffect(() => {
    setValues(initialValues || {});
  }, [initialValues]);
  
  useEffect(() => {
    setFormErrors(errors);
  }, [errors]);
  
  const handleChange = (field, value) => {
    setValues(prev => ({
      ...prev,
      [field.name]: value
    }));
    setIsDirty(true);
    
    // Clear field error when changing the value
    if (formErrors[field.name]) {
      setFormErrors(prev => ({
        ...prev,
        [field.name]: undefined
      }));
    }
  };
  
  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field.name]: true
    }));
    
    // Validate on blur
    if (field.validation) {
      const error = field.validation(values[field.name], values);
      if (error) {
        setFormErrors(prev => ({
          ...prev,
          [field.name]: error
        }));
      }
    }
  };
  
  const handleArrayFieldAdd = (field) => {
    const currentArray = values[field.name] || [];
    const defaultItem = field.defaultItem || {};
    setValues(prev => ({
      ...prev,
      [field.name]: [...currentArray, defaultItem]
    }));
    setIsDirty(true);
  };
  
  const handleArrayFieldRemove = (field, index) => {
    const currentArray = values[field.name] || [];
    setValues(prev => ({
      ...prev,
      [field.name]: currentArray.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };
  
  const handleArrayFieldChange = (field, index, value, subField) => {
    const currentArray = values[field.name] || [];
    const updatedArray = [...currentArray];
    
    if (subField) {
      updatedArray[index] = {
        ...updatedArray[index],
        [subField.name]: value
      };
    } else {
      updatedArray[index] = value;
    }
    
    setValues(prev => ({
      ...prev,
      [field.name]: updatedArray
    }));
    setIsDirty(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    let newErrors = {};
    let isValid = true;
    
    schema.forEach(field => {
      if (field.validation) {
        const error = field.validation(values[field.name], values);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
      
      // For array fields with nested validation
      if (field.type === 'array' && field.fields) {
        const array = values[field.name] || [];
        array.forEach((item, index) => {
          field.fields.forEach(subField => {
            if (subField.validation) {
              const error = subField.validation(item[subField.name], item);
              if (error) {
                newErrors[`${field.name}[${index}].${subField.name}`] = error;
                isValid = false;
              }
            }
          });
        });
      }
    });
    
    setFormErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({...acc, [key]: true}), {}));
    
    if (isValid) {
      onSubmit(values);
    }
  };
  
  const renderField = (field) => {
    const fieldError = formErrors[field.name];
    const isFieldTouched = touched[field.name];
    const showError = fieldError && isFieldTouched;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'url':
      case 'tel':
        return (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder={field.placeholder}
              disabled={field.disabled || loading}
              min={field.min}
              max={field.max}
              className={`w-full px-3 py-2 border ${showError ? 'border-error' : 'border-border'} rounded-md bg-background/50 focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
            />
            {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
            {showError && (
              <p className="mt-1 text-xs text-error flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldError}
              </p>
            )}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder={field.placeholder}
              disabled={field.disabled || loading}
              rows={field.rows || 4}
              className={`w-full px-3 py-2 border ${showError ? 'border-error' : 'border-border'} rounded-md bg-background/50 focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
            ></textarea>
            {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
            {showError && (
              <p className="mt-1 text-xs text-error flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldError}
              </p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled || loading}
              className={`w-full px-3 py-2 border ${showError ? 'border-error' : 'border-border'} rounded-md bg-background/50 focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
            {showError && (
              <p className="mt-1 text-xs text-error flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldError}
              </p>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="mb-4 flex items-center" key={field.name}>
            <input
              type="checkbox"
              name={field.name}
              checked={values[field.name] || false}
              onChange={(e) => handleChange(field, e.target.checked)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled || loading}
              className="rounded border-border text-primary focus:ring-primary mr-2"
            />
            <label className="text-sm">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            {showError && (
              <p className="ml-2 text-xs text-error flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldError}
              </p>
            )}
          </div>
        );
        
      case 'radio':
        return (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={values[field.name] === option.value}
                    onChange={() => handleChange(field, option.value)}
                    onBlur={() => handleBlur(field)}
                    disabled={field.disabled || loading}
                    className="border-border text-primary focus:ring-primary mr-2"
                  />
                  <label className="text-sm">{option.label}</label>
                </div>
              ))}
            </div>
            {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
            {showError && (
              <p className="mt-1 text-xs text-error flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldError}
              </p>
            )}
          </div>
        );
        
      case 'file':
        return (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <div className={`border ${showError ? 'border-error' : 'border-border'} rounded-md bg-background/50 overflow-hidden`}>
              <div className="p-4 flex flex-col items-center justify-center cursor-pointer text-center">
                <div className="mb-3 p-2 rounded-full bg-primary/10">
                  <Upload size={20} className="text-primary" />
                </div>
                <p className="text-sm mb-1">
                  Drag and drop your file here or <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {field.accept ? `Accepts ${field.accept.replace(/,/g, ', ')}` : 'Any file type'}
                  {field.maxSize && ` up to ${field.maxSize}`}
                </p>
                
                <input
                  type="file"
                  name={field.name}
                  accept={field.accept}
                  onChange={(e) => handleChange(field, e.target.files[0])}
                  onBlur={() => handleBlur(field)}
                  disabled={field.disabled || loading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {values[field.name] && (
                  <div className="mt-2 p-2 bg-primary/10 rounded-md flex items-center">
                    <span className="text-xs truncate max-w-[200px]">
                      {typeof values[field.name] === 'string' 
                        ? values[field.name].split('/').pop() 
                        : values[field.name].name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange(field, null);
                      }}
                      className="ml-2 text-muted-foreground hover:text-error"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
            {showError && (
              <p className="mt-1 text-xs text-error flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {fieldError}
              </p>
            )}
          </div>
        );
        
      case 'array':
        const arrayValues = values[field.name] || [];
        return (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            
            <div className="space-y-3">
              {arrayValues.length > 0 ? (
                arrayValues.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-border rounded-md bg-background/50 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleArrayFieldRemove(field, index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-error/10 text-error hover:bg-error/20"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="pt-2">
                      {field.fields ? (
                        <div className="space-y-3">
                          {field.fields.map(subField => {
                            const subFieldName = `${field.name}[${index}].${subField.name}`;
                            const subFieldError = formErrors[subFieldName];
                            const showSubError = !!subFieldError;
                            
                            return (
                              <div key={subFieldName}>
                                <label className="block text-xs font-medium mb-1">
                                  {subField.label}
                                  {subField.required && <span className="text-error ml-1">*</span>}
                                </label>
                                {subField.type === 'select' ? (
                                  <select
                                    value={item[subField.name] || ''}
                                    onChange={(e) => handleArrayFieldChange(field, index, e.target.value, subField)}
                                    className={`w-full px-3 py-1.5 text-sm border ${showSubError ? 'border-error' : 'border-border'} rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
                                  >
                                    <option value="">{subField.placeholder || 'Select an option'}</option>
                                    {subField.options.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={subField.type || 'text'}
                                    value={item[subField.name] || ''}
                                    onChange={(e) => handleArrayFieldChange(field, index, e.target.value, subField)}
                                    placeholder={subField.placeholder}
                                    className={`w-full px-3 py-1.5 text-sm border ${showSubError ? 'border-error' : 'border-border'} rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
                                  />
                                )}
                                {showSubError && (
                                  <p className="mt-1 text-xs text-error flex items-center">
                                    <AlertCircle size={10} className="mr-1" />
                                    {subFieldError}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={item || ''}
                          onChange={(e) => handleArrayFieldChange(field, index, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 border border-dashed border-border rounded-md bg-background/50 text-center text-muted-foreground">
                  No {field.label.toLowerCase()} added yet
                </div>
              )}
              
              <button
                type="button"
                onClick={() => handleArrayFieldAdd(field)}
                className="mt-2 px-3 py-1.5 text-sm rounded-md border border-primary text-primary hover:bg-primary/10 flex items-center justify-center"
              >
                <Plus size={16} className="mr-1" />
                Add {field.itemLabel || field.label}
              </button>
            </div>
            
            {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
          </div>
        );
        
      case 'divider':
        return (
          <div className="my-6" key={field.name || `divider-${Math.random()}`}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              {field.label && (
                <div className="relative flex justify-center">
                  <span className="px-2 bg-card text-xs text-muted-foreground">{field.label}</span>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'heading':
        return (
          <div className="mb-4" key={field.name || `heading-${Math.random()}`}>
            <h3 className="text-lg font-semibold">{field.label}</h3>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 rounded-md bg-success/10 border border-success/20 text-success">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-error/10 border border-error/20 text-error">
          {errorMessage}
        </div>
      )}
      
      {/* Form fields */}
      {schema.map(field => renderField(field))}
      
      {/* Form actions */}
      <div className="mt-6 flex justify-end space-x-2">
        {showCancelButton && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-border rounded-md hover:bg-muted/10 transition-colors"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={loading || (!isDirty && Object.keys(formErrors).length === 0)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : submitText}
        </button>
      </div>
    </form>
  );
};

export default FormBuilder; 