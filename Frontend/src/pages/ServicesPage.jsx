import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Filter, X, Package, Wrench, Star, Bookmark, ChevronDown, Sparkles } from 'lucide-react';
import { services } from '../data/services';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';
import { motion } from 'framer-motion';
import ServiceCard from '../components/ServiceCard';
import { useNotification } from '../components/NotificationSystem';
import { serviceService } from '../services/service.service';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'salon', name: 'Salon & Spa' },
    { id: 'appliance', name: 'Appliance Repair' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'pest-control', name: 'Pest Control' }
  ];

  // Fetch services from backend
  useEffect(() => {
    fetchServices();
  }, [activeCategory, activeFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Construct query parameters
      const query = {};
      
      if (activeCategory !== 'all') {
        query.category = activeCategory;
      }
      
      if (activeFilter === 'popular') {
        query.sort = 'rating';
      } else if (activeFilter === 'price-low') {
        query.sort = 'price';
      } else if (activeFilter === 'price-high') {
        query.sort = '-price';
      } else if (activeFilter === 'newest') {
        query.sort = '-createdAt';
      }
      
      const response = await serviceService.getServices(query);
      setServices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
      showNotification({
        title: 'Error',
        message: 'Failed to load services',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await serviceService.searchServices(searchQuery);
      setServices(response.data);
      
      if (response.data.length === 0) {
        showNotification({
          title: 'No Results',
          message: `No services found matching "${searchQuery}"`,
          type: 'info'
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      showNotification({
        title: 'Search Failed',
        message: 'Failed to search services',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchServices();
  };

  // Filter and sort displayed services based on user selections
  const filteredServices = searchQuery.trim() 
    ? services 
    : services;

  return (
    <div className="bg-background dark">
      {/* Hero Section */}
      <PageHeader 
        title="Our Services"
        description="Browse through our extensive range of professional services for your home and personal needs."
        icon={Wrench}
        backgroundImage="https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      />

      {/* Services Content */}
      <SectionContainer 
        className="max-w-7xl mx-auto"
        backgroundElements={false}
      >
        {/* Search and filters */}
        <AnimatedElement animation="fadeInDown" className="mb-8">
          <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input w-full pl-12 pr-4 py-3 bg-background/50 backdrop-blur-md border-2 border-primary/10 focus:border-primary/30 rounded-xl"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" size={20} />
                </div>
              </form>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveFilter('popular')}
                  className="btn btn-outline flex items-center gap-2 border-2 border-primary/20 hover:border-primary/70 hover:bg-primary/5"
                >
                  <Filter size={18} />
                  Popular
                </button>
                
                <button 
                  onClick={() => setActiveFilter('price-low')}
                  className="btn btn-outline flex items-center gap-2 border-2 border-primary/20 hover:border-primary/70 hover:bg-primary/5"
                >
                  <Filter size={18} />
                  Price: Low to High
                </button>
                
                <button 
                  onClick={() => setActiveFilter('price-high')}
                  className="btn btn-outline flex items-center gap-2 border-2 border-primary/20 hover:border-primary/70 hover:bg-primary/5"
                >
                  <Filter size={18} />
                  Price: High to Low
                </button>
                
                <button 
                  onClick={() => setActiveFilter('newest')}
                  className="btn btn-outline flex items-center gap-2 border-2 border-primary/20 hover:border-primary/70 hover:bg-primary/5"
                >
                  <Filter size={18} />
                  Newest
                </button>
              </div>
            </div>
            
            {/* Filter options */}
            {activeFilter !== 'popular' && (
              <motion.div 
                className="bg-card/80 backdrop-blur-md p-6 rounded-xl border border-border mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Category filter */}
                  <div className="flex-1">
                    <h3 className="font-medium mb-3 text-sm uppercase tracking-wider">Filter by Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveCategory(category.id)}
                          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                            activeCategory === category.id
                              ? 'bg-primary text-white shadow-lg shadow-primary/20'
                              : 'bg-card hover:bg-primary/10 border border-border'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatedElement>

        {/* Featured services */}
        {!searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Services</h2>
              <div className="flex items-center text-primary">
                <Sparkles size={16} className="mr-1" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeletons
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-card animate-pulse rounded-lg h-64"></div>
                ))
              ) : error ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-error">{error}</p>
                  <button 
                    onClick={fetchServices}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredServices.length > 0 ? (
                filteredServices.slice(0, 3).map((service, index) => (
                  <ServiceCard key={service._id} service={service} index={index} premium={true} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p>No featured services found.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* All services */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery ? `Search Results: ${searchQuery}` : 'All Services'}
            </h2>
            {!loading && (
              <span className="text-sm text-muted-foreground">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-card animate-pulse rounded-lg h-64"></div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-error">{error}</p>
                <button 
                  onClick={fetchServices}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>No services found. Try adjusting your filters or search query.</p>
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default ServicesPage;