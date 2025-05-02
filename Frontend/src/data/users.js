export const users = [
  {
    id: "user1",
    name: "Raj Sharma",
    email: "raj.sharma@example.com",
    phone: "+91 9876543210",
    password: "password123", // In a real app, this would be hashed
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    isAdmin: true,
    bookings: [
      {
        id: "booking1",
        serviceId: 1001,
        serviceName: "Women's Haircut",
        status: "completed",
        date: "2025-04-20",
        time: "10:00 AM",
        price: 599,
        rating: 5,
        review: "Excellent service, very professional!"
      },
      {
        id: "booking2",
        serviceId: 3001,
        serviceName: "1 BHK Deep Cleaning",
        status: "upcoming",
        date: "2025-05-15",
        time: "09:00 AM",
        price: 1999
      }
    ]
  },
  {
    id: "user2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 9876543211",
    password: "password123", // In a real app, this would be hashed
    address: {
      street: "456 Park Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001"
    },
    isAdmin: false,
    bookings: [
      {
        id: "booking3",
        serviceId: 2001,
        serviceName: "AC Service",
        status: "completed",
        date: "2025-04-10",
        time: "11:00 AM",
        price: 699,
        rating: 4,
        review: "Good service, could be more punctual."
      }
    ]
  }
];

// Helper function to authenticate user
export const authenticateUser = (email, password) => {
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Helper function to register a new user
export const registerUser = (userData) => {
  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    return { success: false, message: "Email already registered" };
  }
  
  const newUser = {
    id: `user${users.length + 1}`,
    ...userData,
    isAdmin: false,
    bookings: []
  };
  
  users.push(newUser);
  
  // Don't return the password
  const { password, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
};