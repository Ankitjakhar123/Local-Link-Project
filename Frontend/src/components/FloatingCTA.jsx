import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, AlignJustify, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const FloatingCTA = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Show the CTA button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 25% of viewport height
      setIsVisible(window.scrollY > window.innerHeight * 0.25);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };
  
  // Action items
  const actionItems = [
    { 
      id: 'call', 
      icon: <Phone size={20} />, 
      label: 'Call Us', 
      href: 'tel:+1234567890',
      color: 'bg-primary hover:bg-primary/90 text-white'
    },
    { 
      id: 'chat', 
      icon: <MessageCircle size={20} />, 
      label: 'Live Chat', 
      href: '/contact#chat',
      color: 'bg-secondary hover:bg-secondary/90 text-white'
    },
    { 
      id: 'services', 
      icon: <AlignJustify size={20} />, 
      label: 'Services', 
      href: '/services',
      color: 'bg-accent hover:bg-accent/90 text-white'
    },
    { 
      id: 'quote', 
      icon: <ScrollText size={20} />, 
      label: 'Quote', 
      href: '/quote',
      color: 'bg-success hover:bg-success/90 text-white'
    }
  ];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-6 right-6 z-40"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Menu items */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className="flex flex-col-reverse items-end gap-3 mb-4"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {actionItems.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    custom={i}
                    variants={itemVariants}
                    className="flex items-center"
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center gap-2 ${item.color} px-3 py-2 rounded-lg shadow-lg mr-2`}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.icon}
                    </Link>
                    
                    {/* Connecting line */}
                    <div className={`w-3 h-0.5 ${isDarkMode ? 'bg-muted/30' : 'bg-muted/50'}`}></div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main toggle button */}
          <motion.button
            className={`w-14 h-14 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-br from-primary to-accent' 
                : 'bg-primary'
            } text-white flex items-center justify-center shadow-lg relative`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'close' : 'open'}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : (
                  <div className="relative">
                    <MessageCircle size={24} />
                    <motion.div 
                      className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Ripple effect */}
            {!isOpen && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(156, 81, 161, 0.4)',
                    '0 0 0 12px rgba(156, 81, 161, 0)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA; 