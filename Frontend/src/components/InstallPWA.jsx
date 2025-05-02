import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Laptop, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const InstallPWA = ({ onClose, className = '' }) => {
  const { isDarkMode } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [installStep, setInstallStep] = useState(0);
  
  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowModal(false);
      setDeferredPrompt(null);
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    setShowModal(true);
    setInstallStep(1);
  };
  
  const proceedWithInstall = async () => {
    if (!deferredPrompt) return;
    
    setInstallStep(2);
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
      setInstallStep(3);
    } else {
      setInstallStep(1);
    }
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setInstallStep(0);
    if (onClose) onClose();
  };
  
  // If PWA is not installable or already installed, don't show the install button
  if (!isInstallable || isInstalled) {
    return null;
  }
  
  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <>
      {/* Trigger button */}
      <div className={className}>
        <motion.button
          className="flex items-center gap-2"
          onClick={handleInstallClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={20} />
          Install App
        </motion.button>
      </div>
      
      {/* Installation modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            
            {/* Modal content */}
            <motion.div
              className={`w-full max-w-md rounded-2xl ${
                isDarkMode 
                  ? 'bg-card border border-primary/20' 
                  : 'bg-white shadow-xl'
              } overflow-hidden relative z-10`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/20"
                onClick={closeModal}
              >
                <X size={20} className="text-muted-foreground" />
              </button>
              
              <div className="p-8">
                {installStep === 1 && (
                  <>
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} flex items-center justify-center mx-auto mb-4`}>
                        <Download size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Install Local Link</h3>
                      <p className="text-muted-foreground">
                        Get quick access to our services right from your home screen.
                      </p>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="font-medium mb-3 text-foreground">Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          'Works offline or with poor connection',
                          'Faster loading times',
                          'Home screen icon for quick access',
                          'Fullscreen experience without browser UI'
                        ].map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle size={18} className="text-success mr-2 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Smartphone size={20} />
                        <Laptop size={20} />
                        <span className="text-sm">Available on all devices</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="text-success">✓</span> No app store needed
                      </div>
                    </div>
                    
                    <button 
                      className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                      onClick={proceedWithInstall}
                    >
                      Install Now
                    </button>
                    
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      No extra storage space required. Uses only ~5MB.
                    </p>
                  </>
                )}
                
                {installStep === 2 && (
                  <div className="py-8 text-center">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mb-6"
                    >
                      <Download size={48} className="text-primary mx-auto" />
                    </motion.div>
                    <h3 className="text-xl font-medium text-foreground mb-2">Please confirm installation</h3>
                    <p className="text-muted-foreground">
                      A prompt should appear. Please select "Install" to continue.
                    </p>
                  </div>
                )}
                
                {installStep === 3 && (
                  <div className="py-8 text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="mb-6"
                    >
                      <CheckCircle size={48} className="text-success mx-auto" />
                    </motion.div>
                    <h3 className="text-xl font-medium text-foreground mb-2">Installation Complete!</h3>
                    <p className="text-muted-foreground mb-6">
                      LocalLink has been successfully installed on your device.
                    </p>
                    <button 
                      className="px-6 py-2 rounded-xl bg-success/10 text-success font-medium"
                      onClick={closeModal}
                    >
                      Great!
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPWA; 