import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingBag, BarChart, List, Grid, Search,
  PlusCircle, Edit, Trash2, ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { services } from '../data/services';
import { products } from '../data/products';
import { users } from '../data/users';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  
  // For services/products table
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate('/');
    }
    
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);
  
  // Basic stats for overview
  const stats = [
    { 
      title: 'Total Users', 
      value: users.length, 
      change: '+12%',
      icon: <Users className="text-primary" />
    },
    { 
      title: 'Services', 
      value: services.flatMap(s => s.categories).flatMap(c => c.services).length, 
      change: '+5%',
      icon: <Package className="text-secondary" />
    },
    { 
      title: 'Products', 
      value: products.length, 
      change: '+8%',
      icon: <ShoppingBag className="text-accent" />
    },
    { 
      title: 'Revenue', 
      value: '₹87,500', 
      change: '+15%',
      icon: <BarChart className="text-success" />
    }
  ];
  
  const recentBookings = users.flatMap(user => 
    (user.bookings || []).map(booking => ({
      ...booking,
      userName: user.name
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  
  // Sort and filter services
  const sortedServices = [...services]
    .sort((a, b) => {
      if (sortConfig.key === 'id') {
        return sortConfig.direction === 'ascending' ? a.id - b.id : b.id - a.id;
      } else if (sortConfig.key === 'name') {
        return sortConfig.direction === 'ascending' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return 0;
    })
    .filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Sort and filter products
  const sortedProducts = [...products]
    .sort((a, b) => {
      if (sortConfig.key === 'id') {
        return sortConfig.direction === 'ascending' ? a.id - b.id : b.id - a.id;
      } else if (sortConfig.key === 'name') {
        return sortConfig.direction === 'ascending' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortConfig.key === 'price') {
        return sortConfig.direction === 'ascending' ? a.price - b.price : b.price - a.price;
      } else if (sortConfig.key === 'rating') {
        return sortConfig.direction === 'ascending' ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    })
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 container">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/5">
          <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-lg">Admin Dashboard</h2>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center mb-1 ${
                  activeSection === 'overview' ? 'bg-primary text-white' : 'hover:bg-muted/50'
                }`}
              >
                <BarChart size={18} className="mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveSection('services')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center mb-1 ${
                  activeSection === 'services' ? 'bg-primary text-white' : 'hover:bg-muted/50'
                }`}
              >
                <Package size={18} className="mr-2" />
                Services
              </button>
              <button
                onClick={() => setActiveSection('products')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center mb-1 ${
                  activeSection === 'products' ? 'bg-primary text-white' : 'hover:bg-muted/50'
                }`}
              >
                <ShoppingBag size={18} className="mr-2" />
                Products
              </button>
              <button
                onClick={() => setActiveSection('users')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center mb-1 ${
                  activeSection === 'users' ? 'bg-primary text-white' : 'hover:bg-muted/50'
                }`}
              >
                <Users size={18} className="mr-2" />
                Users
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:w-4/5">
          {activeSection === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
              
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-card rounded-lg border border-border p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        {stat.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-success' : 'text-error'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
              
              {/* Recent bookings */}
              <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold">Recent Bookings</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {booking.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {booking.userName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {booking.serviceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {booking.date} at {booking.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed' 
                                ? 'bg-success/10 text-success' 
                                : booking.status === 'upcoming'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            ₹{booking.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Revenue chart would go here */}
            </div>
          )}
          
          {activeSection === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Services</h1>
                <button className="btn btn-primary flex items-center">
                  <PlusCircle size={16} className="mr-2" />
                  Add Service
                </button>
              </div>
              
              <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
                <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setView('list')}
                      className={`p-2 rounded ${view === 'list' ? 'bg-primary text-white' : 'bg-muted'}`}
                      aria-label="List view"
                    >
                      <List size={20} />
                    </button>
                    <button 
                      onClick={() => setView('grid')}
                      className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-white' : 'bg-muted'}`}
                      aria-label="Grid view"
                    >
                      <Grid size={20} />
                    </button>
                  </div>
                </div>
                
                {view === 'list' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('id')}
                          >
                            <div className="flex items-center">
                              ID
                              <ArrowUpDown size={14} className="ml-1" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center">
                              Name
                              <ArrowUpDown size={14} className="ml-1" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Categories
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sortedServices.map((service) => (
                          <tr key={service.id} className="hover:bg-muted/20">
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {service.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {service.name}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {service.categories.slice(0, 3).map((category, index) => (
                                  <span 
                                    key={index}
                                    className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs"
                                  >
                                    {category.name}
                                  </span>
                                ))}
                                {service.categories.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{service.categories.length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <button className="p-1 text-primary hover:bg-primary/10 rounded">
                                  <Edit size={16} />
                                </button>
                                <button className="p-1 text-error hover:bg-error/10 rounded">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {sortedServices.map((service) => (
                      <div 
                        key={service.id}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {service.categories.slice(0, 2).map((category, index) => (
                              <span 
                                key={index}
                                className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs"
                              >
                                {category.name}
                              </span>
                            ))}
                            {service.categories.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{service.categories.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button className="p-1 text-primary hover:bg-primary/10 rounded">
                              <Edit size={16} />
                            </button>
                            <button className="p-1 text-error hover:bg-error/10 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeSection === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <button className="btn btn-primary flex items-center">
                  <PlusCircle size={16} className="mr-2" />
                  Add Product
                </button>
              </div>
              
              <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
                <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setView('list')}
                      className={`p-2 rounded ${view === 'list' ? 'bg-primary text-white' : 'bg-muted'}`}
                      aria-label="List view"
                    >
                      <List size={20} />
                    </button>
                    <button 
                      onClick={() => setView('grid')}
                      className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-white' : 'bg-muted'}`}
                      aria-label="Grid view"
                    >
                      <Grid size={20} />
                    </button>
                  </div>
                </div>
                
                {view === 'list' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('id')}
                          >
                            <div className="flex items-center">
                              ID
                              <ArrowUpDown size={14} className="ml-1" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center">
                              Name
                              <ArrowUpDown size={14} className="ml-1" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Category
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('price')}
                          >
                            <div className="flex items-center">
                              Price
                              <ArrowUpDown size={14} className="ml-1" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('rating')}
                          >
                            <div className="flex items-center">
                              Rating
                              <ArrowUpDown size={14} className="ml-1" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sortedProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-muted/20">
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {product.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              ₹{product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {product.rating}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <button className="p-1 text-primary hover:bg-primary/10 rounded">
                                  <Edit size={16} />
                                </button>
                                <button className="p-1 text-error hover:bg-error/10 rounded">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {sortedProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              ₹{product.price}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                              {product.category}
                            </span>
                            <span className="text-xs text-warning flex items-center">
                              Rating: {product.rating}
                            </span>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button className="p-1 text-primary hover:bg-primary/10 rounded">
                              <Edit size={16} />
                            </button>
                            <button className="p-1 text-error hover:bg-error/10 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeSection === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <button className="btn btn-primary flex items-center">
                  <PlusCircle size={16} className="mr-2" />
                  Add User
                </button>
              </div>
              
              <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="input w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isAdmin 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.isAdmin ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.bookings ? user.bookings.length : 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button className="p-1 text-primary hover:bg-primary/10 rounded">
                                <Edit size={16} />
                              </button>
                              <button className="p-1 text-error hover:bg-error/10 rounded">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;