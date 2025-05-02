import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Filter, X } from 'lucide-react';
import { services } from '../data/services';

const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // All unique categories from services
  const categories = ['all', ...new Set(services.flatMap(service => 
    service.categories.map(cat => cat.name)
  ))];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = services;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(service => 
        service.name.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query) ||
        service.categories.some(cat => 
          cat.name.toLowerCase().includes(query) ||
          cat.services.some(s => s.name.toLowerCase().includes(query))
        )
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(service => 
        service.categories.some(cat => cat.name === selectedCategory)
      );
    }
    
    setFilteredServices(results);
  }, [searchQuery, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Our Services</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse through our extensive range of professional services for your home and personal needs. 
            All services come with our satisfaction guarantee.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </form>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center md:w-auto"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            
            {(searchQuery || selectedCategory !== 'all') && (
              <button 
                onClick={clearFilters}
                className="btn btn-outline flex items-center text-muted-foreground hover:text-foreground md:w-auto"
              >
                <X size={18} className="mr-2" />
                Clear Filters
              </button>
            )}
          </div>
          
          {/* Filter options */}
          {showFilters && (
            <div className="bg-card p-4 rounded-lg border border-border mb-4 animate-slide-down">
              <h3 className="font-medium mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Services grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading services...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <Link 
                key={service.id}
                to={`/services/${service.id}`}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  {/* Category tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.categories.slice(0, 3).map((category, index) => (
                      <span 
                        key={index}
                        className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs"
                      >
                        {category.name}
                      </span>
                    ))}
                    {service.categories.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{service.categories.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-medium">View Details</span>
                    <ArrowRight className="text-primary transition-transform group-hover:translate-x-1" size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No services found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any services matching your search criteria.
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;