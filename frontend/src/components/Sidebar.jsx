import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, FileText, Settings, Building2, Activity, X, LogOut, User } from 'lucide-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: location.pathname === '/dashboard' || location.pathname === '/' },
    { name: 'Reports', href: '/reports', icon: FileText, current: location.pathname === '/reports' },
    ...(user?.role === 'admin' || user?.role === 'manager' ? [
      { name: 'Admin', href: '/admin', icon: Settings, current: location.pathname === '/admin' }
    ] : [])
  ]

  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">ABC Bank Analytics</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Branch Operations</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-item ${item.current ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* <div className="mt-8 px-3">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Live Stats</h3>
            <Activity className="h-4 w-4 text-green-500 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Active Branches</span>
              <span className="text-sm font-semibold text-primary-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Today's Footfall</span>
              <span className="text-sm font-semibold text-success">127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Avg. Satisfaction</span>
              <span className="text-sm font-semibold text-warning">4.2/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">System Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || 'Role'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Powered by <span className="font-semibold text-primary-600">Cognizant</span></p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar