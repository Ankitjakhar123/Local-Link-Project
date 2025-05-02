import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, CreditCard, LogOut, Settings, Edit, Star, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  
  if (!user) {
    return (
      <div className="pt-32 pb-16 container">
        <div className="text-center py-12 bg-card rounded-lg border border-border max-w-2xl mx-auto">
          <User className="mx-auto text-muted-foreground mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-3">You are not logged in</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your profile and booking history.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pt-32 pb-16 container">
      {/* Profile header */}
      <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
        <div className="bg-primary/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <p className="text-muted-foreground">{user.phone}</p>
            </div>
            <div className="ml-auto">
              <Link to="/profile/edit" className="btn btn-outline flex items-center">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <nav>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center px-6 py-4 hover:bg-muted/20 transition-colors ${
                  activeTab === 'bookings' ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                <Package size={20} className="mr-3" />
                <span>My Bookings</span>
              </button>
              
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center px-6 py-4 hover:bg-muted/20 transition-colors ${
                  activeTab === 'payments' ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                <CreditCard size={20} className="mr-3" />
                <span>Payment Methods</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-6 py-4 hover:bg-muted/20 transition-colors ${
                  activeTab === 'settings' ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                <Settings size={20} className="mr-3" />
                <span>Account Settings</span>
              </button>
              
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center px-6 py-4 text-primary hover:bg-muted/20 transition-colors"
                >
                  <User size={20} className="mr-3" />
                  <span>Admin Dashboard</span>
                  <ChevronRight size={16} className="ml-auto" />
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-6 py-4 text-error hover:bg-muted/20 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:w-3/4">
          {activeTab === 'bookings' && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">My Bookings</h2>
              </div>
              
              {user.bookings && user.bookings.length > 0 ? (
                <div>
                  {user.bookings.map((booking) => (
                    <div key={booking.id} className="p-6 border-b border-border">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{booking.serviceName}</h3>
                          <p className="text-muted-foreground mb-2">
                            {booking.date} at {booking.time}
                          </p>
                          <div className="mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed' 
                                ? 'bg-success/10 text-success' 
                                : booking.status === 'upcoming'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          {booking.rating && (
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    className={i < booking.rating ? "fill-warning text-warning" : "text-muted"} 
                                  />
                                ))}
                              </div>
                              {booking.review && (
                                <p className="ml-2 text-sm text-muted-foreground">"{booking.review}"</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <p className="font-semibold">₹{booking.price}</p>
                          <Link 
                            to={`/bookings/${booking.id}`}
                            className="text-primary hover:underline text-sm inline-block mt-2"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't made any bookings yet. Explore our services and book your first appointment.
                  </p>
                  <Link to="/services" className="btn btn-primary">
                    Browse Services
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'payments' && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
              </div>
              
              <div className="p-12 text-center">
                <CreditCard className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-lg font-medium mb-2">No payment methods added</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't added any payment methods yet. Add a payment method for faster checkout.
                </p>
                <button className="btn btn-primary">
                  Add Payment Method
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Account Settings</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={user.name}
                            readOnly
                            className="input w-full bg-muted cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="input w-full bg-muted cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={user.phone}
                            readOnly
                            className="input w-full bg-muted cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Link to="/profile/edit" className="btn btn-outline">
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-medium mb-4">Address</h3>
                    <div>
                      {user.address && (user.address.street || user.address.city) ? (
                        <div>
                          <p className="mb-1">{user.address.street}</p>
                          <p>{user.address.city}, {user.address.state} {user.address.pincode}</p>
                          <div className="mt-4">
                            <button className="btn btn-outline">
                              <Edit size={16} className="mr-2" />
                              Edit Address
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted-foreground mb-4">No address added yet.</p>
                          <button className="btn btn-outline">
                            Add Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-medium mb-4">Password</h3>
                    <button className="btn btn-outline">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-medium mb-4 text-error">Danger Zone</h3>
                    <button className="btn bg-error/10 text-error hover:bg-error/20">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;