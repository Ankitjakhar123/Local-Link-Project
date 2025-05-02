import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ArrowUpRight, Download, SmartphoneCharging } from 'lucide-react';
import { motion } from 'framer-motion';

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

const HomePage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('popular');

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

      {/* Popular Services Section */}
      <section className="py-24">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From home cleaning to appliance repair, our professionals are ready to assist you.
            </p>
          </motion.div>
          
          <div className="flex justify-center mb-12">
            <div className="flex border rounded-lg p-1 bg-muted/10 backdrop-blur-lg">
              <motion.button 
                className={`px-6 py-3 rounded-md transition-all relative ${activeTab === 'popular' ? 'text-white' : 'text-foreground hover:bg-muted'}`}
                onClick={() => setActiveTab('popular')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeTab === 'popular' && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-md -z-10"
                    layoutId="tabBackground"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                Popular
              </motion.button>
              <motion.button 
                className={`px-6 py-3 rounded-md transition-all relative ${activeTab === 'newest' ? 'text-white' : 'text-foreground hover:bg-muted'}`}
                onClick={() => setActiveTab('newest')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeTab === 'newest' && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-md -z-10"
                    layoutId="tabBackground"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                Newest
              </motion.button>
              <motion.button 
                className={`px-6 py-3 rounded-md transition-all relative ${activeTab === 'trending' ? 'text-white' : 'text-foreground hover:bg-muted'}`}
                onClick={() => setActiveTab('trending')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeTab === 'trending' && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-md -z-10"
                    layoutId="tabBackground"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                Trending
              </motion.button>
            </div>
          </div>
          
          {/* 3D Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured3DServices.map(service => (
              <ProductCard3D key={service.id} product={service} type="service" />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <MicroInteractions.Button 
              variant="primary" 
              size="lg"
              magneticEffect={true}
              rippleEffect={true}
              glowEffect={true}
              onClick={() => navigate('/services')}
              className="group"
            >
              View All Services
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </MicroInteractions.Button>
          </div>
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
              className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center">
                <SmartphoneCharging size={16} className="mr-1" />
                <span>iOS & Android</span>
              </div>
              <div className="flex items-center">
                <motion.span 
                  className="inline-block w-2 h-2 rounded-full bg-success mr-1"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>No App Store Required</span>
              </div>
              <div className="flex items-center">
                <motion.span 
                  className="inline-block w-2 h-2 rounded-full bg-success mr-1"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <span>Works Offline</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
