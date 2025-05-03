# LocalLink API Backend

This is the backend API for the LocalLink platform, a service booking and marketplace application. The API provides endpoints for user authentication, service management, bookings, products, orders, and reviews.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File uploads
- **Express Validator** - Request validation

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or Atlas)
- Cloudinary account for image uploads

### Installation

1. Clone the repository
2. Navigate to the Backend directory
3. Install dependencies

```bash
cd Backend
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Settings
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

5. Start the development server

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### Services

- `GET /api/services` - Get all services
- `POST /api/services` - Create a service
- `GET /api/services/featured` - Get featured services
- `GET /api/services/provider/:providerId` - Get services by provider
- `GET /api/services/:id` - Get a single service
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service
- `GET /api/services/:id/reviews` - Get reviews for a service

### Users

- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create a user (admin only)
- `GET /api/users/profile/:id` - Get user public profile
- `GET /api/users/bookings` - Get current user's bookings
- `GET /api/users/orders` - Get current user's orders
- `POST /api/users/avatar` - Upload user avatar
- `GET /api/users/:id` - Get a single user (admin only)
- `PUT /api/users/:id` - Update a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/:id` - Get a single booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get a single product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/:id/reviews` - Get reviews for a product

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create an order
- `GET /api/orders/:id` - Get a single order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category
- `GET /api/categories/:id` - Get a single category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Models

The database includes the following models:

- **User** - User accounts including customers, service providers, and admins
- **Service** - Services offered by providers
- **Booking** - Service bookings by customers
- **Product** - Products sold in the marketplace
- **Order** - Product orders by customers
- **Category** - Categories for services and products
- **Review** - Reviews for services and products

## Authentication and Authorization

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token to be included in the `Authorization` header of the request:

```
Authorization: Bearer <token>
```

## Image Uploads

Image uploads are handled using Multer and stored in Cloudinary. The following routes support image uploads:

- `POST /api/services` - Service image upload
- `PUT /api/services/:id` - Service image update
- `POST /api/products` - Product image upload
- `PUT /api/products/:id` - Product image update
- `POST /api/users/avatar` - User avatar upload

## Error Handling

The API uses a centralized error handling middleware to catch and format errors. All errors are returned in a consistent format:

```json
{
  "status": "error",
  "message": "Error message",
  "stack": "Error stack trace (only in development)"
}
```

## License

This project is licensed under the ISC License. 