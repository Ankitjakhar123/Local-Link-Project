import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Tag, ShoppingCart } from 'lucide-react';
import { services } from '../data/services';
import { products } from '../data/products';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';
import { motion } from 'framer-motion';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ services: [], products: [] });
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const searchData = () => {
      const searchQuery = query.toLowerCase();

      // Search in services
      const matchedServices = services.filter(service => 
        service.name.toLowerCase().includes(searchQuery) ||
        service.description.toLowerCase().includes(searchQuery) ||
        service.categories.some(cat => 
          cat.name.toLowerCase().includes(searchQuery) ||
          cat.services.some(s => s.name.toLowerCase().includes(searchQuery))
        )
      );

      // Search in products
      const matchedProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery)
      );

      setResults({ services: matchedServices, products: matchedProducts });
      setLoading(false);
    };

    searchData();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('q', searchQuery);
    window.location.search = params.toString();
  };

  const totalResults = results.services.length + results.products.length;

  return (
    <div className="bg-background dark">
      <PageHeader 
        title="Search Results"
        description={loading ? "Searching..." : `Found ${totalResults} results for "${query}"`}
        icon={Search}
      />

      {loading ? (
        <div className="text-center py-32">
          <div className="inline-block relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
            <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-accent border-l-transparent animate-spin animation-delay-500"></div>
          </div>
          <p className="mt-6 text-muted-foreground">Searching the database...</p>
        </div>
      ) : (
        <>
          <SectionContainer className="max-w-5xl mx-auto mb-4">
            <AnimatedElement animation="fadeInDown">
              <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 mb-8">
                <form onSubmit={handleSearchSubmit} className="flex gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search for services or products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input w-full pl-12 pr-4 py-3 bg-background/50 backdrop-blur-md border-2 border-primary/10 focus:border-primary/30 rounded-xl"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" size={20} />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-xl"
                  >
                    Search
                  </button>
                </form>
              </div>
            </AnimatedElement>

            {totalResults === 0 ? (
              <AnimatedElement animation="fadeIn" className="text-center py-16">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-12 border border-primary/10 max-w-2xl mx-auto">
                  <Search size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-3">No results found</h2>
                  <p className="text-muted-foreground mb-8">
                    We couldn't find any matches for "{query}". Try searching with different keywords or browse our categories.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/services" className="btn btn-primary">Browse Services</Link>
                    <Link to="/shop" className="btn btn-outline border-2 border-primary/20 hover:border-primary/70">Visit Shop</Link>
                  </div>
                </div>
              </AnimatedElement>
            ) : (
              <div className="space-y-16">
                {results.services.length > 0 && (
                  <AnimatedElement animation="fadeInUp">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-6 gradient-text relative inline-block">
                        Services
                        <motion.div 
                          className="absolute -bottom-1 left-0 h-1 w-24 bg-gradient-to-r from-secondary via-primary to-accent rounded-full"
                          animate={{ 
                            boxShadow: ['0 0 5px rgba(132, 90, 223, 0.3)', '0 0 15px rgba(132, 90, 223, 0.5)', '0 0 5px rgba(132, 90, 223, 0.3)'] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.services.map((service, index) => (
                        <AnimatedElement
                          key={service.id}
                          animation="fadeInUp"
                          delay={index * 0.05}
                          className="group h-full"
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
                                
                                {/* Rating badge if available */}
                                {service.rating && (
                                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-primary px-2 py-1 rounded-full text-sm font-medium flex items-center">
                                    <Star size={14} className="fill-primary text-primary mr-1" /> {service.rating}
                                  </div>
                                )}
                              </div>
                              
                              <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{service.name}</h3>
                                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{service.description}</p>
                                
                                {/* Category tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {service.categories && service.categories.slice(0, 2).map((category, index) => (
                                    <span 
                                      key={index}
                                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                                    >
                                      {category.name}
                                    </span>
                                  ))}
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

                    {results.services.length > 3 && (
                      <div className="text-center mt-8">
                        <Link 
                          to="/services" 
                          className="btn btn-outline inline-flex items-center gap-2 border-2 border-primary/20 hover:border-primary/70"
                        >
                          View All Services <ArrowRight size={16} />
                        </Link>
                      </div>
                    )}
                  </AnimatedElement>
                )}

                {results.products.length > 0 && (
                  <AnimatedElement animation="fadeInUp" delay={0.2}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-6 gradient-text relative inline-block">
                        Products
                        <motion.div 
                          className="absolute -bottom-1 left-0 h-1 w-24 bg-gradient-to-r from-secondary via-primary to-accent rounded-full"
                          animate={{ 
                            boxShadow: ['0 0 5px rgba(132, 90, 223, 0.3)', '0 0 15px rgba(132, 90, 223, 0.5)', '0 0 5px rgba(132, 90, 223, 0.3)'] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.products.map((product, index) => (
                        <AnimatedElement
                          key={product.id}
                          animation="fadeInUp"
                          delay={index * 0.05}
                          className="group"
                        >
                          <Link 
                            to={`/shop?product=${product.id}`}
                            className="block h-full"
                          >
                            <div className="card-3d h-full bg-card rounded-2xl overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-all duration-500">
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
                                
                                {/* Category badge */}
                                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                  <Tag size={12} className="text-secondary mr-1" /> {product.category}
                                </div>
                                
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
                              </div>
                              
                              <div className="p-5">
                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                  {product.name}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                  {product.description}
                                </p>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-primary font-medium">View Product</span>
                                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                                    <ShoppingCart className="text-primary" size={16} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </AnimatedElement>
                      ))}
                    </div>

                    {results.products.length > 4 && (
                      <div className="text-center mt-8">
                        <Link 
                          to="/shop" 
                          className="btn btn-outline inline-flex items-center gap-2 border-2 border-primary/20 hover:border-primary/70"
                        >
                          View All Products <ArrowRight size={16} />
                        </Link>
                      </div>
                    )}
                  </AnimatedElement>
                )}
              </div>
            )}
          </SectionContainer>
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;