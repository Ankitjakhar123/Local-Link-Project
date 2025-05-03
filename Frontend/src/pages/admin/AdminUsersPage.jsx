import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, UserCog, Shield, 
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { useNotification } from '../../components/NotificationSystem';

// Import sample data
import { users } from '../../data/users';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Transform users data
      const transformedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 XXXXXXXXXX',
        role: user.isAdmin ? 'admin' : 'customer',
        status: user.status || 'active',
        verified: Math.random() > 0.3, // Just for simulation
        bookings: user.bookings?.length || 0,
        orders: Math.floor(Math.random() * 10),
        createdAt: '2023-05-15'
      }));
      
      setUsersData(transformedUsers);
      setLoading(false);
    }, 800);
  }, []);
  
  const handleDeleteUser = (id) => {
    // In a real app, we would send this to an API
    console.log('Deleting user:', id);
    
    // Simulate API success
    const updatedUsers = usersData.filter(user => user.id !== id);
    setUsersData(updatedUsers);
    setDeleteConfirm(null);
    
    showNotification({
      title: 'User Deleted',
      message: 'The user has been deleted successfully',
      type: 'success',
      duration: 5000
    });
  };
  
  const handleToggleUserRole = (id, currentRole) => {
    // In a real app, we would send this to an API
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    console.log(`Changing user ${id} role from ${currentRole} to ${newRole}`);
    
    // Simulate API success
    const updatedUsers = usersData.map(user => {
      if (user.id === id) {
        return { ...user, role: newRole };
      }
      return user;
    });
    
    setUsersData(updatedUsers);
    
    showNotification({
      title: 'Role Updated',
      message: `User is now a ${newRole}`,
      type: 'success',
      duration: 5000
    });
  };
  
  const handleToggleUserStatus = (id, currentStatus) => {
    // In a real app, we would send this to an API
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log(`Changing user ${id} status from ${currentStatus} to ${newStatus}`);
    
    // Simulate API success
    const updatedUsers = usersData.map(user => {
      if (user.id === id) {
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsersData(updatedUsers);
    
    showNotification({
      title: 'Status Updated',
      message: `User is now ${newStatus}`,
      type: 'success',
      duration: 5000
    });
  };
  
  const tableColumns = [
    { 
      header: 'Name', 
      accessor: 'name',
      sortable: true,
      filterable: true
    },
    { 
      header: 'Email', 
      accessor: 'email', 
      sortable: true,
      filterable: true
    },
    { 
      header: 'Phone', 
      accessor: 'phone',
      sortable: true
    },
    { 
      header: 'Role', 
      accessor: 'role', 
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'admin', label: 'Admin' },
        { value: 'customer', label: 'Customer' }
      ],
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.role === 'admin' 
            ? 'bg-primary/10 text-primary border border-primary/30' 
            : 'bg-secondary/10 text-secondary border border-secondary/30'
        }`}>
          {row.role === 'admin' ? 'Admin' : 'Customer'}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.status === 'active' 
            ? 'bg-success/10 text-success border border-success/30' 
            : 'bg-error/10 text-error border border-error/30'
        }`}>
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      header: 'Verified', 
      accessor: 'verified',
      sortable: true,
      cell: (row) => (
        row.verified 
          ? <CheckCircle size={16} className="text-success" /> 
          : <XCircle size={16} className="text-error" />
      )
    },
    { 
      header: 'Bookings', 
      accessor: 'bookings', 
      sortable: true
    },
    { 
      header: 'Orders', 
      accessor: 'orders', 
      sortable: true
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/admin/users/${row.id}`)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
            title="View User"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleToggleUserRole(row.id, row.role)}
            className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
            title={row.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
          >
            {row.role === 'admin' ? <UserCog size={16} /> : <Shield size={16} />}
          </button>
          <button
            onClick={() => handleToggleUserStatus(row.id, row.status)}
            className={`p-1.5 text-muted-foreground transition-colors ${
              row.status === 'active' 
                ? 'hover:text-error hover:bg-error/10'
                : 'hover:text-success hover:bg-success/10'
            }`}
            title={row.status === 'active' ? 'Deactivate User' : 'Activate User'}
          >
            {row.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
          </button>
          <button
            onClick={() => setDeleteConfirm(row)}
            className="p-1.5 text-muted-foreground hover:text-error rounded-lg hover:bg-error/10 transition-colors"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage all users on the platform</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/admin/users/new')}
            >
              <Plus size={16} className="mr-1" />
              Add User
            </button>
          </div>
        </div>
        
        {/* Users Table */}
        <DataTable
          columns={tableColumns}
          data={usersData}
          title="All Users"
          description={`${usersData.length} users registered`}
          loading={loading}
          searchable={true}
          filterable={true}
          pagination={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          selectable={false}
          onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        />
        
        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card border border-border rounded-xl shadow-lg p-6 max-w-md w-full">
              <div className="mb-6 flex items-center gap-4">
                <div className="p-3 bg-error/10 rounded-full">
                  <AlertTriangle size={24} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Delete User</h3>
                  <p className="text-muted-foreground">
                    Are you sure you want to delete the user "{deleteConfirm.name}" ({deleteConfirm.email})? 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-error" 
                  onClick={() => handleDeleteUser(deleteConfirm.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage; 