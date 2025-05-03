import { apiService } from './api';

export const bookingService = {
  /**
   * Get all bookings for the current user
   * @returns {Promise} - Response from the API
   */
  async getUserBookings() {
    return apiService.get('/bookings/user');
  },

  /**
   * Get a booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise} - Response from the API
   */
  async getBookingById(id) {
    return apiService.get(`/bookings/${id}`);
  },

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} - Response from the API
   */
  async createBooking(bookingData) {
    return apiService.post('/bookings', bookingData);
  },

  /**
   * Update a booking
   * @param {string} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} - Response from the API
   */
  async updateBooking(id, bookingData) {
    return apiService.put(`/bookings/${id}`, bookingData);
  },

  /**
   * Cancel a booking
   * @param {string} id - Booking ID
   * @returns {Promise} - Response from the API
   */
  async cancelBooking(id) {
    return apiService.put(`/bookings/${id}/cancel`, {});
  },

  /**
   * Get available time slots for a service on a specific date
   * @param {string} serviceId - Service ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} - Response from the API
   */
  async getAvailableTimeSlots(serviceId, date) {
    return apiService.get(`/bookings/available?serviceId=${serviceId}&date=${date}`);
  },

  /**
   * Add a review for a completed booking
   * @param {string} bookingId - Booking ID
   * @param {Object} reviewData - Review data including rating and comment
   * @returns {Promise} - Response from the API
   */
  async addReview(bookingId, reviewData) {
    return apiService.post(`/bookings/${bookingId}/review`, reviewData);
  }
}; 