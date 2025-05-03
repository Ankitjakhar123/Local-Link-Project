import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const CircularServicesShowcase = ({ services, title, onExploreClick }) => {
  return (
    <div className="relative py-16">
      {/* Background circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 border-dashed border-primary/20 opacity-40"></div>
      
      {/* Center circle */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full bg-card backdrop-blur-md border-2 border-primary/30 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="text-center p-6">
          <motion.h3 
            className="text-2xl font-bold gradient-text"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% auto",
              backgroundImage: "linear-gradient(to right, #845adf 0%, #9c51a1 50%, #845adf 100%)",
            }}
          >
            {title || "Our Services"}
          </motion.h3>
          <p className="text-muted-foreground mt-2">Premium quality services at your fingertips</p>
          <button 
            onClick={onExploreClick}
            className="mt-4 btn btn-primary btn-sm"
          >
            Explore All
          </button>
        </div>
      </motion.div>
      
      {/* Services in circle */}
      {services.map((service, index) => {
        // Position services in a circle
        const angle = ((index * (360 / services.length)) * Math.PI) / 180;
        const radius = 250; // Distance from center
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <motion.div
            key={service.id}
            className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ 
              x, 
              y,
              rotate: (index * (360 / services.length)) // Rotate to face outward
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1, zIndex: 30 }}
          >
            <Link 
              to={`/services/${service.id}`}
              className="block h-full w-full"
            >
              <div className="relative w-full h-full">
                {/* Background circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                
                {/* Image container */}
                <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-all duration-300">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay with text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                    <div className="p-2 text-center">
                      <h3 className="text-white text-xs font-medium">{service.name}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Badge if available */}
                {service.badge && (
                  <div className="absolute top-0 right-0 bg-primary/90 text-white text-xs px-1.5 py-0.5 rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {service.badge}
                  </div>
                )}
                
                {/* Rating */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm text-xs px-1.5 py-0.5 rounded-full flex items-center">
                  <Star size={10} className="text-warning fill-warning mr-0.5" />
                  <span>{service.rating}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CircularServicesShowcase; 