import { apiService } from './api';

export const serviceService = {
  /**
   * Get all services with optional filters
   * @param {Object} query - Optional query parameters
   * @returns {Promise} - Response from the API
   */
  async getServices(query = {}) {
    const queryString = new URLSearchParams(query).toString();
    const endpoint = queryString ? `/services?${queryString}` : '/services';
    return apiService.get(endpoint);
  },

  /**
   * Get a service by ID
   * @param {string} id - Service ID
   * @returns {Promise} - Response from the API
   */
  async getServiceById(id) {
    return apiService.get(`/services/${id}`);
  },

  /**
   * Create a new service (for providers)
   * @param {Object} serviceData - Service data
   * @returns {Promise} - Response from the API
   */
  async createService(serviceData) {
    return apiService.post('/services', serviceData);
  },

  /**
   * Update a service
   * @param {string} id - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise} - Response from the API
   */
  async updateService(id, serviceData) {
    return apiService.put(`/services/${id}`, serviceData);
  },

  /**
   * Delete a service
   * @param {string} id - Service ID
   * @returns {Promise} - Response from the API
   */
  async deleteService(id) {
    return apiService.delete(`/services/${id}`);
  },

  /**
   * Get services by provider ID
   * @param {string} providerId - Provider ID
   * @returns {Promise} - Response from the API
   */
  async getServicesByProvider(providerId) {
    return apiService.get(`/services/provider/${providerId}`);
  },

  /**
   * Search services by keyword
   * @param {string} query - Search query
   * @returns {Promise} - Response from the API
   */
  async searchServices(query) {
    return apiService.get(`/services/search?q=${encodeURIComponent(query)}`);
  }
}; 