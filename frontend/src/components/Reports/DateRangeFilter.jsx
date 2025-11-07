import React, { useState } from 'react'
import { Calendar, Clock, ChevronDown } from 'lucide-react'

/**
 * Professional Date Range Filter with Presets
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const DateRangeFilter = ({ startDate, endDate, onDateChange, onPresetChange }) => {
  const [showPresets, setShowPresets] = useState(false)
  
  const presets = [
    { label: 'Today', value: 'today', days: 0 },
    { label: 'Yesterday', value: 'yesterday', days: 1 },
    { label: 'Last 7 Days', value: '7d', days: 7 },
    { label: 'Last 30 Days', value: '30d', days: 30 },
    { label: 'Last 3 Months', value: '90d', days: 90 },
    { label: 'This Month', value: 'month', days: null },
    { label: 'This Quarter', value: 'quarter', days: null }
  ]

  const handlePresetClick = (preset) => {
    const today = new Date()
    let start, end

    switch (preset.value) {
      case 'today':
        start = end = today.toISOString().split('T')[0]
        break
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        start = end = yesterday.toISOString().split('T')[0]
        break
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        end = today.toISOString().split('T')[0]
        break
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3)
        start = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0]
        end = today.toISOString().split('T')[0]
        break
      default:
        if (preset.days !== null) {
          const startDate = new Date(today)
          startDate.setDate(startDate.getDate() - preset.days)
          start = startDate.toISOString().split('T')[0]
          end = today.toISOString().split('T')[0]
        }
    }

    onDateChange('start', start)
    onDateChange('end', end)
    onPresetChange?.(preset.value)
    setShowPresets(false)
  }

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="relative">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Select</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        
        {showPresets && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
            <div className="py-1">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange('start', e.target.value)}
            className="input-field"
            max={endDate}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange('end', e.target.value)}
            className="input-field"
            min={startDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Date Range Summary */}
      {startDate && endDate && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <span className="font-medium">Selected Range:</span> {startDate} to {endDate}
          <span className="ml-2 text-xs">
            ({Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} days)
          </span>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter