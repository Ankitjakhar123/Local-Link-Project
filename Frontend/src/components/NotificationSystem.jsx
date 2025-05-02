import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Notification context to provide easy access to the notification system throughout the app
 */
import { createContext, useContext } from 'react';

const NotificationContext = createContext({
  showNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const showNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      title: notification.title || 'Notification',
      message: notification.message || '',
      type: notification.type || 'info',
      duration: notification.duration || 5000,
      position: notification.position || 'top-right',
      onClose: notification.onClose,
      action: notification.action,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove notification after duration
    if (newNotification.duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && notification.onClose) {
        notification.onClose();
      }
      return prev.filter(n => n.id !== id);
    });
  };
  
  const value = { showNotification, removeNotification };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationSystem 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

/**
 * The main notification component
 */
const NotificationSystem = ({ notifications, removeNotification }) => {
  const { isDarkMode } = useTheme();
  
  // Group notifications by position
  const groupedNotifications = notifications.reduce((acc, notification) => {
    if (!acc[notification.position]) {
      acc[notification.position] = [];
    }
    
    acc[notification.position].push(notification);
    return acc;
  }, {});
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.15
      }
    }
  };
  
  // Helper to get the icon and color based on notification type
  const getNotificationProps = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={20} />,
          color: 'success',
          iconBg: 'success'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} />,
          color: 'warning',
          iconBg: 'warning'
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} />,
          color: 'error',
          iconBg: 'error'
        };
      case 'info':
      default:
        return {
          icon: <Info size={20} />,
          color: 'primary',
          iconBg: 'primary'
        };
    }
  };
  
  // Create portal for rendering notifications
  return createPortal(
    <>
      {Object.entries(groupedNotifications).map(([position, notificationsForPosition]) => (
        <div 
          key={position} 
          className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-3 w-full max-w-sm`}
        >
          <AnimatePresence>
            {notificationsForPosition.map((notification) => {
              const { icon, color, iconBg } = getNotificationProps(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  layout
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`p-4 rounded-xl shadow-lg backdrop-blur-sm
                    ${isDarkMode 
                      ? `bg-card/90 border border-${color}/20` 
                      : `bg-white border border-${color}/20`
                    } w-full overflow-hidden relative`}
                >
                  {/* Progress bar */}
                  {notification.duration !== Infinity && (
                    <motion.div 
                      className={`absolute bottom-0 left-0 h-0.5 bg-${color}`}
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: notification.duration / 1000, ease: "linear" }}
                    />
                  )}
                  
                  <div className="flex items-start">
                    {/* Icon */}
                    <div className={`mr-3 p-2 rounded-full bg-${iconBg}/10 text-${color} flex-shrink-0`}>
                      {icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow mr-2">
                      <h4 className="font-medium text-foreground">
                        {notification.title}
                      </h4>
                      {notification.message && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      )}
                      
                      {/* Action button */}
                      {notification.action && (
                        <button 
                          onClick={() => {
                            notification.action.onClick();
                            if (notification.action.closeOnClick) {
                              removeNotification(notification.id);
                            }
                          }}
                          className={`mt-2 text-sm font-medium text-${color} hover:text-${color}/80 transition-colors`}
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                    
                    {/* Close button */}
                    <button 
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 rounded-full hover:bg-muted/20 transition-colors"
                      aria-label="Close notification"
                    >
                      <X size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ))}
    </>,
    document.body
  );
};

export default NotificationSystem; 