import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const FilterableGallery = ({ items = [], title = "Our Services", subtitle = "Browse all our services" }) => {
  const { isDarkMode } = useTheme();
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract all categories from items
  const allCategories = [...new Set(items.flatMap(item => item.categories || []))];
  
  // Apply filters and search
  useEffect(() => {
    let result = [...items];
    
    // Apply category filters
    if (activeFilters.length > 0) {
      result = result.filter(item => 
        activeFilters.some(filter => (item.categories || []).includes(filter))
      );
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        item => item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(result);
  }, [items, activeFilters, searchQuery]);
  
  const toggleFilter = (category) => {
    setActiveFilters(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: {
          duration: 0.3
        },
        opacity: {
          duration: 0.3
        }
      }
    }
  };
  
  return (
    <div className="py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'gradient-text' : 'text-foreground'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        </div>
        
        {/* Search and filter controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
            {/* Search */}
            <div className="flex-grow">
              <div className={`relative ${
                isDarkMode ? 'hover:shadow-[0_0_15px_rgba(156,81,161,0.2)]' : ''
              } rounded-xl transition-all duration-500`}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-5 py-3 pl-12 pr-4 rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-muted/30 border-2 border-muted/30 focus:border-primary/50 text-foreground'
                      : 'bg-muted/50 border-2 border-muted/20 focus:border-primary/30'
                  } focus:outline-none focus:ring-0`}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted/50"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter toggle */}
            <div>
              <motion.button 
                className={`px-4 py-3 rounded-xl flex items-center gap-2 ${
                  showFilters
                    ? `bg-primary text-white`
                    : `${isDarkMode ? 'bg-muted/30 hover:bg-muted/50' : 'bg-muted/20 hover:bg-muted/30'}`
                } transition-colors`}
                onClick={() => setShowFilters(!showFilters)}
                whileTap={{ scale: 0.97 }}
              >
                <Filter size={16} />
                <span>Filters</span>
                {activeFilters.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-accent text-white text-xs rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Filter categories */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <div className={`p-6 mt-4 rounded-xl ${
                  isDarkMode ? 'bg-card/50 border border-muted/30' : 'bg-card border border-muted/20'
                }`}>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-muted-foreground">Categories:</span>
                    {allCategories.map(category => (
                      <motion.button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm ${
                          activeFilters.includes(category)
                            ? 'bg-primary text-white'
                            : `border border-muted ${isDarkMode ? 'hover:bg-muted/30' : 'hover:bg-muted/20'}`
                        } transition-colors`}
                        onClick={() => toggleFilter(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category}
                      </motion.button>
                    ))}
                    
                    {(activeFilters.length > 0 || searchQuery) && (
                      <motion.button
                        className="px-4 py-2 rounded-full text-sm text-muted-foreground border border-muted hover:bg-muted/30 transition-colors flex items-center gap-1"
                        onClick={clearFilters}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={14} />
                        Clear all
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Results info */}
        <div className="mb-6 text-muted-foreground">
          Showing {filteredItems.length} of {items.length} items
        </div>
        
        {/* Gallery grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`overflow-hidden rounded-xl border ${
                  isDarkMode ? 'border-muted/30 hover:border-primary/30' : 'border-muted/20 hover:border-primary/20'
                } transition-all duration-300 h-full`}
              >
                <Link 
                  to={item.url || `/${item.type}/${item.id}`}
                  className="flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Categories tags */}
                    {item.categories && item.categories.length > 0 && (
                      <div className="absolute top-0 left-0 w-full p-4 flex flex-wrap gap-2">
                        {item.categories.map((category, i) => (
                          <span 
                            key={i} 
                            className={`text-xs px-2 py-1 rounded-full ${
                              activeFilters.includes(category)
                                ? 'bg-primary text-white'
                                : 'bg-card/80 backdrop-blur-sm text-foreground'
                            }`}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className={`p-6 flex flex-col flex-grow ${
                    isDarkMode ? 'bg-card/70' : 'bg-card'
                  }`}>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{item.description}</p>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-muted/20">
                      {item.price && (
                        <span className="font-semibold text-accent">₹{item.price}</span>
                      )}
                      <span className="text-primary text-sm flex items-center">
                        View Details
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-1"
                        >
                          →
                        </motion.span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-muted-foreground mb-4 text-6xl">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FilterableGallery; 