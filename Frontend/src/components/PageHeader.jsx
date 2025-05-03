import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ 
  title, 
  description, 
  icon: Icon, 
  backgroundImage,
  accentColor = 'primary',
  align = 'center'
}) => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <div className="absolute inset-0 opacity-10">
            <img 
              src={backgroundImage} 
              alt="" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background"></div>
          </div>
        )}
        
        <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br from-${accentColor}/10 to-transparent rounded-full opacity-70`}></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-secondary/10 to-transparent rounded-full opacity-70"></div>
        
        {/* Complete 3D circles */}
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full border border-primary/20 opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full border border-secondary/20 opacity-20"></div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 cyberpunk-grid opacity-10"></div>
        
        {/* Animated dots */}
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={`dot-${index}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/50"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container relative z-10">
        {/* Section header */}
        <div className={`text-${align} mx-auto max-w-3xl`}>
          {Icon && (
            <motion.div
              className="inline-block mb-4 px-5 py-2 rounded-full bg-primary/10 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <span className={`text-${accentColor} font-medium flex items-center gap-2 justify-${align}`}>
                <Icon size={16} className="text-secondary" />
                {title}
              </span>
            </motion.div>
          )}
          
          <motion.h1 
            className="text-5xl font-bold mb-6 gradient-text relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
            {/* Glowing underline */}
            <motion.div 
              className={`absolute ${align === 'center' ? 'left-1/2 transform -translate-x-1/2' : 'left-0'} bottom-0 h-1 w-24 bg-gradient-to-r from-secondary via-primary to-accent rounded-full`}
              animate={{ 
                boxShadow: ['0 0 5px rgba(132, 90, 223, 0.3)', '0 0 20px rgba(132, 90, 223, 0.7)', '0 0 5px rgba(132, 90, 223, 0.3)'] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.h1>
          
          {description && (
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader; 