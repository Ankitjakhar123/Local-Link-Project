import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const InteractivePricing = ({ plans = [] }) => {
  const { isDarkMode } = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  
  // Default plans if none provided
  const defaultPlans = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 499,
      yearlyPrice: 4999,
      features: [
        { name: 'Priority Booking', included: true },
        { name: '5% Discount on Services', included: true },
        { name: 'Dedicated Support', included: false },
        { name: 'Free Service Checkup', included: false },
        { name: 'Premium Time Slots', included: false },
      ],
      popular: false,
      color: 'primary'
    },
    {
      id: 'standard',
      name: 'Standard',
      monthlyPrice: 999,
      yearlyPrice: 9999,
      features: [
        { name: 'Priority Booking', included: true },
        { name: '10% Discount on Services', included: true },
        { name: 'Dedicated Support', included: true },
        { name: 'Free Service Checkup', included: false },
        { name: 'Premium Time Slots', included: false },
      ],
      popular: true,
      color: 'secondary'
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 1999,
      yearlyPrice: 19999,
      features: [
        { name: 'Priority Booking', included: true },
        { name: '15% Discount on Services', included: true },
        { name: 'Dedicated Support', included: true },
        { name: 'Free Service Checkup', included: true },
        { name: 'Premium Time Slots', included: true },
      ],
      popular: false,
      color: 'accent'
    }
  ];
  
  const pricingPlans = plans.length > 0 ? plans : defaultPlans;
  
  // Animation variants
  const cardVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.05, transition: { duration: 0.3 } }
  };
  
  const priceVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <div className="py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'gradient-text' : 'text-foreground'}`}>
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Select the plan that works best for your needs. All plans come with our quality service guarantee.
          </p>
          
          {/* Toggle switch */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
              aria-label={isAnnual ? "Switch to monthly billing" : "Switch to annual billing"}
            >
              <motion.div 
                className="absolute bg-white w-6 h-6 rounded-full shadow-md"
                animate={{ x: isAnnual ? 32 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`ml-3 flex items-center ${isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Yearly
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                isAnnual ? 'bg-success/20 text-success' : 'bg-muted/50 text-muted-foreground'
              }`}>
                Save 15%
              </span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-2xl transition-all ${
                plan.popular 
                  ? isDarkMode ? 'neon-border' : 'border-2 border-secondary' 
                  : 'border border-muted/30'
              }`}
              variants={cardVariants}
              animate={activePlan === plan.id ? 'active' : 'inactive'}
              onMouseEnter={() => setActivePlan(plan.id)}
              onMouseLeave={() => setActivePlan(null)}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground text-sm font-semibold px-4 py-1 rounded-full shadow-lg flex items-center">
                  <Sparkles size={14} className="mr-1" />
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 rounded-2xl h-full flex flex-col ${
                isDarkMode
                  ? plan.popular 
                    ? 'bg-card/70 backdrop-blur-sm' 
                    : 'bg-card/50'
                  : plan.popular 
                    ? 'bg-card shadow-xl' 
                    : 'bg-card'
              }`}>
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 text-${plan.color}`}>{plan.name}</h3>
                  <div className="h-16 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isAnnual ? 'yearly' : 'monthly'}
                        className="flex items-baseline"
                        variants={priceVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <span className="text-muted-foreground">₹</span>
                        <span className="text-4xl font-bold text-foreground">
                          {isAnnual ? plan.yearlyPrice / 100 : plan.monthlyPrice / 100}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.included ? (
                        <Check className="text-success mr-3 shrink-0 mt-0.5" size={18} />
                      ) : (
                        <X className="text-muted-foreground mr-3 shrink-0 mt-0.5" size={18} />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <motion.button
                  className={`w-full py-3 rounded-xl font-medium text-center mt-auto ${
                    plan.popular 
                      ? `bg-${plan.color} text-white`
                      : `border-2 border-${plan.color} text-${plan.color} bg-transparent hover:bg-${plan.color}/10`
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Choose {plan.name}
                </motion.button>
              </div>
              
              {/* Glow effect for popular plan */}
              {plan.popular && isDarkMode && (
                <div className="absolute inset-0 -z-10 opacity-20 rounded-2xl">
                  <div className={`absolute inset-0 bg-${plan.color} rounded-2xl blur-xl`}></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10 text-sm text-muted-foreground">
          All plans include a 7-day free trial. No credit card required.
        </div>
      </div>
    </div>
  );
};

export default InteractivePricing; 