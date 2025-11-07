import React from 'react'
import { Download, Maximize2, RefreshCw, Settings } from 'lucide-react'

/**
 * Reusable Chart Controls Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const ChartControls = ({ 
  onRefresh, 
  onDownload, 
  onMaximize, 
  onSettings,
  isRefreshing = false,
  showSettings = false 
}) => {
  return (
    <div className="flex items-center space-x-2">
      {showSettings && (
        <button
          onClick={onSettings}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Chart Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      )}
      
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        title="Refresh Data"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
      
      <button
        onClick={onDownload}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Download Chart"
      >
        <Download className="h-4 w-4" />
      </button>
      
      <button
        onClick={onMaximize}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Maximize Chart"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default ChartControls