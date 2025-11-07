import React, { useState } from 'react'
import { FileText, Download, Mail, Calendar, Settings, CheckCircle } from 'lucide-react'

/**
 * Professional Report Generator with Export Options
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const ReportGenerator = ({ selectedBranch, dateRange, filters }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [scheduleReport, setScheduleReport] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState('')
  const [reportFrequency, setReportFrequency] = useState('weekly')

  const handleExport = async (format) => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reportData = {
        branch: selectedBranch,
        dateRange,
        filters,
        format,
        includeCharts,
        timestamp: new Date().toISOString()
      }
      
      if (format === 'pdf') {
        // Generate PDF report
        console.log('Generating PDF report:', reportData)
        downloadFile('ABC_Branch_Analytics_Report.pdf', 'application/pdf')
      } else if (format === 'csv') {
        // Generate CSV report
        console.log('Generating CSV report:', reportData)
        downloadFile('ABC_Branch_Analytics_Data.csv', 'text/csv')
      } else if (format === 'excel') {
        // Generate Excel report
        console.log('Generating Excel report:', reportData)
        downloadFile('ABC_Branch_Analytics_Report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      }
      
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const downloadFile = (filename, mimeType) => {
    // Simulate file download
    const link = document.createElement('a')
    link.href = '#'
    link.download = filename
    link.click()
  }

  const handleScheduleReport = () => {
    const scheduleData = {
      frequency: reportFrequency,
      recipients: emailRecipients.split(',').map(email => email.trim()),
      format: exportFormat,
      includeCharts,
      filters: { selectedBranch, dateRange, ...filters }
    }
    
    console.log('Scheduling report:', scheduleData)
    // API call to schedule report
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Generator
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Export analytics data and schedule automated reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Advanced Options</span>
        </div>
      </div>

      {/* Export Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Export Format
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'pdf', label: 'PDF Report', icon: FileText, desc: 'Formatted document' },
            { value: 'csv', label: 'CSV Data', icon: Download, desc: 'Raw data export' },
            { value: 'excel', label: 'Excel Report', icon: FileText, desc: 'Spreadsheet format' }
          ].map((format) => {
            const Icon = format.icon
            return (
              <button
                key={format.value}
                onClick={() => setExportFormat(format.value)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  exportFormat === format.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mb-2 text-primary-600" />
                <div className="font-medium text-sm text-gray-900 dark:text-white">{format.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{format.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="includeCharts"
            checked={includeCharts}
            onChange={(e) => setIncludeCharts(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="includeCharts" className="text-sm text-gray-700 dark:text-gray-300">
            Include charts and visualizations
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="scheduleReport"
            checked={scheduleReport}
            onChange={(e) => setScheduleReport(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="scheduleReport" className="text-sm text-gray-700 dark:text-gray-300">
            Schedule automated reports
          </label>
        </div>
      </div>

      {/* Scheduling Options */}
      {scheduleReport && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Recipients
            </label>
            <input
              type="text"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              placeholder="manager@abcbank.com, analyst@abcbank.com"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple emails with commas
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Frequency
            </label>
            <select
              value={reportFrequency}
              onChange={(e) => setReportFrequency(e.target.value)}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleExport(exportFormat)}
          disabled={isExporting}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export {exportFormat.toUpperCase()}
            </>
          )}
        </button>
        
        {scheduleReport && (
          <button
            onClick={handleScheduleReport}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Schedule Report
          </button>
        )}
      </div>

      {/* Export Summary */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">Report Summary</p>
          <p>Branch: {selectedBranch === 'all' ? 'All Branches' : selectedBranch}</p>
          <p>Date Range: {dateRange}</p>
          <p>Format: {exportFormat.toUpperCase()}</p>
          {includeCharts && <p>Including: Charts and visualizations</p>}
        </div>
      </div>
    </div>
  )
}

export default ReportGenerator