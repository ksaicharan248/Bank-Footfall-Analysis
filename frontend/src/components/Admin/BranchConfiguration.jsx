import React, { useState, useEffect } from 'react'
import { Settings, Building2, Save, RefreshCw, MapPin, Phone, Mail, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react'

/**
 * Branch Configuration Panel Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const BranchConfiguration = () => {
  const [selectedBranch, setSelectedBranch] = useState('siruseri')
  const [branchData, setBranchData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  const branches = [
    { id: 'siruseri', name: 'New York Branch', code: 'ABC001' },
    { id: 'tnagar', name: 'Washington DC Branch', code: 'ABC002' },
    { id: 'navalur', name: 'New Jersey Branch', code: 'ABC003' }
  ]

  useEffect(() => {
    fetchBranchData()
  }, [selectedBranch])

  const fetchBranchData = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockData = {
      siruseri: {
        id: 'siruseri',
        name: 'New York Branch',
        code: 'ABC001',
        address: {
          street: '123 IT Highway',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '603103',
          country: 'India'
        },
        contact: {
          phone: '+91 44 2345 6789',
          email: 'siruseri@abcbank.com',
          manager: 'Rajesh Kumar',
          managerPhone: '+91 98765 43210'
        },
        operations: {
          openTime: '09:00',
          closeTime: '18:00',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          maxCapacity: 50,
          currentStaff: 5,
          services: ['teller', 'loans', 'investment', 'customer_service']
        },
        settings: {
          autoAlerts: true,
          emailNotifications: true,
          smsNotifications: false,
          reportFrequency: 'daily',
          dataRetention: 365
        }
      },
      tnagar: {
        id: 'tnagar',
        name: 'Washington DC Branch',
        code: 'ABC002',
        address: {
          street: '456 Pondy Bazaar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600017',
          country: 'India'
        },
        contact: {
          phone: '+91 44 2876 5432',
          email: 'tnagar@abcbank.com',
          manager: 'Sunita Reddy',
          managerPhone: '+91 98765 43211'
        },
        operations: {
          openTime: '09:00',
          closeTime: '19:00',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          maxCapacity: 75,
          currentStaff: 7,
          services: ['teller', 'loans', 'investment', 'customer_service', 'forex']
        },
        settings: {
          autoAlerts: true,
          emailNotifications: true,
          smsNotifications: true,
          reportFrequency: 'daily',
          dataRetention: 730
        }
      },
      navalur: {
        id: 'navalur',
        name: 'New Jersey Branch',
        code: 'ABC003',
        address: {
          street: '789 OMR Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600130',
          country: 'India'
        },
        contact: {
          phone: '+91 44 2987 6543',
          email: 'navalur@abcbank.com',
          manager: 'Arun Patel',
          managerPhone: '+91 98765 43212'
        },
        operations: {
          openTime: '09:30',
          closeTime: '17:30',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          maxCapacity: 40,
          currentStaff: 4,
          services: ['teller', 'loans', 'customer_service']
        },
        settings: {
          autoAlerts: false,
          emailNotifications: true,
          smsNotifications: false,
          reportFrequency: 'weekly',
          dataRetention: 365
        }
      }
    }
    
    setBranchData(mockData[selectedBranch])
    setIsLoading(false)
  }

  const handleInputChange = (section, field, value) => {
    setBranchData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayChange = (section, field, value, checked) => {
    setBranchData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked 
          ? [...prev[section][field], value]
          : prev[section][field].filter(item => item !== value)
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const serviceOptions = [
    { id: 'teller', name: 'Teller Services' },
    { id: 'loans', name: 'Loan Services' },
    { id: 'investment', name: 'Investment Services' },
    { id: 'customer_service', name: 'Customer Service' },
    { id: 'forex', name: 'Foreign Exchange' },
    { id: 'insurance', name: 'Insurance Services' }
  ]

  const workingDayOptions = [
    { id: 'monday', name: 'Monday' },
    { id: 'tuesday', name: 'Tuesday' },
    { id: 'wednesday', name: 'Wednesday' },
    { id: 'thursday', name: 'Thursday' },
    { id: 'friday', name: 'Friday' },
    { id: 'saturday', name: 'Saturday' },
    { id: 'sunday', name: 'Sunday' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 mx-auto"></div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Loading Configuration...</p>
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
            <Settings className="h-7 w-7" />
            Branch Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure branch settings, operations, and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => {
              alert(`Refreshing configuration data for ${branches.find(b => b.id === selectedBranch)?.name}`)
              fetchBranchData()
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => {
              alert(`Saving configuration for ${branchData.name}...`)
              handleSave()
            }}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <Building2 className="h-5 w-5 text-gray-400" />
          <select
            value={selectedBranch}
            onChange={(e) => {
              const branchName = branches.find(b => b.id === e.target.value)?.name
              alert(`Loading configuration for ${branchName}`)
              setSelectedBranch(e.target.value)
            }}
            className="input-field max-w-xs"
          >
            {branches.map(branch => (
              <option 
                key={branch.id} 
                value={branch.id}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`card p-4 ${
          saveStatus === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            {saveStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <p className={`text-sm font-medium ${
              saveStatus === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {saveStatus === 'success' 
                ? 'Configuration saved successfully!' 
                : 'Failed to save configuration. Please try again.'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Branch Name
              </label>
              <input
                type="text"
                value={branchData.name || ''}
                onChange={(e) => handleInputChange('', 'name', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Branch Code
              </label>
              <input
                type="text"
                value={branchData.code || ''}
                onChange={(e) => handleInputChange('', 'code', e.target.value)}
                className="input-field"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={branchData.address?.street || ''}
                onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={branchData.address?.city || ''}
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={branchData.address?.pincode || ''}
                  onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={branchData.contact?.phone || ''}
                onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={branchData.contact?.email || ''}
                onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Branch Manager
              </label>
              <input
                type="text"
                value={branchData.contact?.manager || ''}
                onChange={(e) => handleInputChange('contact', 'manager', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operations
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={branchData.operations?.openTime || ''}
                  onChange={(e) => handleInputChange('operations', 'openTime', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={branchData.operations?.closeTime || ''}
                  onChange={(e) => handleInputChange('operations', 'closeTime', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Capacity
                </label>
                <input
                  type="number"
                  value={branchData.operations?.maxCapacity || ''}
                  onChange={(e) => handleInputChange('operations', 'maxCapacity', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Staff
                </label>
                <input
                  type="number"
                  value={branchData.operations?.currentStaff || ''}
                  onChange={(e) => handleInputChange('operations', 'currentStaff', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Working Days */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Working Days
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {workingDayOptions.map((day) => (
            <label key={day.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={branchData.operations?.workingDays?.includes(day.id) || false}
                onChange={(e) => handleArrayChange('operations', 'workingDays', day.id, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{day.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Services
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceOptions.map((service) => (
            <label key={service.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={branchData.operations?.services?.includes(service.id) || false}
                onChange={(e) => handleArrayChange('operations', 'services', service.id, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{service.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={branchData.settings?.autoAlerts || false}
                onChange={(e) => handleInputChange('settings', 'autoAlerts', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto Alerts</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={branchData.settings?.emailNotifications || false}
                onChange={(e) => handleInputChange('settings', 'emailNotifications', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={branchData.settings?.smsNotifications || false}
                onChange={(e) => handleInputChange('settings', 'smsNotifications', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Frequency
              </label>
              <select
                value={branchData.settings?.reportFrequency || 'daily'}
                onChange={(e) => handleInputChange('settings', 'reportFrequency', e.target.value)}
                className="input-field"
              >
                <option value="daily" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  Daily
                </option>
                <option value="weekly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  Weekly
                </option>
                <option value="monthly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  Monthly
                </option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Retention (days)
              </label>
              <input
                type="number"
                value={branchData.settings?.dataRetention || 365}
                onChange={(e) => handleInputChange('settings', 'dataRetention', parseInt(e.target.value))}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BranchConfiguration