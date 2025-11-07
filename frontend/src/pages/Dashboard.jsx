import React, { useState, useEffect } from 'react'
import BranchDashboard from '../components/Dashboard/BranchDashboard'
import BranchSelector from '../components/Dashboard/BranchSelector'
import RealTimeIndicator from '../components/Dashboard/RealTimeIndicator'
import { useDashboardData } from '../hooks/useDashboardData'
import { RefreshCw } from 'lucide-react'

/**
 * Dashboard Page - Main analytics dashboard
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const Dashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const { data, isLoading, error } = useDashboardData(selectedBranch, dateRange)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto">
              <div className="absolute top-0 left-0 h-full w-full border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Loading Dashboard</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fetching latest analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    
    <div className="space-y-6 animate-fade-in">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Branch Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time analytics for ABC Bank branches
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <BranchSelector 
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
          />
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="flex items-center justify-between mb-4">
        <RealTimeIndicator 
          isConnected={!error}
          lastUpdate={lastUpdate}
        />
        <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 text-sm">
            Error loading dashboard data: {error}
          </p>
        </div>
      )}

      {/* Main Dashboard */}
      <BranchDashboard 
        selectedBranch={selectedBranch}
        dateRange={dateRange}
        data={data}
      />
    </div>
  )
}

export default Dashboard