import React, { useState } from 'react'
import { Calendar, Mail, Clock, Plus, Trash2, CheckCircle } from 'lucide-react'

/**
 * Report Scheduler Component - Automated report scheduling
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const ReportScheduler = ({ onSchedule }) => {
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Weekly Branch Summary', frequency: 'weekly', recipients: 'manager@abcbank.com', active: true },
    { id: 2, name: 'Monthly Performance Report', frequency: 'monthly', recipients: 'director@abcbank.com', active: true }
  ])
  
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'weekly',
    recipients: '',
    format: 'pdf',
    includeCharts: true
  })

  const handleAddSchedule = () => {
    if (newSchedule.name && newSchedule.recipients) {
      const schedule = {
        id: Date.now(),
        ...newSchedule,
        active: true
      }
      setSchedules([...schedules, schedule])
      onSchedule?.(schedule)
      setNewSchedule({
        name: '',
        frequency: 'weekly',
        recipients: '',
        format: 'pdf',
        includeCharts: true
      })
    }
  }

  const toggleSchedule = (id) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ))
  }

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Add New Schedule */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Schedule New Report
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Name
            </label>
            <input
              type="text"
              value={newSchedule.name}
              onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
              placeholder="e.g., Weekly Branch Analytics"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Frequency
            </label>
            <select
              value={newSchedule.frequency}
              onChange={(e) => setNewSchedule({...newSchedule, frequency: e.target.value})}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Recipients
            </label>
            <input
              type="text"
              value={newSchedule.recipients}
              onChange={(e) => setNewSchedule({...newSchedule, recipients: e.target.value})}
              placeholder="email1@abcbank.com, email2@abcbank.com"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select
              value={newSchedule.format}
              onChange={(e) => setNewSchedule({...newSchedule, format: e.target.value})}
              className="input-field"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="checkbox"
            id="includeCharts"
            checked={newSchedule.includeCharts}
            onChange={(e) => setNewSchedule({...newSchedule, includeCharts: e.target.checked})}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="includeCharts" className="text-sm text-gray-700 dark:text-gray-300">
            Include charts and visualizations
          </label>
        </div>
        
        <button
          onClick={handleAddSchedule}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Schedule Report
        </button>
      </div>

      {/* Existing Schedules */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Scheduled Reports ({schedules.length})
        </h3>
        
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${schedule.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{schedule.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {schedule.frequency} • {schedule.recipients}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSchedule(schedule.id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    schedule.active 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {schedule.active ? 'Active' : 'Paused'}
                </button>
                
                <button
                  onClick={() => deleteSchedule(schedule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReportScheduler