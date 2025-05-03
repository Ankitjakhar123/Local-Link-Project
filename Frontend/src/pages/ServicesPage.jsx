import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Filter, X, Package, Wrench, Star } from 'lucide-react';
import { services } from '../data/services';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';
import { motion } from 'framer-motion';

const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');

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
    
    // Apply sorting
    if (sortBy === 'price-low') {
      results = [...results].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      results = [...results].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    setFilteredServices(results);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popular');
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  };

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
              <form onSubmit={handleSearchSubmit} className="flex-1">
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
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline flex items-center gap-2 border-2 border-primary/20 hover:border-primary/70 hover:bg-primary/5"
                >
                  <Filter size={18} />
                  Filters
                </button>
                
                {(searchQuery || selectedCategory !== 'all' || sortBy !== 'popular') && (
                  <button 
                    onClick={clearFilters}
                    className="btn btn-outline flex items-center gap-2 text-muted-foreground border-2 border-muted/30 hover:border-accent/50 hover:text-accent"
                  >
                    <X size={18} />
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter options */}
            {showFilters && (
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
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                            selectedCategory === category
                              ? 'bg-primary text-white shadow-lg shadow-primary/20'
                              : 'bg-card hover:bg-primary/10 border border-border'
                          }`}
                        >
                          {category === 'all' ? 'All Categories' : category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sort options */}
                  <div>
                    <h3 className="font-medium mb-3 text-sm uppercase tracking-wider">Sort By</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'popular', label: 'Most Popular' },
                        { id: 'rating', label: 'Highest Rating' },
                        { id: 'price-low', label: 'Price: Low to High' },
                        { id: 'price-high', label: 'Price: High to Low' }
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSortBy(option.id)}
                          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                            sortBy === option.id
                              ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20'
                              : 'bg-card hover:bg-secondary/10 border border-border'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatedElement>

        {/* Services grid */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-accent border-l-transparent animate-spin animation-delay-500"></div>
            </div>
            <p className="mt-6 text-muted-foreground">Loading services...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <AnimatedElement
                key={service.id}
                className="group h-full"
                animation="fadeInUp"
                delay={index * 0.05}
                custom={index}
              >
                <Link 
                  to={`/services/${service.id}`}
                  className="block h-full"
                >
                  <div className="card-3d h-full bg-card rounded-2xl overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-all duration-500">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
                      
                      {/* Rating badge */}
                      {service.rating && (
                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-primary px-2 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star size={14} className="fill-primary text-primary mr-1" /> {service.rating}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{service.name}</h3>
                      <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                      
                      {/* Category tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.categories.slice(0, 3).map((category, index) => (
                          <span 
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
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
                        <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                          <ArrowRight className="text-primary transition-transform group-hover:translate-x-1" size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedElement>
            ))}
          </div>
        ) : (
          <AnimatedElement animation="fadeIn" className="text-center py-20">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-10 border border-primary/10 max-w-2xl mx-auto">
              <Package size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-3">No services found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any services matching your search criteria.
              </p>
              <button onClick={clearFilters} className="btn btn-primary px-6">
                Clear Filters
              </button>
            </div>
          </AnimatedElement>
        )}
      </SectionContainer>
    </div>
  );
};

export default ServicesPage;