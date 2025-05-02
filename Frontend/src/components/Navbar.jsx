import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Moon, Sun, ShoppingBag, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const handleMouseEnter = (dropdown) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };
  
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { 
        duration: 0.3, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const servicesDropdownContent = [
    { name: 'Home Cleaning', href: '/services/home-cleaning', icon: '🧹' },
    { name: 'Plumbing', href: '/services/plumbing', icon: '🔧' },
    { name: 'Electrical', href: '/services/electrical', icon: '⚡' },
    { name: 'Salon at Home', href: '/services/salon', icon: '💇' },
    { name: 'Appliance Repair', href: '/services/appliance', icon: '🔌' },
    { name: 'All Services', href: '/services', icon: '🔍' },
  ];
  
  const shopDropdownContent = [
    { name: 'Best Sellers', href: '/shop/best-sellers', icon: '🌟' },
    { name: 'New Arrivals', href: '/shop/new-arrivals', icon: '🆕' },
    { name: 'Home Essentials', href: '/shop/home-essentials', icon: '🏠' },
    { name: 'Kitchen', href: '/shop/kitchen', icon: '🍳' },
    { name: 'Electronics', href: '/shop/electronics', icon: '📱' },
    { name: 'All Products', href: '/shop', icon: '🛒' },
  ];

  const navLinks = [
    { name: 'Services', path: '/services', hasDropdown: true, dropdown: servicesDropdownContent },
    { name: 'Shop', path: '/shop', hasDropdown: true, dropdown: shopDropdownContent },
    { name: 'About', path: '/about', hasDropdown: false },
    { name: 'Contact', path: '/contact', hasDropdown: false },
  ];

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 w-full z-50 ${
          isScrolled 
            ? `bg-background/95 backdrop-blur-xl ${isDarkMode ? 'shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]' : 'shadow-lg'} py-2` 
            : 'bg-background/70 backdrop-blur-lg py-4'
        } transition-all duration-500`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="relative"
            whileHover={{ 
              scale: 1.05,
              rotateZ: [-1, 1, -1],
              transition: { duration: 0.5, repeat: Infinity }
            }}
            variants={itemVariants}
          >
            <Link to="/" className="flex items-center space-x-2 relative z-10">
              <div className={`text-2xl font-bold ${isDarkMode ? 'neon-text' : ''}`}>
                <span className="text-primary">Local</span>
                <span className="text-secondary">Link</span>
                <motion.span 
                  className="absolute -top-1 -right-6 text-accent text-xs"
                  animate={{ 
                    opacity: [1, 0.5, 1], 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap size={15} className="inline" />
                </motion.span>
              </div>
            </Link>
            {/* Background glow effect */}
            {isDarkMode && (
              <div className="absolute inset-0 bg-primary/20 filter blur-xl rounded-full w-12 h-12 -z-10"></div>
            )}
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((item, i) => (
              <motion.div 
                key={item.name}
                className="relative"
                variants={itemVariants}
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to={item.path} 
                  className={`px-3 py-2 rounded-lg ${
                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:text-primary'
                  } transition-all duration-300 relative group overflow-hidden flex items-center`}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-secondary to-accent rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ 
                      scaleX: location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) ? 1 : 0 
                    }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div 
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 ${
                          isDarkMode 
                            ? 'bg-card/95 border border-muted/30 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_0_10px_rgba(132,90,223,0.1)]' 
                            : 'bg-card/95 border border-muted/20 shadow-xl'
                        } rounded-xl backdrop-blur-lg overflow-hidden z-50`}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <div className="p-2">
                          {item.dropdown.map((subItem, j) => (
                            <motion.div 
                              key={subItem.name}
                              variants={itemVariants}
                              whileHover={{ x: 5 }}
                              className="relative"
                            >
                              <Link 
                                to={subItem.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                                  location.pathname === subItem.href
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-primary/5'
                                } transition-all duration-200 group`}
                              >
                                <span className="text-lg">{subItem.icon}</span>
                                <span>{subItem.name}</span>
                                <motion.span
                                  className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  →
                                </motion.span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <motion.div 
            className="hidden lg:block flex-1 max-w-md mx-6"
            variants={itemVariants}
          >
            <div 
              className={`relative group ${
                isDarkMode ? 'hover:shadow-[0_0_15px_rgba(156,81,161,0.2)]' : ''
              } rounded-full transition-all duration-500`}
              onClick={handleSearchFocus}
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-5 py-2.5 pl-12 pr-4 rounded-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-muted/30 border-2 border-muted/30 focus:border-primary/50 text-foreground'
                      : 'bg-muted/50 border-2 border-muted/20 focus:border-primary/30'
                  } focus:outline-none focus:ring-0`}
                />
                <Search className="absolute left-4 text-muted-foreground" size={18} />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-14 p-1 rounded-full hover:bg-muted/50"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={14} className="text-muted-foreground" />
                  </button>
                )}
                <button
                  type="submit"
                  className={`absolute right-3 rounded-full p-1.5 ${
                    isDarkMode 
                      ? 'bg-primary text-white' 
                      : 'bg-primary text-white'
                  } hover:opacity-90 transition-opacity`}
                >
                  <Search size={14} />
                </button>
              </form>
              
              {/* Search highlight effect */}
              {isDarkMode && (
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 rounded-full bg-primary/5 blur-md"></div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <motion.div
              whileHover={{ rotate: [0, -15, 15, -5, 0] }}
              transition={{ duration: 0.5 }}
              variants={itemVariants}
              className="relative"
            >
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-500 relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-muted/30 hover:bg-muted/50' 
                    : 'bg-muted/20 hover:bg-muted/30'
                }`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDarkMode ? 'dark' : 'light'}
                    initial={{ y: 20, opacity: 0, rotate: -30 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDarkMode ? (
                      <Sun size={20} className="text-secondary" />
                    ) : (
                      <Moon size={20} className="text-primary" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
              
              {/* Button highlight */}
              {isDarkMode && (
                <div className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-secondary/10 blur-md"></div>
                </div>
              )}
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="relative"
            >
              <Link 
                to="/shop" 
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-muted/30 hover:bg-muted/50 hover:text-secondary' 
                    : 'bg-muted/20 hover:bg-muted/30 hover:text-primary'
                }`}
                aria-label="Shop"
              >
                <ShoppingBag size={20} />
              </Link>
              
              {/* Button highlight */}
              {isDarkMode && (
                <div className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-secondary/10 blur-md"></div>
                </div>
              )}
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="relative"
            >
              <Link 
                to="/cart" 
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-muted/30 hover:bg-muted/50 hover:text-accent' 
                    : 'bg-muted/20 hover:bg-muted/30 hover:text-accent'
                }`}
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 15 
                    }}
                  >
                    <span className="text-xs font-bold text-white">{itemCount}</span>
                  </motion.div>
                )}
              </Link>
              
              {/* Button highlight */}
              {isDarkMode && (
                <div className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-accent/10 blur-md"></div>
                </div>
              )}
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="relative"
            >
              <Link 
                to={user ? "/profile" : "/login"} 
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-muted/30 hover:bg-muted/50 hover:text-primary' 
                    : 'bg-muted/20 hover:bg-muted/30 hover:text-primary'
                }`}
                aria-label={user ? "Profile" : "Login"}
              >
                <User size={20} />
              </Link>
              
              {/* Button highlight */}
              {isDarkMode && (
                <div className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-md"></div>
                </div>
              )}
            </motion.div>
            
            {/* Mobile menu button */}
            <motion.div 
              variants={itemVariants} 
              className="relative lg:hidden"
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-muted/30 hover:bg-muted/50' 
                    : 'bg-muted/20 hover:bg-muted/30'
                }`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isOpen ? 'open' : 'closed'}
                    initial={{ rotate: 0, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
              
              {/* Button highlight */}
              {isDarkMode && (
                <div className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-md"></div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu content */}
            <motion.div 
              className={`absolute right-0 top-0 h-full w-full max-w-sm ${
                isDarkMode 
                  ? 'bg-card border-l border-muted/30' 
                  : 'bg-card border-l border-muted/20'
              } shadow-2xl`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <Link 
                    to="/" 
                    className="text-2xl font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-primary">Local</span>
                    <span className="text-secondary">Link</span>
                  </Link>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-full ${
                      isDarkMode ? 'bg-muted/30 hover:bg-muted/50' : 'bg-muted/20 hover:bg-muted/30'
                    } transition-colors`}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Search Bar - Mobile */}
                <div className="mb-8">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full px-4 py-3 pl-12 rounded-xl ${
                        isDarkMode 
                          ? 'bg-muted/30 border-2 border-muted/30 focus:border-primary/50' 
                          : 'bg-muted/50 border-2 border-muted/20 focus:border-primary/30'
                      } focus:outline-none focus:ring-0`}
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <button
                      type="submit"
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-1.5 ${
                        isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white'
                      }`}
                    >
                      <Search size={14} />
                    </button>
                  </form>
                </div>
                
                {/* Mobile Navigation Links */}
                <nav className="space-y-1 mb-8">
                  {navLinks.map((item, i) => (
                    <div key={item.name}>
                      <button
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl ${
                          location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted/30'
                        } transition-all duration-200`}
                        onClick={() => {
                          if (item.hasDropdown) {
                            setActiveDropdown(activeDropdown === item.name ? null : item.name);
                          } else {
                            navigate(item.path);
                            setIsOpen(false);
                          }
                        }}
                      >
                        <span className="text-lg font-medium">{item.name}</span>
                        {item.hasDropdown && (
                          <ChevronDown 
                            size={18} 
                            className={`transition-transform duration-300 ${
                              activeDropdown === item.name ? 'rotate-180' : ''
                            }`} 
                          />
                        )}
                      </button>
                      
                      {/* Mobile Dropdown */}
                      {item.hasDropdown && (
                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className={`ml-4 pl-4 border-l-2 ${isDarkMode ? 'border-muted/30' : 'border-muted/50'} mt-1 space-y-1`}>
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                                      location.pathname === subItem.href
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-muted/30'
                                    } transition-all duration-200`}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <span className="text-lg">{subItem.icon}</span>
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  ))}
                </nav>
                
                {/* Action Buttons - Mobile */}
                <div className="space-y-3 mt-auto pb-6">
                  <Button 
                    variant="primary" 
                    className="w-full py-3 flex items-center justify-center gap-2"
                    onClick={() => {
                      navigate(user ? '/profile' : '/login');
                      setIsOpen(false);
                    }}
                  >
                    <User size={18} />
                    {user ? 'My Account' : 'Sign In'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-3 flex items-center justify-center gap-2"
                    onClick={() => {
                      navigate('/contact');
                      setIsOpen(false);
                    }}
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Space for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;