import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Package, ShoppingBag, BarChart, Home, Settings, 
  Bell, LogOut, Menu, X, Calendar, FileText, HelpCircle,
  Briefcase, MessageSquare, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../NotificationSystem';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Mock notifications
  const notifications = [
    { id: 1, title: 'New booking request', message: 'John Doe booked Plumbing Service', time: '10 minutes ago', read: false },
    { id: 2, title: 'Payment received', message: 'Payment of ₹2,500 received for AC Repair', time: '1 hour ago', read: false },
    { id: 3, title: 'New user registered', message: 'Priya Sharma created an account', time: '3 hours ago', read: true },
    { id: 4, title: 'Service rated', message: 'Deep Cleaning service received 5-star rating', time: '1 day ago', read: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Navigation items
  const navItems = [
    { title: 'Dashboard', icon: <BarChart size={18} />, path: '/admin', exact: true },
    { title: 'Services', icon: <Package size={18} />, path: '/admin/services' },
    { title: 'Products', icon: <ShoppingBag size={18} />, path: '/admin/products' },
    { title: 'Users', icon: <Users size={18} />, path: '/admin/users' },
    { title: 'Bookings', icon: <Calendar size={18} />, path: '/admin/bookings' },
    { title: 'Orders', icon: <FileText size={18} />, path: '/admin/orders' },
    { title: 'Messages', icon: <MessageSquare size={18} />, path: '/admin/messages', badge: 3 },
    { title: 'Service Providers', icon: <Briefcase size={18} />, path: '/admin/providers' },
    { title: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
    { title: 'Help', icon: <HelpCircle size={18} />, path: '/admin/help' },
  ];
  
  const handleLogout = () => {
    logout();
    showNotification({
      title: 'Logged out',
      message: 'You have been successfully logged out',
      type: 'info',
      duration: 3000
    });
    navigate('/login');
  };
  
  const isActivePath = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };
  
  // Check if user is admin, if not redirect
  if (!user || !user.isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="text-lg font-bold text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              LocalLink Admin
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-muted/50"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 ${isActivePath(item.path) ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.title}</span>
                </div>
                {item.badge && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-medium">{user.name.charAt(0)}</span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-muted/50 lg:hidden mr-4"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="text-sm text-muted-foreground flex items-center hover:text-foreground">
              <Home size={16} className="mr-1" /> Visit Site
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-muted/50 relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg border border-border overflow-hidden z-50">
                  <div className="p-3 border-b border-border flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-xs text-primary hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-border last:border-b-0 hover:bg-muted/20 ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <button 
                      className="w-full text-center text-sm text-primary hover:underline py-1"
                      onClick={() => navigate('/admin/notifications')}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-medium">{user.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-sm hidden sm:inline-block">{user.name}</span>
                <ChevronDown size={16} />
              </button>
              
              {/* User dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg border border-border overflow-hidden z-50">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/admin/profile" 
                      className="block px-4 py-2 text-sm hover:bg-muted/20"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      className="block px-4 py-2 text-sm hover:bg-muted/20"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="py-1 border-t border-border">
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted/20 text-error"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 