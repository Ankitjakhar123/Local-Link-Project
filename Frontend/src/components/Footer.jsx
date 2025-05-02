import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };
  
  const socialIconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    hover: {
      scale: 1.2,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className={`pt-16 pb-8 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-b from-background to-primary/5 border-t border-muted' 
          : 'bg-gradient-to-b from-background to-primary/5 border-t border-border'
      }`}
    >
      {/* Animated background elements */}
      {isDarkMode && (
        <>
          <motion.div 
            className="absolute top-40 left-[10%] w-72 h-72 rounded-full bg-primary/5 filter blur-[80px]"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -30, 0],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-40 right-[15%] w-60 h-60 rounded-full bg-secondary/5 filter blur-[70px]"
            animate={{ 
              x: [0, -20, 0],
              y: [0, 30, 0],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          ></motion.div>
        </>
      )}

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'gradient-text' : ''}`}>Local<span className="text-accent font-bold">Link</span></h3>
              <div className={`w-12 h-1 bg-primary rounded ${isDarkMode ? 'glow' : ''}`}></div>
            </div>
            <p className="text-muted-foreground mb-6">
              India's largest home services platform. Book reliable & high-quality services delivered by trained professionals conveniently at home.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, link: "https://facebook.com", label: "Facebook" },
                { Icon: Twitter, link: "https://twitter.com", label: "Twitter" },
                { Icon: Instagram, link: "https://instagram.com", label: "Instagram" },
                { Icon: Linkedin, link: "https://linkedin.com", label: "LinkedIn" },
                { Icon: Youtube, link: "https://youtube.com", label: "YouTube" }
              ].map((social, i) => (
                <motion.a 
                  key={social.label}
                  href={social.link} 
                  className={`p-2 rounded-full ${
                    isDarkMode 
                      ? 'bg-muted/30 text-muted-foreground hover:text-primary hover:bg-muted/50' 
                      : 'bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80'
                  } transition-all duration-300`}
                  aria-label={social.label}
                  variants={socialIconVariants}
                  whileHover="hover"
                  custom={i}
                >
                  <social.Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1 text-foreground">Quick Links</h3>
              <div className={`w-12 h-1 bg-accent rounded ${isDarkMode ? 'glow' : ''}`}></div>
            </div>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Shop", path: "/shop" },
                { name: "FAQs", path: "/FAQ" },
                { name: "Refund", path: "/Refund" },
                { name: "Terms & Conditions", path: "/terms" },
                { name: "Privacy Policy", path: "/privacy" }
              ].map((link, i) => (
                <motion.li key={link.name}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center"
                  >
                    <ChevronRight size={16} className="mr-1 text-primary" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1 text-foreground">Our Services</h3>
              <div className={`w-12 h-1 bg-secondary rounded ${isDarkMode ? 'glow' : ''}`}></div>
            </div>
            <ul className="space-y-3">
              {[
                { id: 1, name: "Salon at Home" },
                { id: 2, name: "Appliance Repair" },
                { id: 3, name: "Home Cleaning" },
                { id: 4, name: "Plumbing" },
                { id: 5, name: "Electrical" },
                { id: 7, name: "Carpentry" },
                { id: 6, name: "Pest Control" }
              ].map((service, i) => (
                <motion.li key={service.id}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    to={`/services/${service.id}`} 
                    className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center"
                  >
                    <ChevronRight size={16} className="mr-1 text-secondary" />
                    {service.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1 text-foreground">Contact Us</h3>
              <div className={`w-12 h-1 bg-primary rounded ${isDarkMode ? 'glow' : ''}`}></div>
            </div>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start space-x-3"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-muted/30' : 'bg-muted/50'} mt-1`}>
                  <MapPin className="text-primary flex-shrink-0" size={16} />
                </div>
                <span className="text-muted-foreground">
                  Local Link, Gurugram, Haryana, 122001, India
                </span>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-muted/30' : 'bg-muted/50'}`}>
                  <Phone className="text-primary flex-shrink-0" size={16} />
                </div>
                <a href="tel:+919999999999" className="text-muted-foreground hover:text-primary transition-all duration-200">
                  +91 9999999999
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-muted/30' : 'bg-muted/50'}`}>
                  <Mail className="text-primary flex-shrink-0" size={16} />
                </div>
                <a href="mailto:support@LocalLink.com" className="text-muted-foreground hover:text-primary transition-all duration-200">
                  support@LocalLink.com
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Cities */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-border"
        >
          <h4 className="text-md font-medium mb-4 text-foreground">We Service in</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 
              'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Kochi'
            ].map((city, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
              >
                <Link 
                  to={`/city/${city.toLowerCase().replace(' ', '-')}`} 
                  className={`text-sm text-muted-foreground hover:text-primary transition-all duration-200 block py-1 px-3 rounded-md ${
                    isDarkMode ? 'hover:bg-muted/30' : 'hover:bg-muted/50'
                  }`}
                >
                  {city}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium badge */}
        {isDarkMode && (
          <motion.div
            className="absolute top-5 right-5"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="px-4 py-1.5 bg-card/80 backdrop-blur-md border border-primary/20 text-xs font-medium rounded-full relative">
                <span className="text-gradient">PREMIUM DARK MODE</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Copyright */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()} 
            <span className={`font-semibold ${isDarkMode ? 'text-primary' : ''}`}>LocalLink</span>. 
            All rights reserved.
          </p>
          <motion.p 
            className="mt-1 text-xs opacity-60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
          >
            Made with 
            <motion.span 
              className="inline-block mx-1 text-red-500"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >♥</motion.span> 
            in India
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;