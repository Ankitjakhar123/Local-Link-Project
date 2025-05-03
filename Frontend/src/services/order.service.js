import { apiService } from './api';

export const orderService = {
  /**
   * Get all orders for the current user
   * @returns {Promise} - Response from the API
   */
  async getUserOrders() {
    return apiService.get('/orders/user');
  },

  /**
   * Get an order by ID
   * @param {string} id - Order ID
   * @returns {Promise} - Response from the API
   */
  async getOrderById(id) {
    return apiService.get(`/orders/${id}`);
  },

  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise} - Response from the API
   */
  async createOrder(orderData) {
    return apiService.post('/orders', orderData);
  },

  /**
   * Update order status (admin/provider)
   * @param {string} id - Order ID
   * @param {Object} statusData - Status update data
   * @returns {Promise} - Response from the API
   */
  async updateOrderStatus(id, statusData) {
    return apiService.put(`/orders/${id}/status`, statusData);
  },

  /**
   * Cancel an order
   * @param {string} id - Order ID
   * @returns {Promise} - Response from the API
   */
  async cancelOrder(id) {
    return apiService.put(`/orders/${id}/cancel`, {});
  },
  
  /**
   * Add a review for a completed order
   * @param {string} orderId - Order ID
   * @param {Object} reviewData - Review data including rating and comment
   * @returns {Promise} - Response from the API
   */
  async addReview(orderId, reviewData) {
    return apiService.post(`/orders/${orderId}/review`, reviewData);
  }
}; 