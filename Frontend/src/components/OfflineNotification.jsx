import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineNotification = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Update network status
    const handleOnline = () => {
      setIsOffline(false);
      // Show briefly for reconnection notification, then hide
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShow(true);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize visibility
    setShow(isOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const variants = {
    hidden: { 
      opacity: 0,
      y: -100 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300
      } 
    },
    exit: { 
      opacity: 0,
      y: -100,
      transition: {
        duration: 0.3
      } 
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
        >
          <div className={`
            px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md
            ${isOffline 
              ? 'bg-red-900/80 text-white border border-red-700' 
              : 'bg-green-900/80 text-white border border-green-700'}
          `}>
            <div className={`
              w-3 h-3 rounded-full ${isOffline ? 'bg-red-400' : 'bg-green-400'} 
              animate-pulse
            `}></div>
            <p className="font-medium">
              {isOffline 
                ? 'You are offline. Some features may be unavailable.' 
                : 'You are back online!'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotification; 