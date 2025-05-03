# LocalLink Frontend-Backend Integration

This document explains how the frontend and backend components of the LocalLink application are integrated.

## Environment Configuration

The frontend uses environment variables to connect to the backend API. This is configured in the `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

You can change this URL based on your backend deployment.

## API Service Structure

The API integration is structured in the following way:

1. **Base API Service** (`src/services/api.js`): Provides core HTTP methods (GET, POST, PUT, DELETE) with authentication.

2. **Entity Services**: Domain-specific services that use the base API service:
   - `auth.service.js`: Authentication operations (login, register, etc.)
   - `service.service.js`: Service-related operations (listing, searching, etc.)
   - `product.service.js`: Product-related operations
   - `booking.service.js`: Booking management
   - `order.service.js`: Order handling

3. **Context Integration**: The API services are integrated with React contexts:
   - `AuthContext.jsx`: Manages user authentication state
   - `CartContext.jsx`: Handles cart operations and checkout

## How to Use

### Authentication

Authentication is handled automatically. When a user logs in, the token is stored in localStorage and automatically added to subsequent API requests.

```jsx
// Login example
import { useAuth } from '../context/AuthContext';

const { login } = useAuth();

// In your component
const handleLogin = async (credentials) => {
  try {
    await login(credentials);
    // Success - redirect or show message
  } catch (error) {
    // Handle error
  }
};
```

### Fetching Data

Services can be imported and used in components:

```jsx
import { serviceService } from '../services/service.service';

// In your component
const fetchServices = async () => {
  try {
    const response = await serviceService.getServices({
      category: 'salon',
      sort: 'rating'
    });
    // Use response.data
  } catch (error) {
    // Handle error
  }
};
```

## Error Handling

All API services include error handling. The error responses from the backend are processed and can be displayed using the notification system:

```jsx
import { useNotification } from '../components/NotificationSystem';

const { showNotification } = useNotification();

// After catching an error
showNotification({
  title: 'Error',
  message: error.toString(),
  type: 'error'
});
```

## Adding New API Features

To add a new API integration:

1. Add the endpoint to the appropriate service file
2. Use the base API methods (get, post, put, delete)
3. Update the component to use the new service method

## Running the Application

1. Start the backend server
   ```
   cd Backend
   npm install
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd Frontend
   npm install
   npm run dev
   ```

3. Make sure the backend URL in the frontend's `.env` file is correct