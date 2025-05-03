import React, { useState, useEffect } from 'react';
import FormBuilder from './FormBuilder';
import { X } from 'lucide-react';

const ServiceForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  loading = false,
  error = null
}) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  
  // Simulate fetching categories from API
  useEffect(() => {
    // In a real app, we would fetch categories from an API
    const mockCategories = [
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'appliance_repair', label: 'Appliance Repair' },
      { value: 'beauty', label: 'Beauty' },
      { value: 'health', label: 'Health & Wellness' },
      { value: 'tutoring', label: 'Tutoring' },
      { value: 'pest_control', label: 'Pest Control' },
      { value: 'carpentry', label: 'Carpentry' },
      { value: 'painting', label: 'Painting' },
      { value: 'gardening', label: 'Gardening' },
    ];
    
    setCategoryOptions(mockCategories);
  }, []);
  
  const handleSubmit = (values) => {
    // Submit form data
    onSubmit(values);
    
    // Show success message
    setSuccessMessage(initialData 
      ? 'Service updated successfully!'
      : 'Service created successfully!'
    );
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  // Form schema
  const formSchema = [
    {
      type: 'heading',
      label: initialData ? 'Edit Service' : 'Add New Service',
      description: initialData 
        ? 'Update the details of an existing service'
        : 'Enter the details to add a new service to the platform'
    },
    {
      type: 'text',
      name: 'name',
      label: 'Service Name',
      placeholder: 'Enter service name',
      required: true,
      validation: (value) => {
        if (!value || value.trim() === '') return 'Service name is required';
        if (value.length < 3) return 'Service name must be at least 3 characters';
        return null;
      }
    },
    {
      type: 'select',
      name: 'category',
      label: 'Main Category',
      placeholder: 'Select a category',
      options: categoryOptions,
      required: true,
      validation: (value) => !value ? 'Category is required' : null
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      placeholder: 'Describe the service...',
      rows: 4,
      required: true,
      validation: (value) => {
        if (!value || value.trim() === '') return 'Description is required';
        if (value.length < 20) return 'Description must be at least 20 characters';
        return null;
      }
    },
    {
      type: 'divider',
      label: 'Pricing'
    },
    {
      type: 'number',
      name: 'basePrice',
      label: 'Base Price (₹)',
      placeholder: 'Enter base price',
      required: true,
      min: 0,
      validation: (value) => {
        if (value === undefined || value === null) return 'Base price is required';
        if (value < 0) return 'Base price cannot be negative';
        return null;
      }
    },
    {
      type: 'text',
      name: 'pricingUnit',
      label: 'Pricing Unit',
      placeholder: 'e.g. per hour, per sqft',
      helpText: 'How is this service priced?'
    },
    {
      type: 'checkbox',
      name: 'hasDiscount',
      label: 'Offer Discount',
    },
    {
      type: 'number',
      name: 'discountPercentage',
      label: 'Discount Percentage (%)',
      placeholder: 'Enter discount percentage',
      min: 0,
      max: 100,
      disabled: (values) => !values.hasDiscount,
      validation: (value, values) => {
        if (values.hasDiscount) {
          if (value === undefined || value === null) return 'Discount percentage is required';
          if (value < 0 || value > 100) return 'Discount percentage must be between 0 and 100';
        }
        return null;
      }
    },
    {
      type: 'divider',
      label: 'Service Details'
    },
    {
      type: 'file',
      name: 'image',
      label: 'Service Image',
      accept: 'image/*',
      maxSize: '5MB',
      helpText: 'Upload a high-quality image representing the service',
      validation: (value, values) => {
        if (!initialData && !value) return 'Service image is required';
        return null;
      }
    },
    {
      type: 'array',
      name: 'inclusions',
      label: 'Service Inclusions',
      itemLabel: 'Inclusion',
      helpText: 'What is included in this service?',
      defaultItem: { text: '' },
      fields: [
        {
          name: 'text',
          label: 'Inclusion',
          type: 'text',
          placeholder: 'Enter service inclusion',
          required: true,
          validation: (value) => {
            if (!value || value.trim() === '') return 'Inclusion text is required';
            return null;
          }
        }
      ]
    },
    {
      type: 'array',
      name: 'exclusions',
      label: 'Service Exclusions',
      itemLabel: 'Exclusion',
      helpText: 'What is NOT included in this service?',
      defaultItem: { text: '' },
      fields: [
        {
          name: 'text',
          label: 'Exclusion',
          type: 'text',
          placeholder: 'Enter service exclusion',
          required: true,
          validation: (value) => {
            if (!value || value.trim() === '') return 'Exclusion text is required';
            return null;
          }
        }
      ]
    },
    {
      type: 'divider',
      label: 'Additional Information'
    },
    {
      type: 'number',
      name: 'estimatedHours',
      label: 'Estimated Hours',
      placeholder: 'Enter estimated hours',
      min: 0,
      helpText: 'Approximate time to complete the service'
    },
    {
      type: 'radio',
      name: 'availability',
      label: 'Service Availability',
      options: [
        { value: 'all_week', label: 'All Week (Mon-Sun)' },
        { value: 'weekdays', label: 'Weekdays Only (Mon-Fri)' },
        { value: 'weekends', label: 'Weekends Only (Sat-Sun)' },
        { value: 'custom', label: 'Custom' }
      ],
      required: true,
      validation: (value) => !value ? 'Service availability is required' : null
    },
    {
      type: 'checkbox',
      name: 'isPopular',
      label: 'Mark as Popular Service',
    },
    {
      type: 'checkbox',
      name: 'isActive',
      label: 'Service is Active',
    }
  ];
  
  // Initial form values
  const initialValues = initialData || {
    name: '',
    category: '',
    description: '',
    basePrice: 0,
    pricingUnit: 'per hour',
    hasDiscount: false,
    discountPercentage: 0,
    image: null,
    inclusions: [],
    exclusions: [],
    estimatedHours: 1,
    availability: 'all_week',
    isPopular: false,
    isActive: true
  };
  
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <FormBuilder
        schema={formSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
        errors={{}}
        submitText={initialData ? 'Update Service' : 'Create Service'}
        cancelText="Cancel"
        showCancelButton={true}
        successMessage={successMessage}
        errorMessage={error}
      />
    </div>
  );
};

export default ServiceForm; 