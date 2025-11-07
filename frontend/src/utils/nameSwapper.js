/**
 * Name Swapping Utility - Global utility for swapping database branch names to display names
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */

// Database to Display Name Mapping
const BRANCH_NAME_MAP = {
  // Database names (from Indian cities) to Display names (US cities)
  'siruseri': 'New York',
  'Siruseri': 'New York',
  'SIRUSERI': 'New York',
  'tnagar': 'Washington DC',
  'T Nagar': 'Washington DC',
  'T NAGAR': 'Washington DC',
  'navalur': 'New Jersey',
  'Navalur': 'New Jersey',
  'NAVALUR': 'New Jersey'
};

// Reverse mapping for Display to Database conversion (if needed)
const DISPLAY_TO_DB_MAP = {
  'New York': 'Siruseri',
  'Washington DC': 'T Nagar',
  'New Jersey': 'Navalur'
};

/**
 * Swap branch name from database format to display format
 * @param {string} dbName - Database branch name (Indian city)
 * @returns {string} Display branch name (US city)
 */
export const swapBranchName = (dbName) => {
  if (!dbName || typeof dbName !== 'string') {
    return dbName;
  }
  return BRANCH_NAME_MAP[dbName] || dbName;
};

/**
 * Swap display name back to database format
 * @param {string} displayName - Display branch name (US city)
 * @returns {string} Database branch name (Indian city)
 */
export const swapToDbName = (displayName) => {
  if (!displayName || typeof displayName !== 'string') {
    return displayName;
  }
  return DISPLAY_TO_DB_MAP[displayName] || displayName;
};

/**
 * Swap all branch names in an object
 * @param {Object} obj - Object containing branch names
 * @param {Array} branchFields - Array of field names that contain branch names
 * @returns {Object} Object with swapped branch names
 */
export const swapBranchNamesInObject = (obj, branchFields = ['branchName', 'branch']) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const swapped = { ...obj };
  branchFields.forEach(field => {
    if (swapped[field]) {
      swapped[field] = swapBranchName(swapped[field]);
    }
  });
  
  return swapped;
};

/**
 * Swap branch names in an array of objects
 * @param {Array} array - Array of objects containing branch names
 * @param {Array} branchFields - Array of field names that contain branch names
 * @returns {Array} Array with swapped branch names
 */
export const swapBranchNamesInArray = (array, branchFields = ['branchName', 'branch']) => {
  if (!Array.isArray(array)) {
    return array;
  }
  
  return array.map(item => swapBranchNamesInObject(item, branchFields));
};

/**
 * Swap branch names in API response data
 * @param {any} data - API response data (object, array, or primitive)
 * @param {Array} branchFields - Array of field names that contain branch names
 * @returns {any} Data with swapped branch names
 */
export const swapApiResponseNames = (data, branchFields = ['branchName', 'branch']) => {
  if (Array.isArray(data)) {
    return swapBranchNamesInArray(data, branchFields);
  } else if (data && typeof data === 'object') {
    return swapBranchNamesInObject(data, branchFields);
  }
  return data;
};

/**
 * Replace text content with swapped branch names (useful for descriptions and messages)
 * @param {string} text - Text content containing branch names
 * @returns {string} Text with swapped branch names
 */
export const swapBranchNamesInText = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  let swappedText = text;
  Object.entries(BRANCH_NAME_MAP).forEach(([dbName, displayName]) => {
    // Use case-insensitive replacement
    const regex = new RegExp(dbName, 'gi');
    swappedText = swappedText.replace(regex, displayName);
  });
  
  return swappedText;
};

// Default export for convenience
export default {
  swapBranchName,
  swapToDbName,
  swapBranchNamesInObject,
  swapBranchNamesInArray,
  swapApiResponseNames,
  swapBranchNamesInText
};
