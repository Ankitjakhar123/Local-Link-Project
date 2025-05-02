import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { services } from '../data/services';
import { products } from '../data/products';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ services: [], products: [] });

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

  if (loading) {
    return (
      <div className="pt-32 pb-16 container">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  const totalResults = results.services.length + results.products.length;

  return (
    <div className="pt-32 pb-16 container">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        Found {totalResults} results for "{query}"
      </p>

      {totalResults === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Search className="mx-auto text-muted-foreground mb-4" size={48} />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground mb-6">
            Try searching with different keywords or browse our services and products.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/services" className="btn btn-primary">Browse Services</Link>
            <Link to="/shop" className="btn btn-outline">Visit Shop</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {results.services.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.services.map(service => (
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
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-medium">View Details</span>
                        <ArrowRight className="text-primary transition-transform group-hover:translate-x-1" size={18} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.products.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.products.map(product => (
                  <Link 
                    key={product.id}
                    to={`/shop?product=${product.id}`}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <p className="font-semibold">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;