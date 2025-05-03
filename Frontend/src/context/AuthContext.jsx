import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { useNotification } from '../components/NotificationSystem';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('LocalLinkUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // Validate the token by fetching current user
      validateToken();
    }
    setLoading(false);
  }, []);

  // Validate the saved token by making an API call
  const validateToken = async () => {
    try {
      const userData = await authService.getCurrentUser();
      // Update user data with the latest from server
      const savedUser = JSON.parse(localStorage.getItem('LocalLinkUser') || '{}');
      const updatedUser = { ...userData.data, token: savedUser.token };
      localStorage.setItem('LocalLinkUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      // If token is invalid, log out
      console.error('Token validation failed:', error);
      localStorage.removeItem('LocalLinkUser');
      setUser(null);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.data);
      showNotification({
        title: 'Login Successful',
        message: 'Welcome back!',
        type: 'success'
      });
      return response;
    } catch (error) {
      showNotification({
        title: 'Login Failed',
        message: error.toString(),
        type: 'error'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      setUser(response.data);
      showNotification({
        title: 'Registration Successful',
        message: 'Your account has been created!',
        type: 'success'
      });
      return response;
    } catch (error) {
      showNotification({
        title: 'Registration Failed',
        message: error.toString(),
        type: 'error'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      showNotification({
        title: 'Logged Out',
        message: 'You have been logged out successfully',
        type: 'info'
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the user from state even if API call fails
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.updateDetails(userData);
      
      // Update the local user data but preserve the token
      const updatedUser = {
        ...response.data,
        token: user.token
      };
      
      localStorage.setItem('LocalLinkUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      showNotification({
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
        type: 'success'
      });
      
      return response;
    } catch (error) {
      showNotification({
        title: 'Update Failed',
        message: error.toString(),
        type: 'error'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      loading,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};