import React, { useEffect, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './components/NotificationSystem';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import FloatingCTA from './components/FloatingCTA';
import OfflineNotification from './components/OfflineNotification';
import HomePage from './pages/HomePage';
import './styles/premium.css';

// Lazy load non-critical pages for better performance
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

// Optimized component to handle scrolling to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }, [pathname]);
  
  return null;
};

// Loading fallback
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-foreground/80 animate-pulse">Loading...</p>
    </div>
  </div>
);

function App() {
  // Force dark mode for consistent premium experience
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preload', href: '/api/featured-services', as: 'fetch', type: 'application/json' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    ];
    
    preloadLinks.forEach(({ rel, href, as, type }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (as) link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    });
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .then(registration => {
            console.log('SW registered: ', registration.scope);
          })
          .catch(error => {
            console.error('SW registration failed: ', error);
          });
      });
    }
    
    // Cleanup on unmount
    return () => {
      preloadLinks.forEach(({ href }) => {
        const links = document.querySelectorAll(`link[href="${href}"]`);
        links.forEach(link => link.remove());
      });
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Router>
              <ScrollToTop />
              <OfflineNotification />
              <div className="flex flex-col min-h-screen bg-background dark">
                <Navbar />
                <main className="flex-grow">
                  <PageTransition>
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/services/:id" element={<ServiceDetail />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/services" element={<AdminServicesPage />} />
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                        <Route path="/FAQ" element={<FAQ />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                      </Routes>
                    </Suspense>
                  </PageTransition>
                </main>
                <Footer />
                <FloatingCTA />
              </div>
            </Router>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;