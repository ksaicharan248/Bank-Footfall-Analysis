/**
 * Chart Utility Functions
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const formatTime = (timeStr) => {
  return timeStr.replace(':00', '')
}

export const getChartColors = () => ({
  siruseri: '#3b82f6',
  tnagar: '#10b981', 
  navalur: '#f59e0b',
  total: '#8b5cf6',
  predicted: '#ef4444'
})

export const getStatusColor = (status) => {
  switch (status) {
    case 'high': return '#ef4444'
    case 'medium': return '#f59e0b'
    case 'low': return '#10b981'
    default: return '#3b82f6'
  }
}

export const getIntensityColor = (value) => {
  if (value >= 80) return 'bg-red-500'
  if (value >= 60) return 'bg-orange-500'
  if (value >= 40) return 'bg-yellow-500'
  if (value >= 20) return 'bg-green-500'
  return 'bg-blue-500'
}

export const getIntensityOpacity = (value) => {
  return Math.max(0.2, value / 100)
}

export const downloadChart = (chartRef, filename = 'chart') => {
  if (chartRef.current) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // Implementation for chart download
    console.log(`Downloading ${filename}...`)
  }
}

export const customTooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}