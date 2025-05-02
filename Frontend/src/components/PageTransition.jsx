import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Skip loader on initial render after 300ms
    if (isFirstRender) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsFirstRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    
    // Show loader on route change
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate loading progress
    const duration = 600; // Total loading time (ms)
    const interval = 20; // Update interval (ms)
    const steps = duration / interval;
    const increment = 100 / steps;
    
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 100); // Small delay before hiding loader
          return 100;
        }
        return newProgress;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [location.pathname, isFirstRender]);
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };
  
  // Loader variants
  const loaderVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            variants={loaderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={`fixed inset-0 ${isDarkMode ? 'bg-background/95' : 'bg-background/95'} backdrop-blur-md`}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Logo animation */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-8"
              >
                <div className="text-3xl font-bold relative">
                  <span className="text-primary">Local</span>
                  <span className="text-secondary">Link</span>
                  
                  {/* Glow effect in dark mode */}
                  {isDarkMode && (
                    <div className="absolute inset-0 bg-primary/20 filter blur-xl rounded-full w-full h-full -z-10"></div>
                  )}
                </div>
              </motion.div>
              
              {/* Progress bar */}
              <div className="w-48 h-1 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              
              <motion.div 
                className="text-muted-foreground mt-3 text-sm"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Loading...
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageTransition; 