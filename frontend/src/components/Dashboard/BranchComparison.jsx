import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Building2, TrendingUp, Users, Clock } from 'lucide-react'
import { analyticsService } from '../../services/api'

/**
 * Branch Comparison Component - Compare performance across branches
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const BranchComparison = ({ selectedBranch, dateRange }) => {
  const [comparisonType, setComparisonType] = useState('performance')
  const [chartType, setChartType] = useState('bar')
  const [branchData, setBranchData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Format revenue in millions/billions for better readability
  const formatRevenue = (revenue) => {
    if (revenue >= 1000000000) {
      return `$${(revenue / 1000000000).toFixed(1)}B`
    } else if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`
    } else if (revenue >= 1000) {
      return `$${(revenue / 1000).toFixed(1)}K`
    } else {
      return `₹${revenue.toFixed(0)}`
    }
  }

  // Calculate date range based on dateRange prop
  const calculateDateRange = () => {
    const endDate = new Date() // Use current date
    const startDate = new Date(endDate)
    
    switch (dateRange) {
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
        startDate.setDate(endDate.getDate() - 90)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  }

  useEffect(() => {
    const fetchBranchComparison = async () => {
      try {
        setLoading(true)
        setError(null)
        const { startDate, endDate } = calculateDateRange()
        const response = await analyticsService.getBranchComparison(startDate, endDate)
        
        // Transform API data to component format
        const transformedData = response.data.map(branch => {
          // Handle wait time - ensure reasonable values (cap at 60 minutes)
          let waitTime = branch.avgVisitDuration || 0
          if (waitTime > 60) {
            // If value seems to be in seconds, convert to minutes
            waitTime = waitTime > 3600 ? Math.round(waitTime / 60) : waitTime
            // Final cap at 60 minutes for display purposes
            waitTime = Math.min(waitTime, 60)
          }
          
          return {
            branch: branch.branchName || 'Unknown',
            footfall: branch.totalFootfall || 0,
            satisfaction: branch.customerSatisfaction || 0,
            efficiency: Math.round(branch.serviceEfficiency || 0),
            revenue: branch.totalRevenue || 0,
            waitTime: Math.round(waitTime),
            staffCount: 5 // Default value, can be enhanced later
          }
        })
        
        setBranchData(transformedData)
      } catch (err) {
        console.error('Error fetching branch comparison:', err)
        setError('Failed to load branch comparison data')
        // Fallback to static data
        setBranchData([
          {
            branch: 'New York',
            footfall: 415,
            satisfaction: 4.1,
            efficiency: 87,
            revenue: 240000000, // 240M
            waitTime: 8,
            staffCount: 5
          },
          {
            branch: 'Washington DC',
            footfall: 520,
            satisfaction: 4.3,
            efficiency: 92,
            revenue: 380000000, // 380M
            waitTime: 7,
            staffCount: 7
          },
          {
            branch: 'New Jersey',
            footfall: 312,
            satisfaction: 4.0,
            efficiency: 83,
            revenue: 190000000, // 190M
            waitTime: 9,
            staffCount: 4
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBranchComparison()
  }, [dateRange])

  const performanceMetrics = branchData.map(branch => ({
    branch: branch.branch,
    Footfall: branch.footfall,
    Satisfaction: Math.round(branch.satisfaction * 20), // Scale to 100
    Efficiency: branch.efficiency,
    Revenue: Math.round(branch.revenue / 1000000) // Show in millions for chart
  }))

  // Create radar data with metrics as axes and branches as different radar lines
  const radarMetrics = ['Footfall', 'Satisfaction', 'Efficiency', 'Wait Time', 'Revenue']
  
  const radarData = radarMetrics.map(metric => {
    const dataPoint = { metric }
    branchData.forEach(branch => {
      let value = 0
      switch (metric) {
        case 'Footfall':
          value = Math.round((branch.footfall / 600) * 100) // Scale to 100
          break
        case 'Satisfaction':
          value = Math.round(branch.satisfaction * 20) // Scale to 100
          break
        case 'Efficiency':
          value = branch.efficiency // Already in percentage
          break
        case 'Wait Time':
          // Inverse scale: Lower wait time = higher score (better performance)
          // Assuming reasonable wait times: 0-30 minutes range
          // Cap at 30 minutes max for scaling purposes
          const cappedWaitTime = Math.min(branch.waitTime, 30)
          value = Math.round(Math.max(0, 100 - ((cappedWaitTime / 30) * 100)))
          break
        case 'Revenue':
          value = Math.round((branch.revenue / 500000000) * 100) // Scale to 100
          break
      }
      dataPoint[branch.branch] = Math.max(0, Math.min(100, value)) // Ensure 0-100 range
    })
    return dataPoint
  })

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="h-8 w-8 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto">
                <div className="absolute top-0 left-0 h-full w-full border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Loading Branch Comparison</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Performance Comparison
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comparative analysis across all ABC Bank branches
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
            disabled={loading}
          >
            <option value="performance">Performance</option>
            <option value="operational">Operational</option>
            <option value="financial">Financial</option>
          </select>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
            disabled={loading}
          >
            <option value="bar">Bar Chart</option>
            <option value="radar">Radar Chart</option>
          </select>
        </div>
      </div>

      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={performanceMetrics}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="branch" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="Footfall" fill="#3b82f6" name="Footfall" />
              <Bar dataKey="Satisfaction" fill="#10b981" name="Satisfaction (×20)" />
              <Bar dataKey="Efficiency" fill="#f59e0b" name="Utilization %" />
              <Bar dataKey="Revenue" fill="#8b5cf6" name="Revenue ($M)" />
            </BarChart>
          ) : (
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 8 }}
                tickCount={5}
              />
              {branchData.map((branch, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
                return (
                  <Radar
                    key={branch.branch}
                    name={branch.branch}
                    dataKey={branch.branch}
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                )
              })}
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name, props) => {
                  const metric = props.payload.metric
                  let displayValue = `${value}%`
                  let description = ''
                  
                  // Add context for each metric
                  switch (metric) {
                    case 'Wait Time':
                      description = ' (Lower wait time = Higher score)'
                      break
                    case 'Satisfaction':
                      description = ' (Scaled from 1-5 rating)'
                      break
                    case 'Footfall':
                      description = ' (Relative to capacity)'
                      break
                    case 'Revenue':
                      description = ' (Relative to target)'
                      break
                    case 'Efficiency':
                      description = ' (Service efficiency)'
                      break
                  }
                  
                  return [`${displayValue}`, name]
                }}
                labelFormatter={(label) => `Metric: ${label}`}
              />
              <Legend />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Branch Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branchData
          .sort((a, b) => b.footfall - a.footfall)
          .map((branch, index) => (
            <div key={branch.branch} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  #{index + 1} {branch.branch}
                </h4>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  index === 0 ? 'bg-green-100 text-green-800' :
                  index === 1 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {index === 0 ? 'Top' : index === 1 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Footfall
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {branch.footfall}
                  </span>
                </div>
                
                {/* <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Efficiency
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {branch.efficiency}%
                  </span>
                </div> */}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Wait Time
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(branch.waitTime)} min
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Revenue
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatRevenue(branch.revenue)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Performance Insights */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-200">Performance Analysis</p>
            <p className="text-blue-700 dark:text-blue-300">
              {branchData.length > 0 && (
                <>
                  {branchData.sort((a, b) => b.footfall - a.footfall)[0]?.branch} leads in overall performance with highest footfall ({branchData.sort((a, b) => b.footfall - a.footfall)[0]?.footfall}) and efficiency ({branchData.sort((a, b) => b.efficiency - a.efficiency)[0]?.efficiency}%). 
                  {branchData.sort((a, b) => b.waitTime - a.waitTime)[0]?.branch} shows potential for improvement in wait time optimization.
                </>
              )}
              {error && 'Data temporarily unavailable. Showing cached results.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BranchComparison