import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { services } from '../data/services';
import { useCart } from '../context/CartContext';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedServices, setExpandedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API fetch
    const fetchService = () => {
      const foundService = services.find(s => s.id === parseInt(id));
      setService(foundService);
      if (foundService && foundService.categories.length > 0) {
        setSelectedCategory(foundService.categories[0].id);
      }
      setLoading(false);
    };

    fetchService();
  }, [id]);

  const toggleServiceExpand = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const addServiceToCart = (service) => {
    addToCart({
      id: `service-${service.id}`,
      name: service.name,
      price: service.price,
      type: 'service',
      image: 'https://images.pexels.com/photos/4108843/pexels-photo-4108843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // Placeholder image
    });

    // Show success notification (in a real app)
    alert(`${service.name} added to cart!`);
  };

  const addProductToCart = (product) => {
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

  if (loading) {
    return (
      <div className="container py-32 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-foreground">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
        <p className="mb-8 text-muted-foreground">The service you're looking for doesn't exist or has been removed.</p>
        <Link to="/services" className="btn btn-primary">Browse Services</Link>
      </div>
    );
  }

  const selectedCategoryData = service.categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="pt-24 pb-16">
      {/* Hero section */}
      <div className="bg-primary/10 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-3">{service.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                  Professional Services
                </span>
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                  Verified Experts
                </span>
                <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium">
                  Satisfaction Guaranteed
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-muted-foreground mb-2">Select a category to see available services:</p>
                <div className="flex flex-wrap gap-2">
                  {service.categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-primary text-white' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link to="/services" className="text-primary hover:underline flex items-center">
                <ChevronDown size={16} className="mr-1" />
                View all services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Service listing */}
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategoryData ? selectedCategoryData.name : 'Available Services'}
        </h2>
        
        <div className="space-y-4">
          {selectedCategoryData && selectedCategoryData.services.map(serviceItem => (
            <div 
              key={serviceItem.id}
              className="bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-md"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleServiceExpand(serviceItem.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{serviceItem.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {serviceItem.duration}
                      </span>
                      <span className="flex items-center">
                        <Star size={16} className="mr-1 fill-warning text-warning" />
                        {serviceItem.rating}
                      </span>
                    </div>
                    <p className="font-semibold text-lg">₹{serviceItem.price}</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addServiceToCart(serviceItem);
                      }}
                      className="btn btn-primary mr-3"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Book Now
                    </button>
                    {expandedServices[serviceItem.id] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedServices[serviceItem.id] && (
                <div className="px-6 pb-6 pt-2 border-t border-border mt-2">
                  <h4 className="font-medium mb-2">What's included:</h4>
                  <ul className="list-disc pl-5 mb-4 text-muted-foreground space-y-1">
                    <li>Professional service by trained experts</li>
                    <li>Quality-checked products and equipment</li>
                    <li>30-day service guarantee</li>
                    <li>Transparent pricing with no hidden costs</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related products */}
      {service.relatedProducts && service.relatedProducts.length > 0 && (
        <div className="bg-muted/20 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Related Products You Might Need</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {service.relatedProducts.map(product => (
                <div 
                  key={product.id}
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
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <Star size={16} className="fill-warning text-warning" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">₹{product.price}</p>
                      <button 
                        onClick={() => addProductToCart(product)}
                        className="btn btn-outline text-sm px-3 py-1"
                      >
                        <ShoppingCart size={14} className="mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews section would go here */}

      {/* CTA section */}
      <div className="container py-12">
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need help choosing the right service?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our experts are available 24/7 to help you choose the right service for your needs. 
            Get personalized recommendations and answers to all your questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+919999999999" className="btn btn-primary">
              Call Us Now
            </a>
            <Link to="/contact" className="btn btn-outline">
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;