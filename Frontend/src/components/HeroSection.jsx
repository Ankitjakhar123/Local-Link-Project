import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

const HeroSection = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Parent container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  // Child variants for staggered animations
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.section 
      className={`relative overflow-hidden min-h-[90vh] flex items-center`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background effects */}
      {isDarkMode && (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
          <motion.div 
            className="absolute top-20 left-[10%] w-96 h-96 rounded-full bg-primary/10 filter blur-[100px]"
            animate={{ 
              x: [0, 50, 0],
              y: [0, 30, 0],
              opacity: [0.5, 0.7, 0.5] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-40 right-[15%] w-80 h-80 rounded-full bg-secondary/10 filter blur-[100px]"
            animate={{ 
              x: [0, -30, 0],
              y: [0, 50, 0],
              opacity: [0.4, 0.6, 0.4] 
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-[40%] right-[30%] w-60 h-60 rounded-full bg-accent/10 filter blur-[80px]"
            animate={{ 
              x: [0, -20, 0],
              y: [0, -40, 0],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          ></motion.div>
        </>
      )}

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center py-16 relative z-10">
        {/* Left column - Text content */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isDarkMode ? 'neon-text' : ''}`}>
              <span className="gradient-text">Local Services</span> <br />
              At Your Fingertips
            </h1>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <p className="text-lg md:text-xl text-muted-foreground">
              Find trusted professionals for home services, repairs, and more. Quality service guaranteed with verified local experts.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSearchSubmit} className="relative flex max-w-md mt-8">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`input pl-10 w-full ${isDarkMode ? 'bg-background/70 backdrop-blur-sm' : ''} py-3 rounded-l-md rounded-r-none`}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              <Button 
                type="submit" 
                glowEffect={true} 
                className="rounded-l-none"
              >
                Search
              </Button>
            </form>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-4 items-center"
          >
            <span className="text-muted-foreground">Popular:</span>
            {['Cleaning', 'Plumbing', 'Electrical', 'Salon'].map((service) => (
              <motion.span 
                key={service}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                  isDarkMode 
                    ? 'bg-muted/30 hover:bg-primary/20 text-foreground' 
                    : 'bg-muted hover:bg-primary/10 text-foreground'
                }`}
                onClick={() => {
                  setSearchQuery(service);
                  navigate(`/search?q=${encodeURIComponent(service)}`);
                }}
              >
                {service}
              </motion.span>
            ))}
          </motion.div>
        </div>
        
        {/* Right column - Image or illustration */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-2xl'}`}>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Home services" 
                className="w-full h-auto rounded-lg object-cover aspect-[4/3]"
              />
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-background via-transparent to-transparent' : 'bg-gradient-to-t from-white/30 to-transparent'}`}></div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
              className={`absolute top-4 left-4 p-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-card/70 backdrop-blur-sm border border-primary/20 shadow-[0_0_20px_rgba(132,90,223,0.2)]' 
                  : 'bg-white/90 backdrop-blur-sm shadow-lg'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                  <span className="text-xs font-bold">4.9</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">4.9/5 Rating</div>
                  <div className="text-xs text-muted-foreground">From 10k+ reviews</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`absolute bottom-4 right-4 p-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-card/70 backdrop-blur-sm border border-accent/20 shadow-[0_0_20px_rgba(249,115,22,0.2)]' 
                  : 'bg-white/90 backdrop-blur-sm shadow-lg'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
                  <span className="text-xs font-bold">24h</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">Fast Service</div>
                  <div className="text-xs text-muted-foreground">24/7 availability</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className={`absolute -bottom-5 -left-5 p-4 rounded-lg ${
              isDarkMode 
                ? 'bg-card/90 backdrop-blur-sm border border-secondary/20 shadow-[0_0_20px_rgba(14,165,233,0.2)]' 
                : 'bg-white shadow-xl'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center text-white">
                <ArrowRight size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold">Book Now</div>
                <div className="text-xs text-muted-foreground">Instant confirmation</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection; 