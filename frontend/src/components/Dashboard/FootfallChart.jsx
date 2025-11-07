import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts'
import { TrendingUp, X, Maximize2 } from 'lucide-react'
import ChartControls from './ChartControls'
import { formatDate, getChartColors, customTooltipStyle } from '../../utils/chartUtils'
import { analyticsService } from '../../services/api'

/**
 * Footfall Chart Component - Displays customer footfall trends
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const FootfallChart = ({ selectedBranch, dateRange }) => {
  const [chartType, setChartType] = useState('area')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [footfallData, setFootfallData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Generate realistic prediction data for next 7 days
  const generatePredictionData = () => {
    const predictions = []
    const today = new Date()
    
    // Banking footfall patterns (higher on weekdays, lower on weekends)
    // Target total: 250-280 for 7 days = ~35-40 per day average
    const dailyPatterns = {
      0: 0.8,  // Sunday - 20% lower
      1: 1.2,  // Monday - 20% higher (start of week)
      2: 1.1,  // Tuesday - 10% higher
      3: 1.15, // Wednesday - 15% higher (mid-week peak)
      4: 1.1,  // Thursday - 10% higher
      5: 1.0,  // Friday - average
      6: 0.85  // Saturday - 15% lower
    }
    
    // Base daily average (targeting 265 total / 7 days = ~38 per day)
    const baseDailyTotal = 38
    
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today)
      futureDate.setDate(today.getDate() + i)
      const dayOfWeek = futureDate.getDay()
      
      // Apply daily pattern multiplier
      const dailyMultiplier = dailyPatterns[dayOfWeek]
      const dailyTotal = Math.round(baseDailyTotal * dailyMultiplier)
      
      // Distribute across branches (typical banking distribution)
      // New York (Siruseri): 40% - main business district
      // Washington DC (Tnagar): 35% - government area
      // New Jersey (Navalur): 25% - residential/suburban
      const siruseriFootfall = Math.round(dailyTotal * 0.40)
      const tnagarFootfall = Math.round(dailyTotal * 0.35)
      const navalurFootfall = dailyTotal - siruseriFootfall - tnagarFootfall // remaining
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        siruseri: siruseriFootfall,
        tnagar: tnagarFootfall,
        navalur: navalurFootfall,
        total: dailyTotal,
        predicted: true,
        isPredicted: true
      })
    }
    
    return predictions
  }

  useEffect(() => {
    const fetchFootfallData = async () => {
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
        
        // Fetch historical data
        const response = await analyticsService.getFootfallTrends(startDate, endDate)
        const historicalData = response.data || [];
        
        // Apply name swapping for display
        const processedHistoricalData = historicalData.map(item => ({
          ...item,
          predicted: false,
          isPredicted: false,
          // Keep original API field names but add display names for UI
          displaySiruseri: 'New York',
          displayTnagar: 'Washington DC', 
          displayNavalur: 'New Jersey'
        }));
        
        // If prediction is enabled, add prediction data
        let finalData = processedHistoricalData;
        if (showPrediction) {
          const predictionData = generatePredictionData();
          finalData = [...processedHistoricalData, ...predictionData];
        }
        
        setFootfallData(finalData);
      } catch (error) {
        console.error('Error fetching footfall data:', error)
        // If API fails but prediction is enabled, show only prediction data
        if (showPrediction) {
          const predictionData = generatePredictionData();
          setFootfallData(predictionData);
        } else {
          setFootfallData([])
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFootfallData()
  }, [selectedBranch, dateRange, showPrediction]) // Added showPrediction dependency

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleDownload = () => {
    
    // Implement chart download functionality
  }

  const handleMaximize = () => {
    setIsFullscreen(true)
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
  }

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  const getDisplayData = () => {
    return footfallData.map(item => ({
      ...item,
      date: formatDate(item.date),
      isPredicted: item.predicted === true
    }))
  }

  const colors = getChartColors()
  
  // Separate historical and predicted data for different visual styling
  const getHistoricalData = () => getDisplayData().filter(item => !item.isPredicted)
  const getPredictedData = () => getDisplayData().filter(item => item.isPredicted)
  
  const getBranchLines = () => {
    if (selectedBranch === 'all') {
      return [
        { key: 'siruseri', name: 'New York', color: colors.siruseri },
        { key: 'tnagar', name: 'Washington DC', color: colors.tnagar },
        { key: 'navalur', name: 'New Jersey', color: colors.navalur },
        { key: 'total', name: 'Total', color: colors.total, strokeWidth: 3 }
      ]
    } else {
      const branchMap = {
        'siruseri': { key: 'siruseri', name: 'New York', color: colors.siruseri },
        'tnagar': { key: 'tnagar', name: 'Washington DC', color: colors.tnagar },
        'navalur': { key: 'navalur', name: 'New Jersey', color: colors.navalur }
      }
      return [branchMap[selectedBranch]]
    }
  }

  // Calculate dynamic summary stats from footfall data
  const calculateSummaryStats = () => {
    if (!footfallData || footfallData.length === 0) {
      return {
        totalVisitors: 0,
        growthRate: 0,
        dailyAverage: 0,
        peakDay: 0,
        predictedTotal: 0,
        historicalTotal: 0
      }
    }

    // Separate historical and predicted data
    const historicalData = footfallData.filter(item => !item.isPredicted)
    const predictedData = footfallData.filter(item => item.isPredicted)

    // Calculate for selected branch or all branches
    const getRelevantValue = (item) => {
      return selectedBranch === 'all' ? item.total : (item[selectedBranch] || 0)
    }

    const historicalValues = historicalData.map(getRelevantValue)
    const predictedValues = predictedData.map(getRelevantValue)
    const allValues = footfallData.map(getRelevantValue)

    const historicalTotal = historicalValues.reduce((sum, value) => sum + value, 0)
    const predictedTotal = predictedValues.reduce((sum, value) => sum + value, 0)
    const totalVisitors = allValues.reduce((sum, value) => sum + value, 0)
    
    const dailyAverage = historicalValues.length > 0 ? 
      Math.round(historicalTotal / historicalValues.length) : 0
    const peakDay = Math.max(...allValues, 0)
    
    // Calculate growth rate (comparing last historical value with first historical value)
    const firstValue = historicalValues[0] || 0
    const lastValue = historicalValues[historicalValues.length - 1] || 0
    const growthRate = firstValue > 0 ? ((lastValue - firstValue) / firstValue * 100).toFixed(1) : 0

    return {
      totalVisitors,
      growthRate,
      dailyAverage,
      peakDay,
      predictedTotal,
      historicalTotal
    }
  }

  const summaryStats = calculateSummaryStats()

  // Chart rendering component for reuse in normal and fullscreen modes
  const renderChart = (height = "100%") => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === 'area' ? (
        <AreaChart data={getDisplayData()}>
          <defs>
            <linearGradient id="colorSiruseri" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTnagar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNavalur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={customTooltipStyle}
            labelFormatter={(label, payload) => {
              const isPredicted = payload && payload[0] && payload[0].payload.isPredicted;
              return `${label}${isPredicted ? ' (Predicted)' : ''}`;
            }}
            formatter={(value, name, props) => {
              const isPredicted = props.payload.isPredicted;
              const displayValue = isPredicted ? `${value} (predicted)` : value;
              return [displayValue, name];
            }}
          />
          <Legend />
          {getBranchLines().map(branch => (
            <Area
              key={branch.key}
              type="monotone"
              dataKey={branch.key}
              stroke={branch.color}
              strokeWidth={branch.strokeWidth || 2}
              fill={`url(#color${branch.key.charAt(0).toUpperCase() + branch.key.slice(1)})`}
              name={branch.name}
              strokeDasharray={(data) => data && data.isPredicted ? "5 5" : "0"}
            />
          ))}
        </AreaChart>
      ) : chartType === 'line' ? (
        <LineChart data={getDisplayData()}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={customTooltipStyle}
            labelFormatter={(label, payload) => {
              const isPredicted = payload && payload[0] && payload[0].payload.isPredicted;
              return `${label}${isPredicted ? ' (Predicted)' : ''}`;
            }}
            formatter={(value, name, props) => {
              const isPredicted = props.payload.isPredicted;
              const displayValue = isPredicted ? `${value} (predicted)` : value;
              return [displayValue, name];
            }}
          />
          <Legend />
          {getBranchLines().map(branch => (
            <Line
              key={branch.key}
              type="monotone"
              dataKey={branch.key}
              stroke={branch.color}
              strokeWidth={branch.strokeWidth || 2}
              name={branch.name}
              strokeDasharray="0"
              dot={(props) => {
                const isPredicted = props.payload && props.payload.isPredicted;
                return isPredicted ? 
                  <circle cx={props.cx} cy={props.cy} r={3} fill={branch.color} strokeDasharray="5 5" opacity={0.7} /> :
                  <circle cx={props.cx} cy={props.cy} r={3} fill={branch.color} />;
              }}
            />
          ))}
        </LineChart>
      ) : (
        <ComposedChart data={getDisplayData()}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={customTooltipStyle}
            labelFormatter={(label, payload) => {
              const isPredicted = payload && payload[0] && payload[0].payload.isPredicted;
              return `${label}${isPredicted ? ' (Predicted)' : ''}`;
            }}
            formatter={(value, name, props) => {
              const isPredicted = props.payload.isPredicted;
              const displayValue = isPredicted ? `${value} (predicted)` : value;
              return [displayValue, name];
            }}
          />
          <Legend />
          {getBranchLines().map(branch => (
            <Bar
              key={branch.key}
              dataKey={branch.key}
              fill={branch.color}
              name={branch.name}
              opacity={(data) => data && data.isPredicted ? 0.6 : 1}
            />
          ))}
        </ComposedChart>
      )}
    </ResponsiveContainer>
  )

  return (
    <>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Customer Footfall Trends
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time visitor analytics with predictive insights
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={showPrediction}
                  onChange={(e) => setShowPrediction(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-300">Show Prediction</span>
              </label>
            </div>
            
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
            >
              <option value="area">Area Chart</option>
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
            
            <ChartControls
              onRefresh={handleRefresh}
              onDownload={handleDownload}
              onMaximize={handleMaximize}
              isRefreshing={isRefreshing}
            />
          </div>
        </div>

        <div className="h-80">
          {renderChart()}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {summaryStats.historicalTotal.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Historical Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {summaryStats.dailyAverage}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Daily Average</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary-600">
              {summaryStats.peakDay}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Peak Day</div>
          </div>
          {showPrediction && summaryStats.predictedTotal > 0 && (
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {summaryStats.predictedTotal.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">7-Day Prediction</div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full h-full max-w-7xl max-h-full flex flex-col">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Customer Footfall Trends - Fullscreen View
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedBranch === 'all' ? 'All Branches' : `${selectedBranch} Branch`} • {dateRange} analysis
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="checkbox"
                      checked={showPrediction}
                      onChange={(e) => setShowPrediction(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Show Prediction</span>
                  </label>
                </div>
                
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                >
                  <option value="area">Area Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                </select>
                
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  title="Download Chart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                
                <button
                  onClick={handleCloseFullscreen}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  title="Exit Fullscreen"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Fullscreen Chart */}
            <div className="flex-1 p-6">
              {renderChart("100%")}
            </div>

            {/* Fullscreen Summary Stats */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summaryStats.historicalTotal.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Historical Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summaryStats.dailyAverage}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Daily Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {summaryStats.peakDay}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Peak Day</div>
                </div>
                {showPrediction && summaryStats.predictedTotal > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {summaryStats.predictedTotal.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">7-Day Prediction</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FootfallChart