import { apiService } from './api';

export const productService = {
  /**
   * Get all products with optional filters
   * @param {Object} query - Optional query parameters
   * @returns {Promise} - Response from the API
   */
  async getProducts(query = {}) {
    const queryString = new URLSearchParams(query).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return apiService.get(endpoint);
  },

  /**
   * Get a product by ID
   * @param {string} id - Product ID
   * @returns {Promise} - Response from the API
   */
  async getProductById(id) {
    return apiService.get(`/products/${id}`);
  },

  /**
   * Create a new product (for admin)
   * @param {Object} productData - Product data
   * @returns {Promise} - Response from the API
   */
  async createProduct(productData) {
    return apiService.post('/products', productData);
  },

  /**
   * Update a product
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise} - Response from the API
   */
  async updateProduct(id, productData) {
    return apiService.put(`/products/${id}`, productData);
  },

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise} - Response from the API
   */
  async deleteProduct(id) {
    return apiService.delete(`/products/${id}`);
  },

  /**
   * Get products by category
   * @param {string} category - Category name
   * @returns {Promise} - Response from the API
   */
  async getProductsByCategory(category) {
    return apiService.get(`/products/category/${encodeURIComponent(category)}`);
  },

  /**
   * Search products by keyword
   * @param {string} query - Search query
   * @returns {Promise} - Response from the API
   */
  async searchProducts(query) {
    return apiService.get(`/products/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get products related to a service
   * @param {string} serviceId - Service ID
   * @returns {Promise} - Response from the API
   */
  async getRelatedProducts(serviceId) {
    return apiService.get(`/products/related/${serviceId}`);
  }
}; 