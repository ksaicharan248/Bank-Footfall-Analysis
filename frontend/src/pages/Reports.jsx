import React, { useState, useEffect } from 'react'
import DateRangeFilter from '../components/Reports/DateRangeFilter'
import ReportGenerator from '../components/Reports/ReportGenerator'
import FilterPanel from '../components/Reports/FilterPanel'
import ReportScheduler from '../components/Reports/ReportScheduler'
import BranchSelector from '../components/Dashboard/BranchSelector'
import { FileText, Filter, Calendar, Download, TrendingUp } from 'lucide-react'

/**
 * Reports Page - Advanced filtering and report generation
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const Reports = () => {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [filters, setFilters] = useState({})
  const [activeTab, setActiveTab] = useState('generate')

  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = (resetFilters) => {
    setFilters(resetFilters)
  }

  const tabs = [
    { id: 'generate', label: 'Generate Reports', icon: FileText },
    { id: 'schedule', label: 'Schedule Reports', icon: Calendar },
    { id: 'filters', label: 'Advanced Filters', icon: Filter }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-7 w-7" />
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate comprehensive reports and schedule automated analytics
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <BranchSelector 
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
          />
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Quick Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <Calendar className="h-8 w-8 text-success" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
            <TrendingUp className="h-8 w-8 text-warning" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Filters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.values(filters).filter(v => v && v !== 'all').length}
              </p>
            </div>
            <Filter className="h-8 w-8 text-info" />
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Date Range Selection</h3>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onPresetChange={(preset) => console.log('Preset selected:', preset)}
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'generate' && (
          <ReportGenerator
            selectedBranch={selectedBranch}
            dateRange={`${startDate} to ${endDate}`}
            filters={filters}
          />
        )}
        
        {activeTab === 'schedule' && (
          <ReportScheduler
            onSchedule={(report) => console.log('Report scheduled:', report)}
          />
        )}
        
        {activeTab === 'filters' && (
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>

      {/* Recent Reports */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Weekly Branch Summary', date: '2024-12-16', size: '2.4 MB', format: 'PDF' },
            { name: 'Monthly Performance Report', date: '2024-12-15', size: '1.8 MB', format: 'Excel' },
            { name: 'Footfall Analysis', date: '2024-12-14', size: '856 KB', format: 'CSV' },
            { name: 'Branch Comparison Report', date: '2024-12-13', size: '3.2 MB', format: 'PDF' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.date} • {report.size} • {report.format}
                  </p>
                </div>
              </div>
              <button className="btn-secondary text-sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports