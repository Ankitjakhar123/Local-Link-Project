import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

const ServiceCard = ({ 
  service = {}, 
  index = 0,
  premium = false
}) => {
  const { isDarkMode } = useTheme();
  const {
    id = 1,
    title = "Service Title",
    description = "Service description goes here",
    image = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating = 4.8,
    price = 2999,
    reviewCount = 253
  } = service;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: index * 0.1
      }
    },
    hover: {
      y: -5,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${
        isDarkMode 
          ? premium 
            ? 'bg-gradient-to-br from-background via-primary/5 to-background border border-primary/10 shadow-[0_0_30px_rgba(132,90,223,0.15)]' 
            : 'bg-card border border-muted/50'
          : premium 
            ? 'bg-gradient-to-br from-primary/5 via-white to-secondary/5 border border-primary/10 shadow-lg' 
            : 'bg-card border border-muted shadow-md'
      } h-full`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Premium Badge */}
      {premium && (
        <div className="absolute top-2 left-2 z-10">
          <motion.div
            className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
              isDarkMode 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_10px_rgba(132,90,223,0.3)]' 
                : 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            Premium
          </motion.div>
        </div>
      )}

      {/* Image */}
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-36 object-cover"
        />
        {/* Overlay gradients */}
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-background via-background/60 to-transparent' 
            : 'bg-gradient-to-t from-white/90 via-white/30 to-transparent'
        } opacity-50`}></div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
            isDarkMode 
              ? 'bg-card/80 backdrop-blur-sm' 
              : 'bg-white/90 backdrop-blur-sm shadow-sm'
          }`}>
            <Star className="text-yellow-500" size={12} fill="currentColor" />
            <span className="text-xs font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <motion.h3 
          className={`text-base font-semibold ${premium && isDarkMode ? 'text-primary-foreground' : 'text-foreground'} truncate`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-xs text-muted-foreground line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          {description}
        </motion.p>
        
        <motion.div 
          className="pt-2 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <div>
            <span className="text-sm font-bold">₹{price.toLocaleString('en-IN')}</span>
            <span className="text-xs text-muted-foreground ml-1">onwards</span>
          </div>
          
          <Link to={`/services/${id}`}>
            <Button 
              variant={premium ? "primary" : "outline"} 
              size="xs"
              icon={<ArrowRight size={14} />}
              iconPosition="right"
              glowEffect={premium}
              animate={false}
              className={`transition-all duration-300 ${
                isDarkMode && premium ? 'shadow-[0_0_15px_rgba(132,90,223,0.2)]' : ''
              }`}
            >
              View
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Shimmer effect for premium cards */}
      {premium && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transform -translate-x-full animate-[shimmer_2s_infinite]`}></div>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceCard; 