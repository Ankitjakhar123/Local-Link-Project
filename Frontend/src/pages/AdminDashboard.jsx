import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingBag, BarChart, Calendar, ArrowUpRight,
  TrendingUp, CreditCard, Clock, Award, UserCheck, Star,
  Settings, ChevronRight, Percent
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Import our admin components
import AdminLayout from '../components/admin/AdminLayout';
import DashboardCard from '../components/admin/DashboardCard';
import DataTable from '../components/admin/DataTable';
import { useAuth } from '../context/AuthContext';

// Import mock data
import { services } from '../data/services';
import { products } from '../data/products';
import { users } from '../data/users';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({});
  const [bookingsData, setBookingsData] = useState({});
  const [productOrdersData, setProductOrdersData] = useState({});
  
  // Mock data for charts and stats
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      // Generate revenue data for the chart
      const revenueChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [4500, 3800, 6000, 5400, 7200, 8100, 7800, 9500, 11000, 9800, 12500, 14000],
            borderColor: 'rgba(132, 90, 223, 1)',
            backgroundColor: 'rgba(132, 90, 223, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: 'Expenses',
            data: [3200, 2900, 3500, 3800, 4200, 5000, 4600, 5500, 6500, 5800, 7000, 8200],
            borderColor: 'rgba(156, 81, 161, 1)',
            backgroundColor: 'rgba(156, 81, 161, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          }
        ]
      };
      
      // Generate bookings data for the chart
      const bookingsChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'This Week',
            data: [18, 25, 20, 30, 40, 35, 15],
            backgroundColor: 'rgba(132, 90, 223, 0.8)',
            borderRadius: 4,
          },
          {
            label: 'Last Week',
            data: [15, 20, 18, 25, 30, 25, 10],
            backgroundColor: 'rgba(132, 90, 223, 0.3)',
            borderRadius: 4,
          }
        ]
      };
      
      // Generate product orders data for the chart
      const productOrdersChartData = {
        labels: ['Electronics', 'Home', 'Beauty', 'Kitchen', 'Cleaning', 'Plumbing'],
        datasets: [
          {
            label: 'Orders',
            data: [350, 275, 400, 325, 200, 180],
            backgroundColor: [
              'rgba(132, 90, 223, 0.8)',
              'rgba(156, 81, 161, 0.8)',
              'rgba(240, 101, 102, 0.8)',
              'rgba(88, 189, 125, 0.8)',
              'rgba(255, 188, 66, 0.8)',
              'rgba(75, 192, 192, 0.8)'
            ],
            borderWidth: 0,
            borderRadius: 4,
          }
        ]
      };
      
      setRevenueData(revenueChartData);
      setBookingsData(bookingsChartData);
      setProductOrdersData(productOrdersChartData);
      setLoading(false);
    }, 800);
  }, []);
  
  // Basic stats for overview
  const stats = [
    { 
      title: 'Total Users', 
      value: users.length, 
      change: '+12%',
      description: 'vs. previous month',
      icon: <Users size={20} />,
      variant: 'default'
    },
    { 
      title: 'Services Booked', 
      value: '286', 
      change: '+5%',
      description: 'vs. previous month',
      icon: <Package size={20} />,
      variant: 'info'
    },
    { 
      title: 'Products Sold', 
      value: '152', 
      change: '+8%',
      description: 'vs. previous month',
      icon: <ShoppingBag size={20} />,
      variant: 'warning'
    },
    { 
      title: 'Revenue', 
      value: '₹87,500', 
      change: '+15%',
      description: 'vs. previous month',
      icon: <BarChart size={20} />,
      variant: 'success'
    }
  ];
  
  // Recent bookings for the table
  const recentBookings = [
    { id: 1, customerName: 'Rahul Sharma', serviceName: 'AC Repair', date: '2023-11-15', time: '10:00 AM', status: 'Completed', amount: '₹1,200' },
    { id: 2, customerName: 'Priya Patel', serviceName: 'House Cleaning', date: '2023-11-15', time: '02:30 PM', status: 'In Progress', amount: '₹800' },
    { id: 3, customerName: 'Vikram Singh', serviceName: 'Plumbing Service', date: '2023-11-16', time: '11:00 AM', status: 'Scheduled', amount: '₹650' },
    { id: 4, customerName: 'Ananya Gupta', serviceName: 'Hair Styling', date: '2023-11-16', time: '04:00 PM', status: 'Cancelled', amount: '₹1,500' },
    { id: 5, customerName: 'Arjun Reddy', serviceName: 'Electrical Work', date: '2023-11-17', time: '09:30 AM', status: 'Confirmed', amount: '₹950' },
  ];
  
  // Booking status counts
  const bookingStats = [
    { title: 'Completed', value: '185', icon: <UserCheck size={20} />, variant: 'success' },
    { title: 'In Progress', value: '32', icon: <Clock size={20} />, variant: 'info' },
    { title: 'Scheduled', value: '68', icon: <Calendar size={20} />, variant: 'warning' },
    { title: 'Cancelled', value: '14', icon: <Users size={20} />, variant: 'error' }
  ];
  
  // Top service providers
  const topProviders = [
    { id: 1, name: 'Rajesh Kumar', service: 'Plumbing', bookings: 48, rating: 4.9, earnings: '₹58,200' },
    { id: 2, name: 'Neha Sharma', service: 'House Cleaning', bookings: 42, rating: 4.8, earnings: '₹36,750' },
    { id: 3, name: 'Sanjay Patel', service: 'AC Repair', bookings: 36, rating: 4.7, earnings: '₹43,200' },
    { id: 4, name: 'Meera Singh', service: 'Beauty', bookings: 31, rating: 4.9, earnings: '₹46,500' },
  ];
  
  // Booking table columns
  const bookingColumns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Customer', accessor: 'customerName', sortable: true },
    { header: 'Service', accessor: 'serviceName', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Time', accessor: 'time', sortable: true },
    { 
      header: 'Status', 
      accessor: 'status', 
      sortable: true,
      cell: (row) => {
        const statusStyles = {
          Completed: 'bg-success/10 text-success border-success/30',
          'In Progress': 'bg-info/10 text-info border-info/30',
          Scheduled: 'bg-warning/10 text-warning border-warning/30',
          Cancelled: 'bg-error/10 text-error border-error/30',
          Confirmed: 'bg-primary/10 text-primary border-primary/30',
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full border ${statusStyles[row.status]}`}>
            {row.status}
          </span>
        );
      }
    },
    { header: 'Amount', accessor: 'amount', sortable: true },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <button
          onClick={() => navigate(`/admin/bookings/${row.id}`)}
          className="p-1 rounded-md hover:bg-muted/50"
        >
          <ChevronRight size={16} />
        </button>
      )
    }
  ];
  
  // Provider table columns
  const providerColumns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Service', accessor: 'service', sortable: true },
    { header: 'Bookings', accessor: 'bookings', sortable: true },
    { 
      header: 'Rating', 
      accessor: 'rating', 
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <Star size={14} className="text-warning fill-warning mr-1" />
          <span>{row.rating}</span>
        </div>
      )
    },
    { header: 'Earnings', accessor: 'earnings', sortable: true },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <button
          onClick={() => navigate(`/admin/providers/${row.id}`)}
          className="p-1 rounded-md hover:bg-muted/50"
        >
          <ChevronRight size={16} />
        </button>
      )
    }
  ];
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        cornerRadius: 4
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      }
    },
    maintainAspectRatio: false
  };
  
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        cornerRadius: 4
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your admin dashboard</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="btn btn-outline btn-sm">
              <Settings size={16} className="mr-1" />
              Settings
            </button>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => navigate('/admin/reports')}
            >
              Download Reports
              <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              description={stat.description}
              variant={stat.variant}
              loading={loading}
            />
          ))}
        </div>
        
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <p className="text-sm text-muted-foreground">Monthly revenue and expenses</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-xs">Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Line data={revenueData} options={lineChartOptions} />
            )}
          </div>
        </div>
        
        {/* Middle row with booking stats and service categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking stats */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Booking Statistics</h2>
              <p className="text-sm text-muted-foreground">Bookings by day of week</p>
            </div>
            
            <div className="p-4 h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Bar data={bookingsData} options={barChartOptions} />
              )}
            </div>
          </div>
          
          {/* Product Category Overview */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Product Orders</h2>
              <p className="text-sm text-muted-foreground">Orders by product category</p>
            </div>
            
            <div className="p-4 h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Bar data={productOrdersData} options={{...barChartOptions, indexAxis: 'y'}} />
              )}
            </div>
          </div>
        </div>
        
        {/* Booking status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookingStats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              variant={stat.variant}
              loading={loading}
            />
          ))}
        </div>
        
        {/* Recent Bookings */}
        <div>
          <DataTable
            columns={bookingColumns}
            data={recentBookings}
            title="Recent Bookings"
            description="Latest service bookings from customers"
            loading={loading}
            searchable={true}
            pagination={true}
            actions={
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/admin/bookings')}
              >
                View All
              </button>
            }
          />
        </div>
        
        {/* Top Service Providers */}
        <div>
          <DataTable
            columns={providerColumns}
            data={topProviders}
            title="Top Service Providers"
            description="Best performing service providers this month"
            loading={loading}
            searchable={false}
            pagination={false}
            actions={
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/admin/providers')}
              >
                View All
              </button>
            }
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;