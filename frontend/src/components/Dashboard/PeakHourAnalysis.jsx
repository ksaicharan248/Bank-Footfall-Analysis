import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Clock, TrendingUp } from 'lucide-react'
import { getStatusColor, customTooltipStyle } from '../../utils/chartUtils'
import { analyticsService } from '../../services/api'
import { getBranchId } from '../../utils/branchUtils'

const PeakHourAnalysis = ({ selectedBranch, dateRange }) => {
  const [selectedHour, setSelectedHour] = useState(null)
  const [peakData, setPeakData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPeakData = async () => {
      try {
        // Calculate date range based on dateRange prop
        const calculateDateRange = (range) => {
          const endDate = new Date() // Use current date
          let startDate = new Date(endDate)
          
          switch (range) {
            case '1d':
              startDate.setDate(endDate.getDate() - 1)
              break
            case '7d':
              startDate.setDate(endDate.getDate() - 7)
              break
            case '30d':
              startDate.setDate(endDate.getDate() - 30)
              break
            case '90d':
            default:
              startDate.setDate(endDate.getDate() - 90)
              break
          }
          
          return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          }
        }

        const { startDate, endDate } = calculateDateRange(dateRange)
        const branchId = getBranchId(selectedBranch)
        
        
        const response = await analyticsService.getPeakHours(branchId, startDate, endDate)
        
        
        
        
        // Transform the data to display-friendly format and validate utilization values
        const transformedData = response.data.map(item => ({
          ...item,
          hour: formatHourForDisplay(item.hour),
          // Cap utilization at 100% to prevent impossible values
          utilization: Math.min(100, Math.max(0, item.utilization || 0))
        }))
        
        
        setPeakData(transformedData)
      } catch (error) {
        console.error('Error fetching peak data:', error)
        // Fallback data
        setPeakData([
          { hour: '9AM', visitors: 12, capacity: 50, utilization: 24, status: 'low' },
          { hour: '10AM', visitors: 25, capacity: 50, utilization: 50, status: 'medium' },
          { hour: '11AM', visitors: 35, capacity: 50, utilization: 70, status: 'medium' },
          { hour: '12PM', visitors: 45, capacity: 50, utilization: 90, status: 'high' }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPeakData()
  }, [selectedBranch, dateRange])

  const formatHourForDisplay = (hour24) => {
    // Convert "09:00" to "9AM", "13:00" to "1PM", etc.
    const [hourStr] = hour24.split(':')
    const hour = parseInt(hourStr)
    if (hour === 0) return '12AM'
    if (hour < 12) return `${hour}AM`
    if (hour === 12) return '12PM'
    return `${hour - 12}PM`
  }

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      setSelectedHour(data.activePayload[0].payload.hour)
    }
  }

  const peakHour = peakData.length > 0 ? peakData.reduce((max, current) => 
    current.visitors > max.visitors ? current : max
  ) : { hour: 'N/A', visitors: 0, utilization: 0 }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Peak Hour Analysis
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hourly visitor distribution and capacity utilization
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Peak: {peakHour.hour}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {peakHour.visitors} visitors
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading peak hour data...</div>
        </div>
      ) : peakData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">No peak hour data available</div>
        </div>
      ) : (
        <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={peakData}
            onMouseEnter={(data) => setSelectedHour(data?.activeLabel)}
            onMouseLeave={() => setSelectedHour(null)}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="hour" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Visitors: <span className="font-medium">{data.visitors}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Utilization: <span className="font-medium">{data.utilization}%</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status: <span className={`font-medium ${
                          data.status === 'high' ? 'text-red-600' :
                          data.status === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>{data.status.toUpperCase()}</span>
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="visitors" radius={[4, 4, 0, 0]}>
              {peakData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      )}
      
      {/* Status Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Low (&lt;50%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Medium (50-74%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">High (75-100%)</span>
        </div>
      </div>
      
      {/* Insights */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-200">Peak Hour Insight</p>
            <p className="text-blue-700 dark:text-blue-300">
              Highest traffic at {peakHour.hour} with {peakHour.utilization}% capacity utilization. 
              Consider additional staff during 12PM-2PM window.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeakHourAnalysis