import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from '../components/NotificationSystem';
import { orderService } from '../services/order.service';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('LocalLinkCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('LocalLinkCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id && cartItem.type === item.type
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += item.quantity || 1;
      setCartItems(newCartItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...item, quantity: item.quantity || 1 }]);
    }
    
    showNotification({
      title: 'Added to Cart',
      message: `${item.name || item.title} has been added to your cart`,
      type: 'success'
    });
  };

  const removeFromCart = (id, type) => {
    setCartItems(cartItems.filter(item => !(item.id === id && item.type === type)));
    
    showNotification({
      title: 'Removed from Cart',
      message: 'Item has been removed from your cart',
      type: 'info'
    });
  };

  const updateQuantity = (id, type, quantity) => {
    if (quantity < 1) {
      return removeFromCart(id, type);
    }
    
    setCartItems(
      cartItems.map(item => 
        item.id === id && item.type === type 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  const checkout = async (checkoutData) => {
    try {
      setLoading(true);
      
      // Separate products and services for different order types
      const products = cartItems.filter(item => item.type === 'product');
      const services = cartItems.filter(item => item.type === 'service');
      
      let orderResponse = null;
      
      // Create product order if there are products in the cart
      if (products.length > 0) {
        const productOrder = {
          ...checkoutData,
          items: products.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          orderType: 'product'
        };
        
        orderResponse = await orderService.createOrder(productOrder);
      }
      
      // Create service bookings if there are services in the cart
      let bookingResponses = [];
      if (services.length > 0) {
        // This is simplified - you might need to handle each service booking individually
        for (const service of services) {
          const bookingData = {
            ...checkoutData,
            serviceId: service.id,
            date: checkoutData.serviceDate,
            time: checkoutData.serviceTime,
            price: service.price
          };
          
          // This would need to be implemented in your backend
          const bookingResponse = await orderService.createServiceBooking(bookingData);
          bookingResponses.push(bookingResponse);
        }
      }
      
      // Clear cart after successful checkout
      clearCart();
      
      showNotification({
        title: 'Order Placed Successfully',
        message: 'Thank you for your order!',
        type: 'success'
      });
      
      return { order: orderResponse, bookings: bookingResponses };
    } catch (error) {
      showNotification({
        title: 'Checkout Failed',
        message: error.toString(),
        type: 'error'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal, 
      getCartCount,
      checkout,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};