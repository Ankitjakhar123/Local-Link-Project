import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ProductCard3D = ({ product, type = "product" }) => {
  const { isDarkMode } = useTheme();
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const { left, top, width, height } = card.getBoundingClientRect();
    
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate rotation based on mouse position
    const rotateY = ((x / width) - 0.5) * 20; // -10 to 10 degrees
    const rotateX = ((y / height) - 0.5) * -20; // 10 to -10 degrees
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  const resetStyles = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
    setIsHovered(false);
  };

  const enhanceStyles = () => {
    setScale(1.03);
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-[330px] rounded-xl overflow-hidden perspective-1000"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={enhanceStyles}
      onMouseLeave={resetStyles}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: scale,
        boxShadow: isHovered 
          ? isDarkMode 
            ? '0 15px 30px rgba(132, 90, 223, 0.3), 0 0 10px rgba(156, 81, 161, 0.3)' 
            : '0 10px 20px rgba(0, 0, 0, 0.15)'
          : '0 3px 10px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Reflection overlay */}
      <div 
        className={`absolute inset-0 z-10 pointer-events-none ${isDarkMode ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-white/20 to-transparent'}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        }}
      />
      
      {/* Card content */}
      <motion.div 
        className={`${isDarkMode ? 'cyber-card' : 'morphic-card'} w-full h-full flex flex-col p-0 overflow-hidden relative`}
        animate={{ scale: isHovered ? 1 : 1 }}
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-20 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {product.badge}
          </div>
        )}
        
        {/* Image */}
        <div className="h-[160px] overflow-hidden">
          <motion.img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-semibold text-foreground truncate">{product.name}</h3>
            {type === "product" && (
              <span className="text-accent font-bold text-sm">₹{product.price}</span>
            )}
          </div>
          
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2 flex-grow">{product.description}</p>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  stroke="currentColor" 
                  className={i < Math.floor(product.rating) ? "text-warning" : "text-muted"} 
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span className="text-muted-foreground text-xs ml-2">({product.reviewCount})</span>
            </div>
          )}
          
          {/* Footer */}
          <motion.div 
            className="flex justify-between items-center mt-auto"
            animate={{ y: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.7 }}
          >
            <Link 
              to={type === "product" ? `/shop/${product.id}` : `/services/${product.id}`}
              className="text-primary font-medium flex items-center gap-1 text-xs"
            >
              View Details
              <motion.span
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight size={12} />
              </motion.span>
            </Link>
            
            {type === "product" && (
              <motion.button 
                className="btn btn-xs btn-primary py-1 px-2 rounded-lg text-xs"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            )}
          </motion.div>
        </div>
        
        {/* Hover glow effect */}
        {isDarkMode && (
          <motion.div 
            className="absolute inset-0 pointer-events-none opacity-0 z-[-1]"
            animate={{ opacity: isHovered ? 0.15 : 0 }}
          >
            <div className="absolute inset-0 bg-primary rounded-xl blur-xl"></div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductCard3D; 