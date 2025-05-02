import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, MousePointer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ParallaxHero = ({ onSearch }) => {
  const { isDarkMode } = useTheme();
  const heroRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedBackground, setAnimatedBackground] = useState(true);
  
  // Scroll animations
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });
  const springY3 = useSpring(y3, { stiffness: 100, damping: 30 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the hero section center
      const x = (clientX - left - width / 2) / 50;
      const y = (clientY - top - height / 2) / 50;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Animated background particles
  const particlesCount = 20;
  const particles = Array.from({ length: particlesCount }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 10
  }));

  return (
    <motion.section 
      ref={heroRef}
      className="relative h-[85vh] overflow-hidden bg-gradient-to-br from-background to-background/60 flex items-center justify-center"
      style={{ scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background */}
      {animatedBackground && isDarkMode && (
        <>
          {/* Animated grid */}
          <div className="absolute inset-0 cyberpunk-grid opacity-20"></div>
          
          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-primary/30"
                style={{
                  width: particle.size,
                  height: particle.size,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.size/2}px rgba(132, 90, 223, 0.3)`
                }}
                animate={{
                  y: [0, -500, 0],
                  x: [0, Math.sin(particle.id) * 50, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Parallax background layers */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          y: springY1,
          x: mousePosition.x * -1,
        }}
      >
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-30' : 'opacity-10'}`}>
          <svg width="100%" height="100%" className="text-primary/10">
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute left-0 bottom-0 w-64 h-64 md:w-96 md:h-96 z-0 blur-xl opacity-30"
        style={{ 
          y: springY2,
          x: mousePosition.x * 0.5,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/50 to-secondary/50"></div>
      </motion.div>
      
      <motion.div 
        className="absolute right-0 top-0 w-64 h-64 md:w-96 md:h-96 z-0 blur-xl opacity-30"
        style={{ 
          y: springY3,
          x: mousePosition.x * -0.3,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-secondary/50 to-accent/50"></div>
      </motion.div>
      
      {/* Content */}
      <div className="container relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-block mb-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium">One-stop solution for all your home needs</span>
          </motion.div>
          
          <motion.h1 
            className={`text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight ${isDarkMode ? 'gradient-text' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Home Services at Your Doorstep
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Book trusted, professional services for all your home needs. Quality service guaranteed.
          </motion.p>
          
          <motion.form 
            onSubmit={handleSearchSubmit}
            className={`${isDarkMode ? 'glass-effect' : 'frosted-glass'} shadow-2xl rounded-2xl p-3 flex items-center mx-auto max-w-2xl transition-all duration-500`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Search className="ml-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search for services (cleaning, plumbing, salon...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none p-3 outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button 
              type="submit" 
              className="btn btn-primary rounded-xl"
            >
              Search
            </button>
          </motion.form>
          
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-3 mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <span>Popular:</span>
            {['Cleaning', 'Plumbing', 'Electrician', 'Salon', 'AC Repair'].map((tag, i) => (
              <Link 
                key={tag} 
                to={`/services/${tag.toLowerCase()}`}
                className="px-3 py-1 rounded-full border border-muted hover:border-primary hover:text-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </motion.div>
          
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7, y: [0, 10, 0] }}
            transition={{ 
              opacity: { duration: 1, delay: 1.4 },
              y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            }}
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
          >
            <span className="text-sm">Scroll to explore</span>
            <MousePointer className="mt-1" size={20} />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ParallaxHero; 