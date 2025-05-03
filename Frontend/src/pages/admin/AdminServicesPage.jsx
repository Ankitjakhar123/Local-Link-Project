import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, Star, MoreHorizontal, Search,
  Filter, AlertTriangle
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import ServiceForm from '../../components/admin/ServiceForm';
import { useNotification } from '../../components/NotificationSystem';

// Import sample data
import { services } from '../../data/services';

const AdminServicesPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Transform services data to a flat structure
      const flattenedServices = services.map(service => ({
        id: service.id,
        name: service.name,
        category: service.categories[0]?.name || 'Uncategorized',
        price: `₹${service.price}`,
        rating: service.rating || 0,
        bookings: Math.floor(Math.random() * 100),
        status: service.status || (Math.random() > 0.2 ? 'active' : 'inactive'),
        featured: service.featured || Math.random() > 0.7,
        image: service.image
      }));
      
      setServicesData(flattenedServices);
      setLoading(false);
    }, 800);
  }, []);
  
  const handleAddService = (formData) => {
    // In a real app, we would send this to an API
    console.log('Adding service:', formData);
    
    // Simulate API success
    const newService = {
      id: servicesData.length + 1,
      name: formData.name,
      category: formData.category,
      price: `₹${formData.basePrice}`,
      rating: 0,
      bookings: 0,
      status: formData.isActive ? 'active' : 'inactive',
      featured: formData.isPopular,
      image: formData.image instanceof File 
        ? URL.createObjectURL(formData.image) 
        : (typeof formData.image === 'string' ? formData.image : null)
    };
    
    setServicesData([...servicesData, newService]);
    setShowAddForm(false);
    
    showNotification({
      title: 'Service Added',
      message: `${formData.name} has been added successfully`,
      type: 'success',
      duration: 5000
    });
  };
  
  const handleUpdateService = (formData) => {
    // In a real app, we would send this to an API
    console.log('Updating service:', formData);
    
    // Simulate API success
    const updatedServices = servicesData.map(service => {
      if (service.id === editingService.id) {
        return {
          ...service,
          name: formData.name,
          category: formData.category,
          price: `₹${formData.basePrice}`,
          status: formData.isActive ? 'active' : 'inactive',
          featured: formData.isPopular,
          image: formData.image instanceof File 
            ? URL.createObjectURL(formData.image) 
            : (typeof formData.image === 'string' ? formData.image : service.image)
        };
      }
      return service;
    });
    
    setServicesData(updatedServices);
    setEditingService(null);
    
    showNotification({
      title: 'Service Updated',
      message: `${formData.name} has been updated successfully`,
      type: 'success',
      duration: 5000
    });
  };
  
  const handleDeleteService = (id) => {
    // In a real app, we would send this to an API
    console.log('Deleting service:', id);
    
    // Simulate API success
    const updatedServices = servicesData.filter(service => service.id !== id);
    setServicesData(updatedServices);
    setDeleteConfirm(null);
    
    showNotification({
      title: 'Service Deleted',
      message: 'The service has been deleted successfully',
      type: 'success',
      duration: 5000
    });
  };
  
  const tableColumns = [
    { 
      header: 'Service', 
      accessor: 'name',
      sortable: true,
      filterable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.category}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Price', 
      accessor: 'price', 
      sortable: true 
    },
    { 
      header: 'Rating', 
      accessor: 'rating', 
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <Star size={14} className={`${row.rating >= 4 ? 'text-warning fill-warning' : 'text-muted-foreground'} mr-1`} />
          <span>{row.rating.toFixed(1)}</span>
        </div>
      )
    },
    { 
      header: 'Bookings', 
      accessor: 'bookings', 
      sortable: true 
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.status === 'active' 
            ? 'bg-success/10 text-success border border-success/30' 
            : 'bg-muted text-muted-foreground border border-muted/30'
        }`}>
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      header: 'Featured', 
      accessor: 'featured', 
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: true, label: 'Featured' },
        { value: false, label: 'Not Featured' }
      ],
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.featured 
            ? 'bg-primary/10 text-primary border border-primary/30' 
            : 'bg-muted text-muted-foreground border border-muted/30'
        }`}>
          {row.featured ? 'Featured' : 'No'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/services/${row.id}`)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
            title="View Service"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => setEditingService(row)}
            className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
            title="Edit Service"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setDeleteConfirm(row)}
            className="p-1.5 text-muted-foreground hover:text-error rounded-lg hover:bg-error/10 transition-colors"
            title="Delete Service"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Services Management</h1>
            <p className="text-muted-foreground">Manage all services offered on the platform</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setEditingService(null);
                setShowAddForm(true);
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Service
            </button>
          </div>
        </div>
        
        {/* Forms */}
        {(showAddForm || editingService) && (
          <div className="bg-muted/5 border border-border rounded-xl p-6">
            {showAddForm ? (
              <>
                <ServiceForm 
                  onSubmit={handleAddService} 
                  onCancel={() => setShowAddForm(false)}
                  loading={false}
                />
              </>
            ) : editingService ? (
              <ServiceForm 
                initialData={{
                  name: editingService.name,
                  category: editingService.category.toLowerCase().replace(' ', '_'),
                  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum arcu at urna lobortis, sed tincidunt nulla eleifend.",
                  basePrice: parseInt(editingService.price.replace('₹', '')),
                  pricingUnit: 'per hour',
                  hasDiscount: false,
                  discountPercentage: 0,
                  image: editingService.image,
                  inclusions: [{ text: 'All materials included' }, { text: 'Professional service' }],
                  exclusions: [{ text: 'Additional repairs' }],
                  estimatedHours: 2,
                  availability: 'all_week',
                  isPopular: editingService.featured,
                  isActive: editingService.status === 'active'
                }}
                onSubmit={handleUpdateService}
                onCancel={() => setEditingService(null)}
                loading={false}
              />
            ) : null}
          </div>
        )}
        
        {/* Services Table */}
        <DataTable
          columns={tableColumns}
          data={servicesData}
          title="All Services"
          description={`${servicesData.length} services available`}
          loading={loading}
          searchable={true}
          filterable={true}
          pagination={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          selectable={false}
          onRowClick={(row) => navigate(`/admin/services/${row.id}`)}
        />
        
        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card border border-border rounded-xl shadow-lg p-6 max-w-md w-full">
              <div className="mb-6 flex items-center gap-4">
                <div className="p-3 bg-error/10 rounded-full">
                  <AlertTriangle size={24} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Delete Service</h3>
                  <p className="text-muted-foreground">
                    Are you sure you want to delete the service "{deleteConfirm.name}"? 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-error" 
                  onClick={() => handleDeleteService(deleteConfirm.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServicesPage; 