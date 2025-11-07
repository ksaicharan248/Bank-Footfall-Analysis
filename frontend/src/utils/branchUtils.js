/**
 * Branch Utilities
 * Helper functions for branch-related operations
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */

/**
 * Convert branch selector value to database branch ID
 * @param {string} selectedBranch - Branch selector value ('all', 'siruseri', 'tnagar', 'navalur')
 * @returns {number|null} - Branch ID for database queries or null for all branches
 */
export const getBranchId = (selectedBranch) => {
  switch(selectedBranch) {
    case 'siruseri': return 1;
    case 'tnagar': return 2;
    case 'navalur': return 3;
    case 'all':
    default: return null; // null means all branches
  }
};

/**
 * Convert branch ID to display name
 * @param {number} branchId - Database branch ID
 * @returns {string} - Display name for the branch
 */
export const getBranchName = (branchId) => {
  switch(branchId) {
    case 1: return 'New York IT Hub';
    case 2: return 'Washington DC Commercial';
    case 3: return 'New Jersey Residential';
    default: return 'All Branches';
  }
};

/**
 * Get all available branches
 * @returns {Array} - Array of branch objects with id and name
 */
export const getAllBranches = () => [
  { id: null, value: 'all', name: 'All Branches' },
  { id: 1, value: 'siruseri', name: 'New York IT Hub' },
  { id: 2, value: 'tnagar', name: 'Washington DC Commercial' },
  { id: 3, value: 'navalur', name: 'New Jersey Residential' }
];
