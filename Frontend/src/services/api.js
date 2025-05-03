const API_URL = import.meta.env.VITE_API_URL;

// For testing/demo when backend is not available
const MOCK_DATA = {
  user: {
    id: 'mock-user-123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=random',
  },
  token: 'mock-jwt-token-for-demo-purposes'
};

// Flag to enable mock API for testing/demo
const USE_MOCK_API = true; // Set to false when real backend is available

/**
 * Base API service for making HTTP requests
 */
export const apiService = {
  /**
   * Get authentication token from local storage
   */
  getToken() {
    const user = JSON.parse(localStorage.getItem('LocalLinkUser') || '{}');
    return user?.token;
  },

  /**
   * Set headers including authorization if token exists
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  },

  /**
   * Handle API response including error handling
   */
  async handleResponse(response) {
    // For text responses that might not be JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    const data = isJson ? await response.json() : await response.text();
    
    if (!response.ok) {
      // If unauthorized, log out user
      if (response.status === 401) {
        localStorage.removeItem('LocalLinkUser');
      }
      
      // Return error with message
      const error = isJson ? data.message || response.statusText : data || response.statusText;
      return Promise.reject(error);
    }
    
    return data;
  },

  /**
   * Handle network errors when API is unreachable
   */
  handleNetworkError(endpoint, error) {
    console.error(`Network error for ${endpoint}:`, error);
    
    if (USE_MOCK_API) {
      console.warn('Using mock API fallback due to network error');
      return this.getMockResponse(endpoint);
    }
    
    return Promise.reject('Network error: Unable to connect to the server. Please check your internet connection and try again.');
  },
  
  /**
   * Get mock response for testing/demo
   */
  getMockResponse(endpoint) {
    // Handle different endpoints for mock data
    if (endpoint === '/auth/login') {
      return Promise.resolve({
        success: true,
        data: MOCK_DATA.user,
        token: MOCK_DATA.token,
        message: 'Login successful (MOCK)'
      });
    }
    
    if (endpoint === '/auth/register') {
      return Promise.resolve({
        success: true,
        data: MOCK_DATA.user,
        token: MOCK_DATA.token,
        message: 'Registration successful (MOCK)'
      });
    }
    
    if (endpoint === '/auth/me') {
      return Promise.resolve({
        success: true,
        data: MOCK_DATA.user
      });
    }
    
    // Default mock response
    return Promise.resolve({
      success: true,
      data: {},
      message: 'Operation successful (MOCK)'
    });
  },

  /**
   * Make GET request
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleNetworkError(endpoint, error);
    }
  },

  /**
   * Make POST request
   */
  async post(endpoint, body) {
    try {
      console.log(`Making POST request to ${API_URL}${endpoint}`, body);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleNetworkError(endpoint, error);
    }
  },

  /**
   * Make PUT request
   */
  async put(endpoint, body) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleNetworkError(endpoint, error);
    }
  },

  /**
   * Make DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleNetworkError(endpoint, error);
    }
  },
}; 