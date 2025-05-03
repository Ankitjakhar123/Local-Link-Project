/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} The slug
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
};

/**
 * Generate a unique slug by checking against existing slugs
 * @param {string} baseSlug - The initial slug to check
 * @param {function} checkExists - Async function that checks if slug exists
 * @returns {string} A unique slug
 */
const generateUniqueSlug = async (baseSlug, checkExists) => {
  let slug = baseSlug;
  let counter = 1;
  let exists = await checkExists(slug);
  
  // If slug exists, append a counter and check again
  while (exists) {
    slug = `${baseSlug}-${counter}`;
    exists = await checkExists(slug);
    counter++;
  }
  
  return slug;
};

module.exports = { slugify, generateUniqueSlug }; 