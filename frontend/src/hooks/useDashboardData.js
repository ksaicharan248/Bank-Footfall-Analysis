import { useState, useEffect } from 'react'

/**
 * Custom hook for dashboard data management
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
import { analyticsService, dashboardService } from '../services/api'

export const useDashboardData = (selectedBranch, dateRange) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Use actual dateRange parameter instead of hardcoded 7 days
        let startDate, endDate = new Date().toISOString().split('T')[0];
        
                // Parse dateRange to get correct date period
        switch(dateRange) {
          case '1d':
          case 'Last 24 Hours':
            startDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case '7d':
          case 'Last 7 Days':
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case '30d':
          case 'Last 30 Days':
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case '90d':
          case 'Last 3 Months':
            startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          default:
            // Default to 7 days if dateRange is not recognized
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }
        
        const branchId = selectedBranch === 'all' ? null : getBranchId(selectedBranch)
        
       
        const [metrics, alerts] = await Promise.all([
          analyticsService.getDashboardMetrics(branchId, startDate, endDate),
          dashboardService.getDashboardAlerts()
        ])
        
      
        setData({
          ...metrics.data,
          alerts: alerts.data
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedBranch, dateRange])

  const getBranchId = (branchName) => {
    const branchMap = { 'siruseri': 1, 'tnagar': 2, 'navalur': 3 }
    return branchMap[branchName] || 1
  }

  return { data, isLoading, error }
}