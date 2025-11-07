import axios from 'axios'
import { API_ENDPOINTS } from '../utils/constants'
import { swapApiResponseNames } from '../utils/nameSwapper'

/**
 * API Service Layer
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */

const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with name swapping
api.interceptors.response.use(
  (response) => {
    // Apply name swapping to response data
    response.data = swapApiResponseNames(response.data);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const branchService = {
  getAllBranches: () => api.get(API_ENDPOINTS.BRANCHES),
  getBranchById: (id) => api.get(`${API_ENDPOINTS.BRANCHES}/${id}`),
  getActiveBranches: () => api.get(`${API_ENDPOINTS.BRANCHES}/active`)
}

export const entryService = {
  getAllEntries: () => api.get(API_ENDPOINTS.ENTRIES),
  getEntriesByBranch: (branchId) => api.get(`${API_ENDPOINTS.ENTRIES}/branch/${branchId}`),
  getEntriesByDateRange: (startDate, endDate) => 
    api.get(`${API_ENDPOINTS.ENTRIES}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getFootfallAnalytics: (branchId, startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate })
    if (branchId) params.append('branchId', branchId)
    return api.get(`${API_ENDPOINTS.ENTRIES}/analytics/footfall?${params}`)
  }
}

export const analyticsService = {
  getDashboardMetrics: (branchId, startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate })
    if (branchId) params.append('branchId', branchId)
    return api.get(`${API_ENDPOINTS.ANALYTICS}/dashboard/metrics?${params}`)
  },
  getFootfallTrends: (startDate, endDate) =>
    api.get(`${API_ENDPOINTS.ANALYTICS}/footfall-trends?startDate=${startDate}&endDate=${endDate}`),
  getPeakHours: (branchId, startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate })
    if (branchId) params.append('branchId', branchId)
    return api.get(`${API_ENDPOINTS.ANALYTICS}/peak-hours?${params}`)
  },
  getServiceUtilization: (branchId, startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate })
    if (branchId) params.append('branchId', branchId)
    return api.get(`${API_ENDPOINTS.ANALYTICS}/service-utilization?${params}`)
  },
  getBranchComparison: (startDate, endDate) =>
    api.get(`${API_ENDPOINTS.ANALYTICS}/branch-comparison?startDate=${startDate}&endDate=${endDate}`)
}

export const dashboardService = {
  getRealTimeStats: () => api.get(`${API_ENDPOINTS.DASHBOARD}/real-time-stats`),
  getDashboardAlerts: () => api.get(`${API_ENDPOINTS.DASHBOARD}/alerts`),
  getBranchSummary: (branchId) => api.get(`${API_ENDPOINTS.DASHBOARD}/summary/${branchId}`),
  
  // New Advanced Analytics Endpoints
  getCustomerSatisfaction: (branchId, startDate, endDate) => {
    const params = new URLSearchParams({ branchId, startDate, endDate })
    return api.get(`${API_ENDPOINTS.ANALYTICS}/customer-satisfaction?${params}`)
  },
  
  getServiceEfficiency: (branchId, startDate, endDate) => {
    const params = new URLSearchParams({ branchId, startDate, endDate })
    return api.get(`${API_ENDPOINTS.ANALYTICS}/service-efficiency?${params}`)
  },
  
  getPerformanceTrends: (branchId, startDate, endDate) => {
    const params = new URLSearchParams({ branchId, startDate, endDate })
    return api.get(`${API_ENDPOINTS.ANALYTICS}/performance-trends?${params}`)
  }
}

export default api