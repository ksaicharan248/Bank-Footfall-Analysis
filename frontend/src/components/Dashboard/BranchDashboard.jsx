import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Clock, AlertCircle } from 'lucide-react'
import BranchMetrics from './BranchMetrics'
import FootfallChart from './FootfallChart'
import ServiceHeatmap from './ServiceHeatmap'
import PeakHourAnalysis from './PeakHourAnalysis'
import BranchComparison from './BranchComparison'
import { dashboardService } from '../../services/api'

/**
 * Main Branch Dashboard Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const BranchDashboard = ({ selectedBranch, dateRange, data }) => {
  const [alerts, setAlerts] = useState([])
  const [realTimeStats, setRealTimeStats] = useState({})
  const [analyticsData, setAnalyticsData] = useState({})
  const isLoading = !data

  // Helper function to generate realistic chart data based on actual values
  const generateChartData = (baseValue, days = 7) => {
    const variation = 0.2; // 20% variation
    return Array.from({ length: days }, (_, i) => {
      const trend = Math.sin((i / days) * Math.PI) * 0.3 + 0.7; // Sine wave for natural variation
      const randomFactor = 0.9 + Math.random() * 0.2; // ±10% random variation
      const normalizedValue = Math.max(30, Math.min(95, (baseValue / 100) * trend * randomFactor * 100));
      return Math.round(normalizedValue);
    });
  }

  // Extract calculateAnalyticsData function so it can be called from button click
  const calculateAnalyticsData = async () => {
    if (data && dateRange) {
      try {
        // Convert dateRange to proper format
        let startDate, endDate;
        
        if (dateRange.includes(' to ')) {
          // Range format like "2024-12-01 to 2024-12-31"
          const dates = dateRange.split(' to ');
          startDate = dates[0];
          endDate = dates[1];
        } else if (dateRange === '7d') {
          // Last 7 days
          const today = new Date();
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          startDate = weekAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else if (dateRange === '30d') {
          // Last 30 days
          const today = new Date();
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          startDate = monthAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else {
          // Default to last 7 days
          const today = new Date();
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          startDate = weekAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        }
        
        // Convert branch selection to proper branchId
        let branchId;
        if (selectedBranch === 'all' || !selectedBranch) {
          branchId = 1; // Default to branch 1 for demo
        } else if (typeof selectedBranch === 'string') {
          // Try to extract number from string like "Branch 1" or use 1 as default
          const match = selectedBranch.match(/\d+/);
          branchId = match ? parseInt(match[0]) : 1;
        } else {
          branchId = selectedBranch;
        }
       
        
        // Fetch real analytics data from new APIs
        const [satisfactionRes, efficiencyRes, trendsRes] = await Promise.all([
          dashboardService.getCustomerSatisfaction(branchId, startDate, endDate),
          dashboardService.getServiceEfficiency(branchId, startDate, endDate), 
          dashboardService.getPerformanceTrends(branchId, startDate, endDate)
        ]);

       

        setAnalyticsData({
          satisfaction: satisfactionRes.data,
          efficiency: efficiencyRes.data,
          trends: {
            ...trendsRes.data,
            // Store raw data for direct use in charts
            rawRevenueChart: trendsRes.data.revenueChart || [],
            rawTransactionChart: trendsRes.data.transactionChart || []
          }
        });

      } catch (error) {
        console.error('Error fetching real analytics data:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
        
        // Fallback to calculated values from existing data
        const satisfaction = data.customerSatisfaction || 0;
        const satisfactionScore = Math.min(satisfaction * 2, 10); // Convert 0-5 scale to 0-10
        const footfall = data.totalFootfall || 0;
        const revenue = data.totalRevenue || 0;
        const efficiency = data.serviceEfficiency || 0;
        
        // Calculate fallback metrics
        const estimatedReviews = Math.max(Math.floor(footfall / 5), 1);
        const dailyRevenue = revenue / 7;
        const estimatedTransactions = Math.floor(revenue / 2500);
        const waitTimeCalculated = Math.max(1, Math.round(10 - (efficiency / 10)));
        const transactionSpeedCalc = Math.min(efficiency + 20, 98);
        const staffUtilizationCalc = Math.min(efficiency + 15, 95);
        
        setAnalyticsData({
          satisfaction: {
            score: satisfactionScore.toFixed(1),
            change: (satisfaction - 3.5).toFixed(1),
            reviewCount: estimatedReviews
          },
          efficiency: {
            waitTime: waitTimeCalculated,
            transactionSpeed: transactionSpeedCalc,
            staffUtilization: staffUtilizationCalc
          },
          trends: {
            dailyRevenue: dailyRevenue,
            transactionCount: estimatedTransactions,
            revenueGrowth: revenue > 2000000 ? 12.5 : 8.3,
            transactionGrowth: footfall > 100 ? 8.3 : 5.2,
            peakHour: data.peakHourTraffic > 25 ? "2:00 PM" : "11:00 AM",
            efficiency: efficiency,
            revenueChart: generateChartData(revenue / 100000, 7),
            transactionChart: generateChartData(footfall, 7)
          }
        });
      }
    }
  }

  useEffect(() => {
    if (data?.alerts) {
      setAlerts(data.alerts)
    }
  }, [data])

  useEffect(() => {
    const fetchRealTimeStats = async () => {
      try {
        const response = await dashboardService.getRealTimeStats()
        setRealTimeStats(response.data)
      } catch (error) {
        console.error('Error fetching real-time stats:', error)
      }
    }
    
    fetchRealTimeStats()
    calculateAnalyticsData()
    const interval = setInterval(fetchRealTimeStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [selectedBranch, dateRange, data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto">
              <div className="absolute top-0 left-0 h-full w-full border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Loading Dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Live Alerts</h3>
          </div>
          <div className="space-y-1">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between text-sm">
                <span className="text-yellow-700 dark:text-yellow-300">{alert.message}</span>
                <span className="text-yellow-600 dark:text-yellow-400 text-xs">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug: Manual Refresh Button */}
  
      {/* Key Metrics */}
      <BranchMetrics 
        selectedBranch={selectedBranch}
        dateRange={dateRange}
        data={data}
      />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Footfall Trends - Full Width */}
        <div className="lg:col-span-2">
          <FootfallChart 
            selectedBranch={selectedBranch}
            dateRange={dateRange}
          />
        </div>

        {/* Peak Hour Analysis */}
        <PeakHourAnalysis 
          selectedBranch={selectedBranch}
          dateRange={dateRange}
        />

        {/* Service Utilization Heatmap */}
        <ServiceHeatmap 
          selectedBranch={selectedBranch}
          dateRange={dateRange}
        />
      </div>

      {/* Branch Comparison - Full Width */}
      <div className="mt-6">
        <BranchComparison 
          selectedBranch={selectedBranch}
          dateRange={dateRange}
        />
      </div>

      {/* Advanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Satisfaction Gauge */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Satisfaction</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">Today</span>
          </div>
          <div className="relative h-32 flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
                className="dark:stroke-gray-700"
              />
              {/* Progress circle - now based on 5-star scale */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#satisfactionGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2.51 * ((analyticsData.satisfaction?.score || 4.13) / 5 * 100)} ${2.51 * (100 - ((analyticsData.satisfaction?.score || 4.13) / 5 * 100))}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(analyticsData.satisfaction?.score || 4.13).toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">out of 5</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className={`${(analyticsData.satisfaction?.change || 0.3) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {(analyticsData.satisfaction?.change || 0.3) >= 0 ? '+' : ''}{analyticsData.satisfaction?.change || 0.3} from yesterday
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Based on {analyticsData.satisfaction?.reviewCount || 54} reviews
            </span>
          </div>
          
          {/* Rating Distribution */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Rating Distribution</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const breakdown = analyticsData.satisfaction?.breakdown;
                const totalReviews = analyticsData.satisfaction?.reviewCount || 54;
                
                // Get actual count from backend data or use fallback calculation
                let count;
                if (breakdown) {
                  switch(rating) {
                    case 5: count = breakdown.fiveStars || 0; break;
                    case 4: count = breakdown.fourStars || 0; break;
                    case 3: count = breakdown.threeStars || 0; break;
                    case 2: count = breakdown.twoStars || 0; break;
                    case 1: count = breakdown.oneStar || 0; break;
                    default: count = 0;
                  }
                } else {
                  // Fallback calculation if backend data not available
                  const overallScore = parseFloat(analyticsData.satisfaction?.score || 4.13);
                  let percentage;
                  
                  if (rating === 5) percentage = Math.max(25, (overallScore - 3) * 22.5);
                  else if (rating === 4) percentage = Math.max(20, 45 - Math.abs(overallScore - 4) * 8);
                  else if (rating === 3) percentage = Math.max(5, 25 - (overallScore - 2.5) * 6);
                  else if (rating === 2) percentage = Math.max(2, 8 - overallScore * 1.5);
                  else percentage = Math.max(1, 5 - overallScore * 1.2);
                  
                  percentage = Math.min(percentage, 100);
                  count = Math.round((percentage / 100) * totalReviews);
                }
                
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Service Efficiency Metrics */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Efficiency</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">This Week</span>
          </div>
          <div className="space-y-4">
            {/* Average Wait Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Avg Wait Time</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {analyticsData.efficiency?.waitTime || data?.avgWaitTime || '3.2'} min
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">-15% ↓</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000" 
                   style={{width: `${Math.min(100 - (analyticsData.efficiency?.waitTime || 3.2) * 10, 90)}%`}}></div>
            </div>

            {/* Transaction Speed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Transaction Speed</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {/* round value to near percentage */}
                  {Math.round(analyticsData.efficiency?.transactionSpeed || data?.transactionSpeed || 94)}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">+8% ↑</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                   style={{width: `${analyticsData.efficiency?.transactionSpeed || data?.transactionSpeed || 94}%`}}></div>
            </div>

            {/* Staff Utilization */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Staff Utilization</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.round(analyticsData.efficiency?.staffUtilization || data?.staffUtilization || 87)}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">+2% ↑</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-1000" 
                   style={{width: `${analyticsData.efficiency?.staffUtilization || data?.staffUtilization || 87}%`}}></div>
            </div>
          </div>
        </div>

        {/* Revenue & Performance Trends */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trends</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">Past Week </span>
          </div>
          <div className="space-y-4">
            {/* Mini Revenue Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Revenue</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${((analyticsData.trends?.dailyRevenue || data?.totalRevenue || 1200000) / 100000).toFixed(1)}K
                </span>
              </div>
              <div className="relative">
                              <div className="relative">
                <div className="flex items-end justify-between gap-1 h-24 px-2 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {(analyticsData.trends?.rawRevenueChart || [650000, 780000, 520000, 850000, 910000, 880000, 940000]).slice(0, 7).map((value, index) => {
                    const dayLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
                    const maxValue = Math.max(...(analyticsData.trends?.rawRevenueChart?.slice(0, 7) || [650000, 780000, 520000, 850000, 910000, 880000, 940000]));
                    const height = value > 0 ? Math.max((value / maxValue) * 80, 20) : 8; // Minimum height 20px for text visibility
                    const isSmallValue = value <= 50000; // 0.5L or less
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        {/* Data value on top if small value */}
                        {isSmallValue && (
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ${(value / 100000).toFixed(1)}K
                          </div>
                        )}
                        {/* Bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-md transition-all duration-700 hover:from-green-400 hover:to-green-300 cursor-pointer relative flex items-center justify-center"
                          style={{ height: `${height}px` }}
                        >
                          {/* Data value inside the bar if not small */}
                          {!isSmallValue && (
                            <div className="text-xs font-bold text-white text-center leading-tight">
                              ${(value / 100000).toFixed(1)}K
                            </div>
                          )}
                        </div>
                        {/* Day label */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {dayLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </div>
              <div className="text-xs text-center">
                <span className={`${(analyticsData.trends?.revenueGrowth || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(analyticsData.trends?.revenueGrowth || 0) >= 0 ? '+' : ''}{(analyticsData.trends?.revenueGrowth || data?.revenueGrowth || 12.5).toFixed(1)}% vs last week
                </span>
              </div>
            </div>

            {/* Transaction Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Transactions</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {(analyticsData.trends?.transactionCount || data?.totalTransactions || 2847).toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <div className="flex items-end justify-between gap-1 h-20 px-2 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {(analyticsData.trends?.rawTransactionChart || [45, 68, 72, 65, 78, 85, 82]).slice(0, 7).map((value, index) => {
                    const dayLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
                    const maxValue = Math.max(...(analyticsData.trends?.rawTransactionChart?.slice(0, 7) || [45, 68, 72, 65, 78, 85, 82]));
                    const height = value > 0 ? Math.max((value / maxValue) * 60, 18) : 6; // Minimum height 18px for text visibility
                    const isZeroValue = value === 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        {/* Data value on top if zero value */}
                        {isZeroValue && (
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {value}
                          </div>
                        )}
                        {/* Bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-md transition-all duration-700 hover:from-blue-400 hover:to-blue-300 cursor-pointer relative flex items-center justify-center"
                          style={{ height: `${height}px` }}
                        >
                          {/* Data value inside the bar if not zero */}
                          {!isZeroValue && (
                            <div className="text-xs font-bold text-white text-center leading-tight">
                              {value}
                            </div>
                          )}
                        </div>
                        {/* Day label */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {dayLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-xs text-center">
                <span className={`${(analyticsData.trends?.transactionGrowth || 0) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(analyticsData.trends?.transactionGrowth || 0) >= 0 ? '+' : ''}{(analyticsData.trends?.transactionGrowth || data?.transactionGrowth || 8.3).toFixed(1)}% today
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Peak Hour</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {analyticsData.trends?.peakHour ? 
                    new Date(`2000-01-01 ${analyticsData.trends.peakHour}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }) : 
                    (data?.peakHour || "2:00 PM")
                  }
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Efficiency</div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {analyticsData.trends?.efficiency || data?.overallEfficiency || 92.4}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BranchDashboard