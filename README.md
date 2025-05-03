# LocalLink - Service Booking and Marketplace Platform

LocalLink is a comprehensive service booking and marketplace platform that connects customers with local service providers. The platform enables users to browse, book, and pay for various services, as well as purchase related products.

## Project Structure

The project is divided into two main parts:

- **Frontend**: React.js application with modern UI using Tailwind CSS
- **Backend**: Node.js API using Express.js and MongoDB

## Features

### Customer Features
- Browse and search for services and products
- Book services with specific dates and times
- Purchase products from the marketplace
- Track bookings and orders
- Review and rate services and products
- Manage profile and account settings

### Service Provider Features
- List and manage services
- Manage service availability and pricing
- Track and manage bookings
- Respond to customer reviews
- View earnings and reports

### Admin Features
- Comprehensive admin dashboard
- Manage users, services, and products
- View and generate reports
- Moderate reviews and content
- Configure platform settings

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion for animations
- Chart.js for data visualization
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Express Validator for request validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or Atlas)
- Cloudinary account for image uploads

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/locallink.git
cd locallink
```

2. Install Frontend dependencies and start the development server
```bash
cd Frontend
npm install
npm run dev
```

3. Install Backend dependencies and start the API server
```bash
cd ../Backend
npm install
# Create a .env file with necessary configurations
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Application Structure

### Frontend Structure
```
Frontend/
├── public/            # Static files
├── src/
│   ├── components/    # Reusable components
│   │   ├── admin/     # Admin-specific components
│   │   └── ...
│   ├── context/       # Context providers
│   ├── pages/         # Page components
│   │   ├── admin/     # Admin pages
│   │   └── ...
│   ├── data/          # Mock data
│   ├── styles/        # CSS styles
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main component
│   └── main.jsx       # Entry point
└── ...
```

### Backend Structure
```
Backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── utils/         # Utility functions
├── .env               # Environment variables
├── server.js          # Entry point
└── ...
```

## API Documentation

The API documentation is available in the Backend README file. It includes all available endpoints, request formats, and response structures.

## License

This project is licensed under the ISC License. 