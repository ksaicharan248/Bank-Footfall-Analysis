import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Plus, Edit, Trash2, Filter, Download } from 'lucide-react'

/**
 * Staff Schedule Management Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const StaffSchedule = () => {
  const [schedules, setSchedules] = useState([])
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek())
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

    const branches = [
    { id: 'all', name: 'All Branches' },
    { id: 'siruseri', name: 'New York', code: 'ABC001' },
    { id: 'tnagar', name: 'Washington DC', code: 'ABC002' },
    { id: 'navalur', name: 'New Jersey', code: 'ABC003' }
  ]

  const shifts = [
    { id: 'morning', name: 'Morning Shift', time: '09:00 - 13:00', color: 'bg-blue-100 text-blue-800' },
    { id: 'afternoon', name: 'Afternoon Shift', time: '13:00 - 17:00', color: 'bg-green-100 text-green-800' },
    { id: 'evening', name: 'Evening Shift', time: '17:00 - 21:00', color: 'bg-orange-100 text-orange-800' },
    { id: 'full', name: 'Full Day', time: '09:00 - 18:00', color: 'bg-purple-100 text-purple-800' }
  ]

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  function getCurrentWeek() {
    const today = new Date()
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    return monday.toISOString().split('T')[0]
  }

  useEffect(() => {
    fetchSchedules()
  }, [selectedWeek, selectedBranch])

  const fetchSchedules = async () => {
    setIsLoading(true)
    try {
      // Try to fetch from API first
      const response = await fetch('http://localhost:8080/api/staff')
      const staffData = await response.json()
      
      // Convert staff data to schedule format
      const scheduleData = staffData.map((staff, index) => ({
        id: staff.staffId || index + 1,
        staffId: staff.employeeCode || `EMP${String(index + 1).padStart(3, '0')}`,
        staffName: staff.fullName || 'Unknown Staff',
        branch: staff.branchCode === 'ABC001' ? 'siruseri' : 
                staff.branchCode === 'ABC002' ? 'tnagar' : 
                staff.branchCode === 'ABC003' ? 'navalur' : 'siruseri',
        role: staff.role || 'Staff Member',
        schedule: {
          monday: { shift: 'full', status: 'scheduled' },
          tuesday: { shift: 'full', status: 'scheduled' },
          wednesday: { shift: 'morning', status: 'scheduled' },
          thursday: { shift: 'full', status: 'scheduled' },
          friday: { shift: 'full', status: 'scheduled' },
          saturday: { shift: 'morning', status: 'scheduled' }
        }
      }))
      
      setSchedules(scheduleData)
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Fallback to mock data
      const mockSchedules = [
        {
          id: 1,
          staffId: 'EMP001',
          staffName: 'Rajesh Kumar',
          branch: 'siruseri',
          role: 'Manager',
          schedule: {
            monday: { shift: 'full', status: 'scheduled' },
            tuesday: { shift: 'full', status: 'scheduled' },
            wednesday: { shift: 'morning', status: 'scheduled' },
            thursday: { shift: 'full', status: 'scheduled' },
            friday: { shift: 'full', status: 'scheduled' },
            saturday: { shift: 'morning', status: 'scheduled' }
          }
        },
        {
          id: 2,
          staffId: 'EMP002',
          staffName: 'Priya Sharma',
          branch: 'tnagar',
          role: 'Analyst',
          schedule: {
            monday: { shift: 'morning', status: 'scheduled' },
            tuesday: { shift: 'afternoon', status: 'scheduled' },
            wednesday: { shift: 'morning', status: 'scheduled' },
            thursday: { shift: 'afternoon', status: 'scheduled' },
            friday: { shift: 'morning', status: 'scheduled' },
            saturday: { shift: null, status: 'off' }
          }
        },
        {
          id: 3,
          staffId: 'EMP003',
          staffName: 'Arun Patel',
          branch: 'navalur',
          role: 'Teller',
          schedule: {
            monday: { shift: 'afternoon', status: 'scheduled' },
            tuesday: { shift: 'evening', status: 'scheduled' },
            wednesday: { shift: 'afternoon', status: 'scheduled' },
            thursday: { shift: 'evening', status: 'scheduled' },
            friday: { shift: 'afternoon', status: 'scheduled' },
            saturday: { shift: 'morning', status: 'scheduled' }
          }
        },
        {
          id: 4,
          staffId: 'EMP004',
          staffName: 'Sunita Reddy',
          branch: 'tnagar',
          role: 'Manager',
          schedule: {
            monday: { shift: 'full', status: 'scheduled' },
            tuesday: { shift: 'full', status: 'scheduled' },
            wednesday: { shift: null, status: 'leave' },
            thursday: { shift: 'full', status: 'scheduled' },
            friday: { shift: 'full', status: 'scheduled' },
            saturday: { shift: 'morning', status: 'scheduled' }
          }
        }
      ]
      setSchedules(mockSchedules)
    }
    setIsLoading(false)
  }

  const getShiftInfo = (shiftId) => {
    return shifts.find(s => s.id === shiftId) || null
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800'
      case 'leave': return 'bg-yellow-100 text-yellow-800'
      case 'off': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId)
    return branch ? branch.name : branchId
  }

  const handleEditSchedule = (staff) => {
    setEditingSchedule({
      ...staff,
      schedule: { ...staff.schedule }
    })
    setShowEditModal(true)
  }

  const handleSaveSchedule = () => {
    if (!editingSchedule) return
    
    setSchedules(schedules.map(s => 
      s.id === editingSchedule.id ? editingSchedule : s
    ))
    setShowEditModal(false)
    setEditingSchedule(null)
    alert('Schedule updated successfully!')
  }

  const handleScheduleChange = (day, field, value) => {
    if (!editingSchedule) return
    
    setEditingSchedule({
      ...editingSchedule,
      schedule: {
        ...editingSchedule.schedule,
        [day]: {
          ...editingSchedule.schedule[day],
          [field]: value
        }
      }
    })
  }

  const filteredSchedules = selectedBranch === 'all' 
    ? schedules 
    : schedules.filter(s => s.branch === selectedBranch)

  const getWeekDates = (weekStart) => {
    const dates = []
    const start = new Date(weekStart)
    for (let i = 0; i < 6; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    return dates
  }

  const weekDates = getWeekDates(selectedWeek)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 mx-auto"></div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Loading Schedules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-7 w-7" />
            Staff Schedule Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage staff schedules and shift assignments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button 
            onClick={() => {
              console.log('Export schedule clicked')
              alert('Exporting schedule data to CSV/Excel format')
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => {
              console.log('Add Schedule clicked')
              alert('Add Schedule functionality - Opens schedule creation form')
              setShowAddModal(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{schedules.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Schedule</p>
              <p className="text-2xl font-bold text-green-600">
                {schedules.filter(s => Object.values(s.schedule).some(day => day.status === 'scheduled')).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">
                {schedules.filter(s => Object.values(s.schedule).some(day => day.status === 'leave')).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coverage</p>
              <p className="text-2xl font-bold text-blue-600">87%</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Week Starting
            </label>
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="input-field"
            >
              {branches.map(branch => (
                <option 
                  key={branch.id} 
                  value={branch.id}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Staff Member
                </th>
                {weekDays.map((day, index) => (
                  <th key={day} className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div>{day}</div>
                    <div className="text-xs text-gray-400">{weekDates[index]}</div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSchedules.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          {staff.staffName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {staff.staffName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {staff.role} • {getBranchName(staff.branch)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {weekDays.map((day) => {
                    const dayKey = day.toLowerCase()
                    const daySchedule = staff.schedule[dayKey]
                    const shiftInfo = daySchedule?.shift ? getShiftInfo(daySchedule.shift) : null
                    
                    return (
                      <td key={day} className="px-3 py-4 text-center">
                        {daySchedule?.status === 'off' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Off
                          </span>
                        ) : daySchedule?.status === 'leave' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Leave
                          </span>
                        ) : shiftInfo ? (
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${shiftInfo.color}`}>
                              {shiftInfo.name}
                            </span>
                            <div className="text-xs text-gray-500">{shiftInfo.time}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    )
                  })}
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditSchedule(staff)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="Edit Schedule"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          console.log('Delete schedule for:', staff.staffName)
                          if (window.confirm(`Are you sure you want to delete the schedule for ${staff.staffName}?`)) {
                            alert(`Schedule for ${staff.staffName} deleted successfully`)
                            setSchedules(schedules.filter(s => s.id !== staff.id))
                          }
                        }}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Schedule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shift Legend */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shift Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${shift.color}`}>
                {shift.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{shift.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Schedule Modal */}
      {showEditModal && editingSchedule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Schedule - {editingSchedule.staffName}
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingSchedule(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="py-6">
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Staff ID:</span> {editingSchedule.staffId}
                    </div>
                    <div>
                      <span className="font-medium">Role:</span> {editingSchedule.role}
                    </div>
                    <div>
                      <span className="font-medium">Branch:</span> {getBranchName(editingSchedule.branch)}
                    </div>
                    <div>
                      <span className="font-medium">Week:</span> {selectedWeek}
                    </div>
                  </div>
                </div>

                {/* Schedule Grid */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Day</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Shift</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                      {weekDays.map((day) => {
                        const dayKey = day.toLowerCase()
                        const daySchedule = editingSchedule.schedule[dayKey]
                        const shiftInfo = daySchedule?.shift ? getShiftInfo(daySchedule.shift) : null
                        
                        return (
                          <tr key={day}>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                              {day}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={daySchedule?.status || 'scheduled'}
                                onChange={(e) => handleScheduleChange(dayKey, 'status', e.target.value)}
                                className="input-field w-full"
                              >
                                <option value="scheduled">Scheduled</option>
                                <option value="off">Off</option>
                                <option value="leave">Leave</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={daySchedule?.shift || ''}
                                onChange={(e) => handleScheduleChange(dayKey, 'shift', e.target.value || null)}
                                disabled={daySchedule?.status !== 'scheduled'}
                                className="input-field w-full disabled:bg-gray-100 dark:disabled:bg-gray-700"
                              >
                                <option value="">No Shift</option>
                                {shifts.map(shift => (
                                  <option key={shift.id} value={shift.id}>
                                    {shift.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {shiftInfo && daySchedule?.status === 'scheduled' ? shiftInfo.time : '-'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-600 space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingSchedule(null)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffSchedule