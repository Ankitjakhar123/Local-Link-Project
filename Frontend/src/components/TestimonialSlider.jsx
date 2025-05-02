import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TestimonialSlider = ({ testimonials = [] }) => {
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  
  // Reset autoplay timer when index changes
  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => clearInterval(autoplayRef.current);
  }, [currentIndex, autoplay, testimonials.length]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  const paginate = (newDirection) => {
    setDirection(newDirection);
    
    if (newDirection === 1) {
      // Next
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    } else {
      // Previous
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    }
  };
  
  // Variants for animations
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };
  
  // If no testimonials provided
  if (!testimonials.length) {
    return null;
  }
  
  return (
    <motion.div 
      className={`relative overflow-hidden py-16 ${isDarkMode ? 'bg-card/30' : 'bg-muted/10'} rounded-3xl`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute left-0 top-0 w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      {/* Large quote marks */}
      <div className="absolute top-10 left-10 opacity-10">
        <Quote size={100} className="text-primary" />
      </div>
      
      {/* Testimonial slides */}
      <div className="container max-w-5xl mx-auto px-4 relative min-h-[320px] flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <div className={`${isDarkMode ? 'glass-effect' : 'morphic-card'} p-10 rounded-2xl shadow-xl mx-auto max-w-3xl`}>
              {/* Rating */}
              <div className="flex items-center mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < testimonials[currentIndex].rating ? "fill-warning text-warning" : "text-muted"} 
                  />
                ))}
              </div>
              
              {/* Testimonial text */}
              <p className="text-xl md:text-2xl font-medium mb-8 text-center">
                "{testimonials[currentIndex].text}"
              </p>
              
              {/* Author info */}
              <div className="flex flex-col items-center">
                {testimonials[currentIndex].avatar && (
                  <motion.img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}
                <motion.div 
                  className="text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-bold text-lg text-foreground">{testimonials[currentIndex].name}</h4>
                  <p className="text-muted-foreground">{testimonials[currentIndex].location}</p>
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {testimonials[currentIndex].service}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        {testimonials.length > 1 && (
          <>
            <motion.button 
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full 
                ${isDarkMode ? 'bg-card/70 hover:bg-card' : 'bg-white hover:bg-muted/10'} 
                shadow-lg z-10`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <motion.button 
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full 
                ${isDarkMode ? 'bg-card/70 hover:bg-card' : 'bg-white hover:bg-muted/10'} 
                shadow-lg z-10`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(1)}
            >
              <ChevronRight size={20} />
            </motion.button>
          </>
        )}
      </div>
      
      {/* Indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialSlider; 