import { apiService } from './api';

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data including name, email, password, phone
   * @returns {Promise} - Response from the API
   */
  async register(userData) {
    const data = await apiService.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('LocalLinkUser', JSON.stringify({
        ...data.data,
        token: data.token
      }));
    }
    return data;
  },

  /**
   * Login a user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} - Response from the API
   */
  async login(credentials) {
    const data = await apiService.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('LocalLinkUser', JSON.stringify({
        ...data.data,
        token: data.token
      }));
    }
    return data;
  },

  /**
   * Logout current user
   */
  async logout() {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of API response
      localStorage.removeItem('LocalLinkUser');
    }
  },

  /**
   * Get current user details
   * @returns {Promise} - User data from the API
   */
  async getCurrentUser() {
    return apiService.get('/auth/me');
  },

  /**
   * Update user details
   * @param {Object} userData - User data to update
   * @returns {Promise} - Response from the API
   */
  async updateDetails(userData) {
    return apiService.put('/auth/updatedetails', userData);
  },

  /**
   * Update user password
   * @param {Object} passwordData - Old and new password
   * @returns {Promise} - Response from the API
   */
  async updatePassword(passwordData) {
    return apiService.put('/auth/updatepassword', passwordData);
  }
}; 