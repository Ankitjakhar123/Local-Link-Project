import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    // Simulate coupon validation
    if (coupon.toLowerCase() === 'welcome10') {
      setCouponSuccess('Coupon applied successfully!');
      setDiscount(Math.round(total * 0.1)); // 10% discount
    } else if (coupon.toLowerCase() === 'flat100') {
      if (total < 500) {
        setCouponError('Minimum order value of ₹500 required for this coupon');
      } else {
        setCouponSuccess('Coupon applied successfully!');
        setDiscount(100); // ₹100 flat discount
      }
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login?redirect=checkout');
    } else {
      // Proceed to checkout
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-16 container">
        <div className="text-center py-12 bg-card rounded-lg border border-border max-w-2xl mx-auto">
          <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-3">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any services or products to your cart yet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Visit Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 container">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Cart Items ({cart.length})</h2>
            </div>
            
            <div>
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="p-6 border-b border-border flex flex-col sm:flex-row gap-4"
                >
                  <div className="sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.type === 'service' ? 'Service' : 'Product'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-border rounded-l-md"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b border-border">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-border rounded-r-md"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-error transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 flex justify-between">
              <button 
                onClick={() => clearCart()}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center"
              >
                <Trash2 size={16} className="mr-1" />
                Clear Cart
              </button>
              <Link to="/" className="text-primary hover:underline text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{total}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{total > 500 ? 'Free' : '₹49'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>₹{Math.round((total - discount) * 0.18)}</span>
              </div>
              
              <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total - discount + (total > 500 ? 0 : 49) + Math.round((total - discount) * 0.18)}</span>
              </div>
              
              {/* Coupon code */}
              <form onSubmit={handleCouponSubmit} className="pt-4">
                <label htmlFor="coupon" className="text-sm font-medium mb-1 block">
                  Have a coupon code?
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="coupon"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="input rounded-r-none flex-1"
                  />
                  <button 
                    type="submit"
                    className="btn btn-primary rounded-l-none"
                    disabled={!coupon}
                  >
                    Apply
                  </button>
                </div>
                
                {couponError && (
                  <div className="mt-2 text-sm text-error flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {couponError}
                  </div>
                )}
                
                {couponSuccess && (
                  <div className="mt-2 text-sm text-success flex items-center">
                    <CheckCircle2 size={14} className="mr-1" />
                    {couponSuccess}
                  </div>
                )}
              </form>
              
              <button 
                onClick={handleCheckout}
                className="btn btn-primary w-full py-3"
              >
                Proceed to Checkout
              </button>
              
              {!user && (
                <p className="text-sm text-center text-muted-foreground">
                  You'll need to <Link to="/login" className="text-primary hover:underline">login</Link> before checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;