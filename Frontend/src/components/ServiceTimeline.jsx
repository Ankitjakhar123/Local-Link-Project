import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ServiceTimeline = ({ steps = [] }) => {
  const { isDarkMode } = useTheme();
  const controls = useAnimation();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const [activeStep, setActiveStep] = useState(null);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Default steps if none provided
  const defaultSteps = [
    {
      icon: '📱',
      title: 'Book Service',
      description: 'Choose your service and select a convenient time slot from our app or website.'
    },
    {
      icon: '🔍',
      title: 'Professional Assignment',
      description: 'We assign the best qualified professional based on your requirements.'
    },
    {
      icon: '🧰',
      title: 'Service Delivery',
      description: 'Our professional arrives on time and delivers high-quality service.'
    },
    {
      icon: '💳',
      title: 'Payment',
      description: 'Pay securely through our platform after service completion.'
    },
    {
      icon: '⭐',
      title: 'Feedback',
      description: 'Rate your experience and provide feedback to help us improve.'
    }
  ];
  
  const timelineSteps = steps.length > 0 ? steps : defaultSteps;
  
  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      ref={containerRef}
      className="py-16"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="container max-w-5xl mx-auto px-4">
        <motion.h2 
          className={`text-3xl md:text-4xl font-bold mb-16 text-center ${isDarkMode ? 'gradient-text' : 'text-foreground'}`}
          variants={itemVariants}
        >
          How It Works
        </motion.h2>
        
        <div className="relative">
          {/* Timeline connector line */}
          <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 ${isDarkMode ? 'bg-gradient-to-b from-primary via-secondary to-accent' : 'bg-muted/50'} z-0`}></div>
          
          {/* Timeline steps */}
          <div className="relative z-10">
            {timelineSteps.map((step, index) => (
              <motion.div 
                key={index}
                className={`mb-16 flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                variants={itemVariants}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Timeline node */}
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 mx-auto
                    ${activeStep === index 
                      ? 'bg-accent shadow-[0_0_15px_rgba(156,81,161,0.7)]' 
                      : 'bg-primary'
                    } transition-all duration-300`}
                  animate={activeStep === index ? {
                    scale: [1, 1.2, 1],
                    backgroundColor: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--primary))'],
                    transition: { duration: 2, repeat: Infinity }
                  } : {}}
                >
                  <span className="relative z-10">{index + 1}</span>
                </motion.div>
                
                {/* Timeline content */}
                <motion.div 
                  className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`p-6 rounded-xl ${
                    isDarkMode 
                      ? activeStep === index 
                        ? 'bg-card/80 border border-accent/30 shadow-[0_10px_30px_-15px_rgba(156,81,161,0.4)]' 
                        : 'bg-card/50 border border-muted/30' 
                      : activeStep === index 
                        ? 'bg-card shadow-lg border border-primary/20' 
                        : 'bg-card/80 border border-muted/20'
                  } transition-all duration-300`}>
                    <div className="flex items-start mb-4">
                      <div className="text-3xl mr-4">{step.icon}</div>
                      <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceTimeline; 