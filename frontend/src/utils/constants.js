/**
 * Application Constants
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */

export const BRANCH_CODES = {
  ALL: 'all',
  SIRUSERI: 'siruseri',
  TNAGAR: 'tnagar',
  NAVALUR: 'navalur'
}

export const BRANCHES = [
  { id: BRANCH_CODES.ALL, name: 'All Branches', code: 'ALL' },
  { id: BRANCH_CODES.SIRUSERI, name: 'New York', code: 'ABC001' },
  { id: BRANCH_CODES.TNAGAR, name: 'Washington DC', code: 'ABC002' },
  { id: BRANCH_CODES.NAVALUR, name: 'New Jersey', code: 'ABC003' }
]

export const DATE_RANGES = {
  '1d': { label: 'Last 24 Hours', days: 1 },
  '7d': { label: 'Last 7 Days', days: 7 },
  '30d': { label: 'Last 30 Days', days: 30 },
  '90d': { label: 'Last 3 Months', days: 90 }
}

export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6'
}

export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8080/api',
  BRANCHES: '/branches',
  ENTRIES: '/entries',
  STAFF: '/staff',
  TRANSACTIONS: '/transactions',
  ANALYTICS: '/analytics',
  DASHBOARD: '/dashboard'
}

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  ANALYST: 'ANALYST'
}