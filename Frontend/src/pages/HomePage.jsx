import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ArrowUpRight, Download, SmartphoneCharging, Sparkles, ShoppingBag, BadgeCheck, ChevronRight, Target } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import our new components
import ParallaxHero from '../components/ParallaxHero';
import ProductCard3D from '../components/ProductCard3D';
import TestimonialSlider from '../components/TestimonialSlider';
import ServiceTimeline from '../components/ServiceTimeline';
import { useNotification } from '../components/NotificationSystem';
import MicroInteractions from '../components/MicroInteractions';
import InstallPWA from '../components/InstallPWA';

// Import data 
import { services } from '../data/services';
import { products } from '../data/products';

const HomePage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('popular');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle hero search
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      
      // Show notification
      showNotification({
        title: 'Search Started',
        message: `Searching for "${query}"`,
        type: 'info',
        duration: 3000
      });
    }
  };

  // Features section data
  const features = [
    { 
      icon: "🔍",
      title: "Expert Professionals", 
      description: "Verified, background-checked, and skilled professionals" 
    },
    { 
      icon: "⏰",
      title: "Timely Service",
      description: "On-time service delivery or get money back guarantee" 
    },
    { 
      icon: "💰",
      title: "Affordable Pricing",
      description: "Clear and standardized pricing for all services" 
    },
    { 
      icon: "⭐",
      title: "Satisfaction Guaranteed",
      description: "Quality service or we'll redo it to your satisfaction" 
    }
  ];

  // Testimonials data with avatars
  const testimonials = [
    {
      id: 1,
      name: "Arundhati Mishra",
      location: "Mumbai",
      rating: 5,
      text: "I booked a salon service and was amazed by the professionalism. The beautician was skilled and used high-quality products. Definitely using Local Link again!",
      service: "Women's Salon",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      id: 2,
      name: "Vikram Singh",
      location: "Delhi",
      rating: 5,
      text: "The AC repair service was excellent. The technician identified the issue quickly and fixed it within an hour. Very satisfied with the quality of service.",
      service: "AC Repair",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Priya Sharma",
      location: "Bangalore",
      rating: 4,
      text: "Booked a deep cleaning service for my new apartment. The team was punctual and thorough. My apartment looks spotless now!",
      service: "Home Cleaning",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  // Transform services data for ProductCard3D
  const featured3DServices = services.slice(0, 6).map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    image: service.image,
    rating: 4.8,
    reviewCount: 120,
    badge: service.id % 3 === 0 ? 'New' : (service.id % 2 === 0 ? 'Popular' : null),
    type: 'service'
  }));

  return (
    <div>
      {/* Hero Section */}
      <ParallaxHero onSearch={handleSearch} />

      {/* Premium Services Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full opacity-70"></div>
          
          {/* Geometric patterns */}
          <div className="absolute inset-0 cyberpunk-grid opacity-10"></div>
          
          {/* Animated dots */}
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={`dot-${index}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/50"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="container relative z-10">
          {/* Section header */}
          <div className="text-center mb-16 relative">
            <motion.div
              className="inline-block mb-4 px-5 py-2 rounded-full bg-primary/10 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-medium flex items-center gap-2">
                <Sparkles size={16} className="text-secondary" />
                Premium Services
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-5xl font-bold mb-6 gradient-text relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Services Tailored for You
              {/* Glowing underline */}
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-1 w-24 bg-gradient-to-r from-secondary via-primary to-accent rounded-full" 
                animate={{ 
                  boxShadow: ['0 0 5px rgba(132, 90, 223, 0.3)', '0 0 20px rgba(132, 90, 223, 0.7)', '0 0 5px rgba(132, 90, 223, 0.3)'] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              From home cleaning to appliance repair, our professionals are ready to assist you 
              with exceptional service quality and guaranteed satisfaction.
            </motion.p>
          </div>
          
          {/* Service category tabs */}
          <motion.div 
            className="flex justify-center flex-wrap mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-wrap justify-center p-1.5 rounded-xl backdrop-blur-sm border border-muted/30 bg-card/30 gap-2">
              {['popular', 'newest', 'trending'].map((tab) => (
                <motion.button 
                  key={tab}
                  className={`relative px-6 py-3 rounded-lg transition-all capitalize text-sm font-medium ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-foreground hover:text-primary'
                  }`}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {activeTab === tab && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg -z-10"
                      layoutId="activeTabBackground"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.8 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    >
                      <div className="absolute inset-0 bg-primary opacity-40 blur-xl rounded-lg"></div>
                    </motion.div>
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Services grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featured3DServices.map((service, index) => (
              <motion.div
                key={service.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <ProductCard3D product={service} type="service" />
              </motion.div>
            ))}
          </motion.div>
          
          {/* View all button */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <MicroInteractions.Button 
              variant="primary" 
              size="lg"
              magneticEffect={true}
              rippleEffect={true}
              glowEffect={true}
              onClick={() => navigate('/services')}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                View All Services
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </span>
              
              {/* Button background animation */}
              <motion.div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
                animate={{ backgroundPosition: ['0% center', '100% center', '0% center'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </MicroInteractions.Button>
          </motion.div>
        </div>
      </section>
      
      {/* Our Products Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className={`absolute inset-0 z-0 ${
          isDarkMode ? 'bg-gradient-to-br from-background via-card to-background' : 'bg-gradient-to-br from-muted/20 via-white to-muted/10'
        }`}>
          {/* Radial gradient accent */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 cyberpunk-grid opacity-10"></div>
        </div>
        
        <div className="container relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-block mb-4 px-5 py-2 rounded-full bg-accent/10 border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-accent font-medium flex items-center gap-2">
                <ShoppingBag size={16} className="text-accent" />
                Premium Products
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Quality Products Delivered
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover our curated collection of premium products to complement our services 
              and enhance your home experience.
            </motion.p>
          </div>
          
          {/* Product categories pills */}
          <motion.div 
            className="flex justify-center flex-wrap gap-3 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {['All Products', 'Hair Care', 'Skin Care', 'Cleaning Supplies', 'Electrical', 'Plumbing'].map((category, index) => (
              <motion.button
                key={category}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-card/50 border border-muted/30 hover:border-accent/30 text-foreground hover:text-accent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
          
          {/* Featured products */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {products.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className={`group relative overflow-hidden rounded-xl ${
                  isDarkMode 
                    ? 'bg-card/50 border border-muted/30 hover:border-accent/30' 
                    : 'bg-white border border-muted/20 hover:border-accent/20 shadow-lg hover:shadow-xl'
                } transition-all duration-300`}
                whileHover={{ y: -5 }}
              >
                {/* Product image */}
                <div className="aspect-square overflow-hidden">
                  <motion.img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>
                
                {/* Product info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{product.name}</h3>
                      <p className="text-muted-foreground text-sm">{product.category}</p>
                    </div>
                    <div className="text-accent font-bold">₹{product.price}</div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted-foreground"} 
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                  </div>
                  
                  {/* Add to cart */}
                  <motion.button 
                    className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white text-sm font-medium flex items-center justify-center gap-2 hover:from-accent/90 hover:to-accent/70"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag size={14} />
                    Add to Cart
                  </motion.button>
                </div>
                
                {/* Badge if available */}
                {index < 2 && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-white text-xs font-bold rounded-md flex items-center gap-1">
                    <BadgeCheck size={12} />
                    Bestseller
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          {/* View all products link */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/shop" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium">
              View All Products
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Service Process Timeline */}
      <ServiceTimeline />

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <motion.h2 
            className="text-4xl font-bold mb-16 text-center gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Local Link?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-card p-8 rounded-xl border border-muted/30 shadow-lg text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                  borderColor: "rgba(156, 81, 161, 0.3)"
                }}
              >
                <div className="text-5xl mb-6 inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary p-5 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container">
          <motion.h2 
            className="text-4xl font-bold mb-12 text-center gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            What Our Customers Say
          </motion.h2>
          
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90 z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0 cyberpunk-grid opacity-10"></div>
        
        <div className="container relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-white/80 mb-12 max-w-2xl mx-auto">
              Download our app for the best experience and exclusive offers. Available on iOS and Android.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <MicroInteractions.Button 
                variant="secondary" 
                size="lg"
                magneticEffect={true}
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/services')}
              >
                Browse Services
              </MicroInteractions.Button>
              <MicroInteractions.Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10"
                onClick={() => {
                  // Show notification about app download
                  showNotification({
                    title: 'App Download',
                    message: 'Our mobile app is coming soon! We\'ll notify you when it\'s available.',
                    type: 'info',
                    duration: 5000,
                    action: {
                      label: 'Notify Me',
                      onClick: () => {
                        showNotification({
                          title: 'Thank you!',
                          message: 'We\'ll notify you when our app launches.',
                          type: 'success',
                          duration: 3000
                        });
                      },
                      closeOnClick: true
                    }
                  });
                }}
              >
                <InstallPWA className="flex items-center">
                  <Download size={18} className="mr-2" />
                  Download App
                </InstallPWA>
              </MicroInteractions.Button>
            </div>

            {/* Device indicators */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <SmartphoneCharging size={16} className="mr-2 text-white" />
                <span className="text-white font-medium">iOS & Android</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <motion.span 
                  className="inline-block w-3 h-3 rounded-full bg-secondary mr-2"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white font-medium">No App Store Required</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <motion.span 
                  className="inline-block w-3 h-3 rounded-full bg-secondary mr-2"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-white font-medium">Works Offline</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
