import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNotification } from '../components/NotificationSystem';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const containerRef = useRef(null);

  // Remove the 3D tilt effect entirely

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    console.log("Login form submitted", formData);
    
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }
    
    try {
      console.log("Attempting login...");
      const response = await login(formData);
      console.log("Login successful", response);
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Login error:', error);
      // Display a user-friendly error in the UI
      setErrors({
        ...errors,
        general: typeof error === 'string' ? error : 'Failed to log in. Please check your credentials and try again.'
      });
    }
  };

  // For testing/demo purposes only - remove in production
  const handleTestLogin = () => {
    setFormData({
      email: 'test@example.com',
      password: 'password123'
    });
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
        className="w-full max-w-md relative z-10"
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
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Welcome Back</h1>
                <p className="text-muted-foreground">
                  Sign in to your LocalLink account
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
                
                <div className="space-y-5">
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
                        placeholder="Enter your password"
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
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded bg-background/50 border-primary/30 text-primary focus:ring-primary/30 h-4 w-4"
                      />
                      <label htmlFor="remember" className="ml-2 text-foreground/80">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  
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
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />}
                      </span>
                    </button>
                  </motion.div>
                  
                  {/* Demo login button - remove in production */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleTestLogin}
                      className="text-xs text-primary/70 hover:text-primary transition-colors"
                    >
                      Test login details
                    </button>
                  </div>
                </div>
              </motion.form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account?</span>{' '}
                <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;