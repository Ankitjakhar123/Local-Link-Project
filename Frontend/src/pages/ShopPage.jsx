import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, SlidersHorizontal, X, Star, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { products, getProductsByCategory } from '../data/products';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';
import { motion } from 'framer-motion';

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(null);

  // Get all unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters
    let results = [...products];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (category !== 'all') {
      results = results.filter(product => product.category === category);
    }
    
    // Price range filter
    results = results.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'featured'
        // Do nothing, keep original order
        break;
    }
    
    setFilteredProducts(results);
  }, [searchQuery, category, priceRange, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: `product-${product.id}`,
      name: product.name,
      price: product.price,
      type: 'product',
      image: product.image
    });

    // Show temporary added to cart indicator
    setAddedToCart(product.id);
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setPriceRange([0, 2000]);
    setSortBy('featured');
  };

  return (
    <div className="bg-background dark">
      {/* Hero Section */}
      <PageHeader 
        title="Shop Products"
        description="Browse our curated selection of high-quality products to complement your services."
        icon={ShoppingBag}
        backgroundImage="https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      />

      <SectionContainer 
        backgroundElements={false}
        className="max-w-7xl mx-auto"
      >
        {/* Search and sorting */}
        <AnimatedElement animation="fadeInDown" className="mb-8">
          <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
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
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input bg-background/50 backdrop-blur-md border-2 border-primary/10 focus:border-primary/30 rounded-xl"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                
                {(searchQuery || category !== 'all' || sortBy !== 'featured' || 
                  priceRange[0] !== 0 || priceRange[1] !== 2000) && (
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
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Categories */}
                  <div className="lg:w-1/2">
                    <h3 className="font-medium mb-3 text-sm uppercase tracking-wider">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat, index) => (
                        <button
                          key={index}
                          onClick={() => setCategory(cat)}
                          className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 text-left ${
                            category === cat
                              ? 'bg-primary text-white shadow-lg shadow-primary/20'
                              : 'bg-card hover:bg-primary/10 border border-border'
                          }`}
                        >
                          {cat === 'all' ? 'All Categories' : cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div className="lg:w-1/2">
                    <h3 className="font-medium mb-3 text-sm uppercase tracking-wider">Price Range</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between text-sm">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                      <div className="relative pt-1">
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          step="100"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-full appearance-none bg-primary/20 h-1 rounded-full focus:outline-none"
                        />
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full appearance-none bg-primary/20 h-1 rounded-full focus:outline-none mt-4"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Min Price</label>
                          <input
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            className="w-full input py-2 px-3"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Max Price</label>
                          <input
                            type="number"
                            min={priceRange[0]}
                            max="2000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full input py-2 px-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatedElement>

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-accent border-l-transparent animate-spin animation-delay-500"></div>
            </div>
            <p className="mt-6 text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <AnimatedElement animation="fadeIn" className="text-center py-20">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-10 border border-primary/10 max-w-2xl mx-auto">
                  <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-bold mb-3">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any products matching your search criteria.
                  </p>
                  <button onClick={clearFilters} className="btn btn-primary px-6">
                    Clear Filters
                  </button>
                </div>
              </AnimatedElement>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredProducts.map((product, index) => (
                  <AnimatedElement
                    key={product.id}
                    animation="fadeInUp"
                    delay={index * 0.05}
                    className="group"
                  >
                    <div className="card-3d h-full bg-card rounded-2xl overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-all duration-500">
                      <Link to={`/product/${product.id}`} className="block">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          {/* Price tag */}
                          <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-primary font-semibold px-3 py-1 rounded-full text-sm">
                            ₹{product.price}
                          </div>
                          
                          {/* Rating if available */}
                          {product.rating && (
                            <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-primary px-2 py-1 rounded-full text-sm font-medium flex items-center">
                              <Star size={14} className="fill-primary text-primary mr-1" /> {product.rating}
                            </div>
                          )}
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
                        </div>
                        
                        <div className="p-6">
                          <div className="mb-1">
                            <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                              {product.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </Link>
                        
                      <div className="px-6 pb-6">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full btn ${
                            addedToCart === product.id 
                              ? 'btn-success bg-success/90 hover:bg-success'
                              : 'btn-primary'
                          } transition-all duration-300`}
                        >
                          {addedToCart === product.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <Check size={18} />
                              Added to Cart
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <ShoppingCart size={18} />
                              Add to Cart
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </AnimatedElement>
                ))}
              </div>
            )}
          </>
        )}
      </SectionContainer>
    </div>
  );
};

export default ShopPage;