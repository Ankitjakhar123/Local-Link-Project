import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Base API URL - would typically come from environment variables
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Handles common fetch logic and error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Promise with API response
 */
const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Merge default headers with user options
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Include auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, { 
      ...options, 
      headers,
      // Add cache control headers for browser caching
      cache: options.cache || 'default',
    });
    
    // Parse based on content type
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Hook for GET requests with React Query caching
 * @param {string} endpoint - API endpoint
 * @param {Object} options - React Query options
 * @returns {Object} React Query result
 */
export const useApiGet = (endpoint, options = {}) => {
  const {
    staleTime = 5 * 60 * 1000, // Default stale time: 5 minutes
    cacheTime = 10 * 60 * 1000, // Default cache time: 10 minutes
    refetchOnWindowFocus = false,
    enabled = true,
    ...queryOptions
  } = options;
  
  return useQuery({
    queryKey: Array.isArray(options.queryKey) ? options.queryKey : [endpoint],
    queryFn: () => fetchApi(endpoint, { method: 'GET' }),
    staleTime,
    cacheTime,
    refetchOnWindowFocus,
    enabled,
    ...queryOptions,
  });
};

/**
 * Hook for POST requests with React Query mutations
 * @param {string} endpoint - API endpoint
 * @param {Object} options - React Query mutation options
 * @returns {Object} React Query mutation result
 */
export const useApiPost = (endpoint, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => 
      fetchApi(endpoint, { 
        method: 'POST', 
        body: JSON.stringify(data),
      }),
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries if needed
      if (options.invalidateQueries) {
        if (Array.isArray(options.invalidateQueries)) {
          options.invalidateQueries.forEach(query => {
            queryClient.invalidateQueries({ queryKey: Array.isArray(query) ? query : [query] });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: [options.invalidateQueries] });
        }
      }
      
      // Run user-provided onSuccess callback
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook for PUT requests with React Query mutations
 * @param {string} endpoint - API endpoint
 * @param {Object} options - React Query mutation options
 * @returns {Object} React Query mutation result
 */
export const useApiPut = (endpoint, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => 
      fetchApi(endpoint, { 
        method: 'PUT', 
        body: JSON.stringify(data),
      }),
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries if needed
      if (options.invalidateQueries) {
        if (Array.isArray(options.invalidateQueries)) {
          options.invalidateQueries.forEach(query => {
            queryClient.invalidateQueries({ queryKey: Array.isArray(query) ? query : [query] });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: [options.invalidateQueries] });
        }
      }
      
      // Run user-provided onSuccess callback
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook for DELETE requests with React Query mutations
 * @param {string} endpoint - API endpoint
 * @param {Object} options - React Query mutation options
 * @returns {Object} React Query mutation result
 */
export const useApiDelete = (endpoint, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => 
      fetchApi(`${endpoint}/${id}`, { 
        method: 'DELETE',
      }),
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries if needed
      if (options.invalidateQueries) {
        if (Array.isArray(options.invalidateQueries)) {
          options.invalidateQueries.forEach(query => {
            queryClient.invalidateQueries({ queryKey: Array.isArray(query) ? query : [query] });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: [options.invalidateQueries] });
        }
      }
      
      // Run user-provided onSuccess callback
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
}; 