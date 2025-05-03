import React from 'react';
import { motion } from 'framer-motion';

const SectionContainer = ({ 
  children, 
  title, 
  subtitle,
  icon: Icon,
  className = '',
  bgClassName = '',
  containerClassName = '',
  overflowHidden = true,
  titleCenter = true,
  backgroundElements = true
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className={`py-16 relative ${overflowHidden ? 'overflow-hidden' : ''} ${bgClassName}`}>
      {/* Background elements if enabled */}
      {backgroundElements && (
        <div className="absolute inset-0 z-0">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-50 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-secondary/5 to-transparent opacity-50 blur-3xl"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 cyberpunk-grid opacity-5"></div>
        </div>
      )}
      
      <div className={`container relative z-10 ${containerClassName}`}>
        {/* Section title if provided */}
        {(title || subtitle) && (
          <motion.div 
            className={`mb-12 ${titleCenter ? 'text-center mx-auto max-w-3xl' : ''}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {Icon && (
              <motion.div 
                className="inline-block mb-4"
                variants={itemVariant}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Icon size={18} className="text-primary" />
                  <span className="text-sm font-medium text-primary">{subtitle || title}</span>
                </div>
              </motion.div>
            )}
            
            {title && (
              <motion.h2 
                className="text-4xl font-bold mb-4 relative inline-block gradient-text"
                variants={itemVariant}
              >
                {title}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-1 w-24 bg-gradient-to-r from-secondary via-primary to-accent rounded-full"
                  animate={{ 
                    boxShadow: ['0 0 5px rgba(132, 90, 223, 0.3)', '0 0 15px rgba(132, 90, 223, 0.5)', '0 0 5px rgba(132, 90, 223, 0.3)'] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.h2>
            )}
            
            {subtitle && title && (
              <motion.p 
                className="text-lg text-muted-foreground" 
                variants={itemVariant}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}
        
        {/* Content container */}
        <div className={className}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionContainer; 