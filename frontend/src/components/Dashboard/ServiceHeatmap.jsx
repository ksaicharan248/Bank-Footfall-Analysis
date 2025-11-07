import React, { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'
import { getIntensityColor, getIntensityOpacity } from '../../utils/chartUtils'
import { analyticsService } from '../../services/api'
import { getBranchId } from '../../utils/branchUtils'

const ServiceHeatmap = ({ selectedBranch, dateRange }) => {
  const [selectedService, setSelectedService] = useState('all')
  const [heatmapData, setHeatmapData] = useState({})
  const [hours, setHours] = useState(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'])
  const [services, setServices] = useState(['Teller', 'Loans', 'Investment', 'Customer Service'])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServiceUtilization = async () => {
      try {
        setIsLoading(true)
        
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
        
        const response = await analyticsService.getServiceUtilization(branchId, startDate, endDate)
        
        // Transform the API response into the format expected by the component
        const transformedData = {}
        if (response.data.serviceData && response.data.hourData) {
          response.data.serviceData.forEach(serviceRow => {
            const serviceName = serviceRow[0]
            const utilizationValues = serviceRow.slice(1).map(value => parseInt(value))
            transformedData[serviceName] = utilizationValues
          })
          setHours(response.data.hourData)
          setServices(Object.keys(transformedData))
        }
        
        setHeatmapData(transformedData)
        
        
        
        // Reset selectedService if it doesn't exist in the new data
        if (selectedService !== 'all' && !transformedData[selectedService]) {
          setSelectedService('all')
        }
      } catch (error) {
        console.error('Error fetching service utilization data:', error)
        // Fallback to mock data if API fails
        setHeatmapData({
          'Teller': [45, 65, 85, 95, 70, 80, 60, 40],
          'Loans': [20, 35, 50, 60, 45, 55, 40, 25],
          'Investment': [15, 25, 40, 35, 30, 45, 35, 20],
          'Customer Service': [25, 40, 55, 70, 50, 60, 45, 30]
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchServiceUtilization()
  }, [selectedBranch, dateRange])

  const handleCellClick = (service, hour, value) => {
     // Placeholder for future interactivity (e.g., show detailed modal)
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Service Utilization Heatmap
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Service demand intensity by hour (Real-time data)
          </p>
        </div>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
        >
          <option value="all">All Services</option>
          {services.map(service => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading service utilization data...</div>
        </div>
      ) : Object.keys(heatmapData).length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">No service utilization data available</div>
        </div>
      ) : (
        <>
          {selectedService === 'all' ? (
            <div className="space-y-4">
              {services.map(service => (
                heatmapData[service] && (
                  <div key={service} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{service}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Peak: {Math.max(...heatmapData[service])}%
                      </span>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {heatmapData[service].map((value, index) => (
                        <div
                          key={index}
                          className={`relative h-8 rounded ${getIntensityColor(value)} flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform`}
                          style={{ opacity: getIntensityOpacity(value) }}
                          title={`${hours[index]}: ${value}% utilization`}
                          onClick={() => handleCellClick(service, hours[index], value)}
                        >
                          {value}%
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            heatmapData[selectedService] && (
              <div className="space-y-4">
                <div className="grid grid-cols-8 gap-2">
                  {hours.map((hour, index) => (
                    <div key={hour} className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{hour}</div>
                      <div
                        className={`h-16 rounded-lg ${getIntensityColor(heatmapData[selectedService][index])} flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform`}
                        style={{ opacity: getIntensityOpacity(heatmapData[selectedService][index]) }}
                        onClick={() => handleCellClick(selectedService, hour, heatmapData[selectedService][index])}
                      >
                        {heatmapData[selectedService][index]}%
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Service Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.max(...heatmapData[selectedService])}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Peak Utilization</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.round(heatmapData[selectedService].reduce((a, b) => a + b, 0) / heatmapData[selectedService].length)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {hours[heatmapData[selectedService].indexOf(Math.max(...heatmapData[selectedService]))]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Peak Hour</div>
                  </div>
                </div>
              </div>
            )
          )}
        </>
      )}
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Utilization:</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded opacity-60"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded opacity-60"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded opacity-80"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded opacity-90"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Critical</span>
        </div>
      </div>
    </div>
  )
}

export default ServiceHeatmap