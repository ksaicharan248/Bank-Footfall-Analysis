import React from 'react'
import { Zap, Wifi, WifiOff } from 'lucide-react'

/**
 * Real-time Status Indicator Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const RealTimeIndicator = ({ isConnected = true, lastUpdate = new Date() }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {isConnected ? (
        <>
          <div className="flex items-center space-x-1 text-green-600">
            <Zap className="h-4 w-4 animate-pulse" />
            <Wifi className="h-3 w-3" />
            <span className="font-medium">Live</span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-500 dark:text-gray-400">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </>
      ) : (
        <>
          <div className="flex items-center space-x-1 text-red-600">
            <WifiOff className="h-4 w-4" />
            <span className="font-medium">Offline</span>
          </div>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-gray-500 dark:text-gray-400">
            Last: {lastUpdate.toLocaleTimeString()}
          </span>
        </>
      )}
    </div>
  )
}

export default RealTimeIndicator