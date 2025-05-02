import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, SlidersHorizontal, X, Star } from 'lucide-react';
import { products, getProductsByCategory } from '../data/products';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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

    // Show success notification (in a real app)
    alert(`${product.name} added to cart!`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setPriceRange([0, 2000]);
    setSortBy('featured');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Shop Products</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse our curated selection of high-quality products to complement your services. 
            All products come with a satisfaction guarantee.
          </p>
        </div>

        {/* Search and sorting */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </form>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center"
            >
              <Filter size={18} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input bg-background"
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
                className="btn btn-outline flex items-center text-muted-foreground hover:text-foreground"
              >
                <X size={18} className="mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar - desktop */}
          <div className={`lg:w-1/4 bg-card p-6 rounded-lg border border-border h-fit ${
            showFilters ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center">
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
              </h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`cat-${index}`}
                      name="category"
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="mr-2"
                    />
                    <label htmlFor={`cat-${index}`} className="text-foreground">
                      {cat === 'all' ? 'All Categories' : cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 0 && val <= priceRange[1]) {
                        setPriceRange([val, priceRange[1]]);
                      }
                    }}
                    className="input w-full text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    min={priceRange[0]}
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= priceRange[0] && val <= 2000) {
                        setPriceRange([priceRange[0], val]);
                      }
                    }}
                    className="input w-full text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={clearFilters}
              className="btn btn-primary w-full"
            >
              Reset Filters
            </button>
          </div>

          {/* Products grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="h-60 overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-card px-2 py-1 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"} 
                            />
                          ))}
                        </div>
                        <span className="text-sm ml-1 text-muted-foreground">({product.rating})</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">₹{product.price}</span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="btn btn-primary text-sm flex items-center"
                        >
                          <ShoppingCart size={16} className="mr-1" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any products matching your criteria.
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;