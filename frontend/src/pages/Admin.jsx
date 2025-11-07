import React, { useState } from 'react'
import { Users, Calendar, Settings, Shield, UserCheck, Building2 } from 'lucide-react'
import UserManagement from '../components/Admin/UserManagement'
import StaffSchedule from '../components/Admin/StaffSchedule'
import BranchConfiguration from '../components/Admin/BranchConfiguration'

/**
 * Admin Page - Main administration interface
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const Admin = () => {
  const [activeTab, setActiveTab] = useState('users')

  const tabs = [
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users,
      description: 'Manage user accounts and permissions'
    },
    { 
      id: 'schedule', 
      label: 'Staff Schedule', 
      icon: Calendar,
      description: 'Manage staff schedules and shifts'
    },
    { 
      id: 'configuration', 
      label: 'Branch Config', 
      icon: Settings,
      description: 'Configure branch settings and operations'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />
      case 'schedule':
        return <StaffSchedule />
      case 'configuration':
        return <BranchConfiguration />
      default:
        return <UserManagement />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-7 w-7" />
            Administration Panel
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage users, schedules, and branch configurations
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <UserCheck className="h-4 w-4" />
            <span>Admin Access</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <Users className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Staff</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Branches</p>
              <p className="text-2xl font-bold text-blue-600">3</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
              <p className="text-2xl font-bold text-green-600">98%</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
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
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                    {tab.description}
                  </div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default Admin