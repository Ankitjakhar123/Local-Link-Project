// This file contains worker functions that can be used 
// for CPU-intensive operations to keep the main thread responsive

/**
 * Image processing worker
 * Apply filters and transformations to images without blocking the UI
 */
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'filter':
      const result = applyFilter(data.imageData, data.filter);
      self.postMessage({ type: 'filter-result', result });
      break;
    
    case 'search':
      const searchResults = performSearch(data.items, data.query);
      self.postMessage({ type: 'search-result', results: searchResults });
      break;
      
    case 'sort':
      const sortedData = sortLargeDataset(data.items, data.sortBy, data.direction);
      self.postMessage({ type: 'sort-result', results: sortedData });
      break;
      
    default:
      self.postMessage({ type: 'error', message: 'Unknown operation type' });
  }
};

/**
 * Apply a filter to image data
 * @param {ImageData} imageData - The raw image data
 * @param {string} filter - The filter to apply (grayscale, blur, etc)
 * @returns {ImageData} The processed image data
 */
function applyFilter(imageData, filter) {
  const { data, width, height } = imageData;
  const result = new Uint8ClampedArray(data);
  
  switch (filter) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        result[i] = avg;
        result[i + 1] = avg;
        result[i + 2] = avg;
      }
      break;
      
    case 'invert':
      for (let i = 0; i < data.length; i += 4) {
        result[i] = 255 - data[i];
        result[i + 1] = 255 - data[i + 1];
        result[i + 2] = 255 - data[i + 2];
      }
      break;
  }
  
  return { data: result, width, height };
}

/**
 * Perform a fuzzy search on a large dataset
 * @param {Array} items - Array of items to search through
 * @param {string} query - Search query
 * @returns {Array} Filtered and sorted results
 */
function performSearch(items, query) {
  if (!query) return items;
  
  const lowerQuery = query.toLowerCase();
  return items
    .filter(item => {
      // Simple fuzzy search implementation
      const itemText = (item.name || item.title || '').toLowerCase();
      let score = 0;
      let lastIndex = -1;
      
      for (let i = 0; i < lowerQuery.length; i++) {
        const char = lowerQuery[i];
        const index = itemText.indexOf(char, lastIndex + 1);
        
        if (index === -1) {
          return false;
        }
        
        score += (index - lastIndex);
        lastIndex = index;
      }
      
      item._score = score;
      return true;
    })
    .sort((a, b) => a._score - b._score);
}

/**
 * Sort a large dataset efficiently
 * @param {Array} items - Array of items to sort
 * @param {string} sortBy - Property to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
function sortLargeDataset(items, sortBy, direction) {
  // Create a copy of the array to avoid mutations
  const result = [...items];
  
  const compare = (a, b) => {
    // Handle nested properties with dot notation
    const props = sortBy.split('.');
    let valA = a;
    let valB = b;
    
    for (let prop of props) {
      valA = valA?.[prop];
      valB = valB?.[prop];
    }
    
    // Handle different types
    if (typeof valA === 'string' && typeof valB === 'string') {
      return direction === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }
    
    return direction === 'asc' 
      ? valA - valB 
      : valB - valA;
  };
  
  return result.sort(compare);
} 