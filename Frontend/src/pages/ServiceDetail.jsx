import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, ChevronDown, ChevronUp, ShoppingCart, Check, ChevronRight, Shield, Award, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { services } from '../data/services';
import { useCart } from '../context/CartContext';
import PageHeader from '../components/PageHeader';
import SectionContainer from '../components/SectionContainer';
import AnimatedElement from '../components/AnimatedElement';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedServices, setExpandedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [addToCartStatus, setAddToCartStatus] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
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
      image: service.image || 'https://images.pexels.com/photos/4108843/pexels-photo-4108843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // Placeholder image
    });

    // Set status to show success animation
    setAddToCartStatus(prev => ({
      ...prev,
      [service.id]: true
    }));

    // Reset status after 2 seconds
    setTimeout(() => {
      setAddToCartStatus(prev => ({
        ...prev,
        [service.id]: false
      }));
    }, 2000);
  };

  const addProductToCart = (product) => {
    addToCart({
      id: `product-${product.id}`,
      name: product.name,
      price: product.price,
      type: 'product',
      image: product.image
    });

    // Set status to show success animation
    setAddToCartStatus(prev => ({
      ...prev,
      [`product-${product.id}`]: true
    }));

    // Reset status after 2 seconds
    setTimeout(() => {
      setAddToCartStatus(prev => ({
        ...prev,
        [`product-${product.id}`]: false
      }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="container py-32 text-center">
        <div className="inline-block relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-accent border-l-transparent animate-spin animation-delay-500"></div>
        </div>
        <p className="mt-6 text-muted-foreground">Loading service details...</p>
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
    <div className="pt-24 pb-16 bg-background dark">
      {/* Breadcrumb navigation */}
      <div className="container mb-8">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-foreground">{service.name}</span>
        </div>
      </div>

      {/* Service overview section */}
      <div className="container mb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Service image */}
          <AnimatedElement className="lg:w-1/2" animation="fadeInLeft">
            <div className="sticky top-24">
              <div className="relative overflow-hidden rounded-2xl border border-primary/10 glass-panel">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
                {/* Floating badges */}
                <div className="absolute top-4 left-4 bg-success/90 text-white px-3 py-1 rounded-full text-sm">
                  Professional Service
                </div>
                
                {/* Category tag */}
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm text-primary font-medium px-3 py-1.5 rounded-full text-sm">
                  {service.category}
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Service details */}
          <AnimatedElement className="lg:w-1/2" animation="fadeInRight">
            <div className="space-y-6">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back
              </button>
              
              <h1 className="text-3xl font-bold">{service.name}</h1>
              
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < Math.floor(service.rating || 4.5) ? "fill-warning text-warning" : "text-muted"}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({service.rating || 4.5})</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-primary hover:underline cursor-pointer">
                  Reviews
                </span>
              </div>
              
              <p className="text-muted-foreground">
                {service.description}
              </p>
              
              <div className="pt-4 border-t border-border">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-secondary/10 mt-1">
                      <Shield size={16} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Satisfaction Guarantee</h3>
                      <p className="text-sm text-muted-foreground">We ensure complete satisfaction with our services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 mt-1">
                      <Award size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Expert Professionals</h3>
                      <p className="text-sm text-muted-foreground">Our services are provided by experienced professionals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-accent/10 mt-1">
                      <Users size={16} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">Customer Support</h3>
                      <p className="text-sm text-muted-foreground">24/7 customer support for all your queries</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Categories section */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-3">Select a category</h3>
                <div className="flex flex-wrap gap-2">
                  {service.categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedCategory === category.id 
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
          </AnimatedElement>
        </div>
      </div>

      {/* Service details tabs */}
      <div className="container mb-16">
        <div className="border-b border-border mb-8">
          <div className="flex flex-wrap -mb-px">
            {['description', 'services', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="cyber-card rounded-2xl p-8">
          {activeTab === 'description' && (
            <AnimatedElement animation="fadeIn">
              <h3 className="text-xl font-bold mb-4 gradient-text">Service Description</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {service.description}
                </p>
                <p>
                  Our services are performed by trained professionals using quality tools and products to ensure the best results. We take pride in our commitment to customer satisfaction and excellence in service delivery.
                </p>
                <p>
                  This premium {service.name.toLowerCase()} service is designed to deliver exceptional results and satisfaction. With attention to detail and quality execution, it's the perfect choice for your needs.
                </p>
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Key Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Expert professionals with years of experience</li>
                    <li>Convenient scheduling options</li>
                    <li>Quality tools and products</li>
                    <li>Satisfaction guarantee</li>
                    <li>Excellent customer support</li>
                  </ul>
                </div>
              </div>
            </AnimatedElement>
          )}
          
          {activeTab === 'services' && (
            <AnimatedElement animation="fadeIn">
              <h3 className="text-xl font-bold mb-6 gradient-text">Available Services</h3>
              <div className="space-y-6">
                {selectedCategoryData && selectedCategoryData.services.map(serviceItem => (
                  <div 
                    key={serviceItem.id}
                    className="glass-panel rounded-xl p-6 border border-border transition-all hover:border-primary/30"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold mb-2">{serviceItem.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            {serviceItem.duration || "45-60 mins"}
                          </span>
                          <span className="flex items-center">
                            <Star size={16} className="mr-1 fill-warning text-warning" />
                            {serviceItem.rating || 4.5}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {serviceItem.description || "Professional service with quality results. Includes all necessary tools and products."}
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-primary">₹{serviceItem.price}</span>
                      </div>
                      <button
                        onClick={() => addServiceToCart(serviceItem)}
                        className={`btn ${
                          addToCartStatus[serviceItem.id] 
                            ? 'btn-success' 
                            : 'btn-primary'
                        }`}
                      >
                        {addToCartStatus[serviceItem.id] ? (
                          <span className="flex items-center">
                            <Check size={18} className="mr-1" />
                            Added
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <ShoppingCart size={18} className="mr-1" />
                            Book Now
                          </span>
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <h5 className="font-medium mb-2">What's included:</h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <Check size={14} className="text-success mr-2" />
                          Professional service
                        </li>
                        <li className="flex items-center">
                          <Check size={14} className="text-success mr-2" />
                          Quality tools & products
                        </li>
                        <li className="flex items-center">
                          <Check size={14} className="text-success mr-2" />
                          Service guarantee
                        </li>
                        <li className="flex items-center">
                          <Check size={14} className="text-success mr-2" />
                          Transparent pricing
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedElement>
          )}
          
          {activeTab === 'reviews' && (
            <AnimatedElement animation="fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold gradient-text">Customer Reviews</h3>
                <button className="btn btn-primary">Write a Review</button>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={24} 
                        className={i < Math.floor(service.rating || 4.5) ? "fill-warning text-warning" : "text-muted"}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold">{service.rating || 4.5}</span>
                  <span className="text-muted-foreground">Based on customer reviews</span>
                </div>
                
                <div className="h-1.5 w-full bg-muted/50 rounded-full mb-1">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              {/* Sample reviews */}
              <div className="space-y-6">
                <div className="glass-panel rounded-xl p-6 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">Amit Kumar</h4>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < 5 ? "fill-warning text-warning" : "text-muted"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">2 weeks ago</span>
                  </div>
                  <p className="text-muted-foreground">Excellent service! The professional was punctual, skilled, and very courteous. Everything was done perfectly and they even cleaned up afterward. Highly recommended!</p>
                </div>
                
                <div className="glass-panel rounded-xl p-6 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">Priya Mehta</h4>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < 4 ? "fill-warning text-warning" : "text-muted"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">1 month ago</span>
                  </div>
                  <p className="text-muted-foreground">Good service overall. The work was completed on time and the quality was good. The only reason for 4 stars is that I had to reschedule once, but they were accommodating.</p>
                </div>
              </div>
            </AnimatedElement>
          )}
        </div>
      </div>

      {/* Related products section */}
      {service.relatedProducts && service.relatedProducts.length > 0 && (
        <div className="container mb-16">
          <h2 className="text-2xl font-bold mb-8 gradient-text">Products You Might Need</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.relatedProducts.map((product, index) => (
              <AnimatedElement
                key={product.id}
                animation="fadeInUp"
                delay={index * 0.1}
                className="group h-full"
              >
                <Link 
                  to={`/product/${product.id}`}
                  className="block h-full"
                >
                  <div className="card-3d h-full bg-card rounded-2xl overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-all duration-500">
                    <div className="h-48 overflow-hidden relative">
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
                      <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-primary px-2 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star size={14} className="fill-warning text-warning mr-1" /> {product.rating}
                      </div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded-md">
                          {product.category}
                        </span>
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
        </div>
      )}

      {/* CTA section */}
      <div className="container">
        <div className="cyber-card rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-4 gradient-text">Need help with your service?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with any questions or concerns. 
            We're committed to ensuring your complete satisfaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+919999999999" className="btn btn-primary btn-glow">
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