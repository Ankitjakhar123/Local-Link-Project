import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useNotification } from '../components/NotificationSystem';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const containerRef = useRef(null);

  // Remove the 3D tilt effect entirely

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup form submitted", formData);
    
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }
    
    try {
      console.log("Attempting signup...");
      const response = await signup(formData);
      console.log("Signup successful", response);
      navigate('/'); // Redirect to home page after successful signup
    } catch (error) {
      console.error('Signup error:', error);
      // Display a user-friendly error in the UI
      setErrors({
        ...errors,
        general: typeof error === 'string' ? error : 'Failed to create account. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center relative overflow-hidden bg-background">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        
        {/* Animated circles */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full border border-primary/10 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full border border-secondary/10 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 cyberpunk-grid opacity-5"></div>
        
        {/* Animated dots */}
        {[...Array(12)].map((_, index) => (
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
        
        {/* Light beams */}
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 rotate-[30deg] transform-gpu blur-[5px]"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-secondary/0 via-secondary/10 to-secondary/0 -rotate-[20deg] transform-gpu blur-[5px]"></div>
      </div>
      
      {/* Glass Card Container - without 3D effect */}
      <div 
        ref={containerRef}
        className="w-full max-w-lg relative z-10"
      >
        <div className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 via-background to-secondary/20">
          <div className="bg-card/80 backdrop-blur-md rounded-xl border border-white/5 shadow-xl p-8 relative overflow-hidden">
            {/* Card background effects */}
            <div className="absolute inset-0 bg-card opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
            
            {/* Shimmer effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-y-12 transform-gpu blur-md opacity-30 animate-[shimmer_5s_infinite]"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Create Account</h1>
                <p className="text-muted-foreground">
                  Join LocalLink and access premium services
                </p>
              </motion.div>
              
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* General error message */}
                {errors.general && (
                  <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">
                    {errors.general}
                  </div>
                )}
                
                {/* Name field */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground/80">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border-2 ${
                        errors.name ? 'border-error/50 focus:border-error' : 'border-primary/10 focus:border-primary/30'
                      } focus:outline-none transition-colors`}
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  </div>
                  {errors.name && (
                    <p className="text-error text-sm mt-1 flex items-center">
                      <span className="ml-1">{errors.name}</span>
                    </p>
                  )}
                </div>
                
                {/* Email field */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground/80">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border-2 ${
                        errors.email ? 'border-error/50 focus:border-error' : 'border-primary/10 focus:border-primary/30'
                      } focus:outline-none transition-colors`}
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  </div>
                  {errors.email && (
                    <p className="text-error text-sm mt-1 flex items-center">
                      <span className="ml-1">{errors.email}</span>
                    </p>
                  )}
                </div>
                
                {/* Phone field */}
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium mb-1 text-foreground/80">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border-2 ${
                        errors.phone ? 'border-error/50 focus:border-error' : 'border-primary/10 focus:border-primary/30'
                      } focus:outline-none transition-colors`}
                      placeholder="Enter your phone number"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  </div>
                  {errors.phone && (
                    <p className="text-error text-sm mt-1 flex items-center">
                      <span className="ml-1">{errors.phone}</span>
                    </p>
                  )}
                </div>
                
                {/* Password field */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground/80">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg bg-background/50 backdrop-blur-sm border-2 ${
                        errors.password ? 'border-error/50 focus:border-error' : 'border-primary/10 focus:border-primary/30'
                      } focus:outline-none transition-colors`}
                      placeholder="Create a password"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-error text-sm mt-1 flex items-center">
                      <span className="ml-1">{errors.password}</span>
                    </p>
                  )}
                </div>
                
                {/* Confirm Password field */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-foreground/80">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg bg-background/50 backdrop-blur-sm border-2 ${
                        errors.confirmPassword ? 'border-error/50 focus:border-error' : 'border-primary/10 focus:border-primary/30'
                      } focus:outline-none transition-colors`}
                      placeholder="Confirm your password"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-error text-sm mt-1 flex items-center">
                      <span className="ml-1">{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>
                
                {/* Terms and conditions */}
                <div className="flex items-start my-4">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/30"
                    />
                  </div>
                  <div className="ml-3 text-sm text-muted-foreground">
                    <label htmlFor="terms">
                      I agree to the <Link to="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link>
                    </label>
                  </div>
                </div>
                
                {/* Submit button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium relative overflow-hidden group"
                    disabled={loading}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="absolute inset-0 w-0 bg-white mix-blend-overlay rounded-lg group-hover:w-full transition-all duration-300 ease-out"></span>
                    <span className="relative flex items-center justify-center">
                      {loading ? 'Creating account...' : 'Sign Up'}
                      {!loading && <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />}
                    </span>
                  </button>
                </motion.div>
              </motion.form>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 pt-6 border-t border-white/10 text-center"
              >
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;