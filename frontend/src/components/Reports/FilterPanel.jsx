import React, { useState } from 'react'
import { Filter, X, RotateCcw, Search, ChevronDown } from 'lucide-react'

/**
 * Advanced Filter Panel Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const FilterPanel = ({ filters, onFilterChange, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilters, setActiveFilters] = useState(filters || {})

  const filterOptions = {
    serviceType: [
      { value: 'all', label: 'All Services' },
      { value: 'teller', label: 'Teller Services' },
      { value: 'loans', label: 'Loan Services' },
      { value: 'investment', label: 'Investment Services' },
      { value: 'customer_service', label: 'Customer Service' }
    ],
    customerType: [
      { value: 'all', label: 'All Customers' },
      { value: 'premium', label: 'Premium Customers' },
      { value: 'regular', label: 'Regular Customers' },
      { value: 'new', label: 'New Customers' }
    ],
    transactionAmount: [
      { value: 'all', label: 'All Amounts' },
      { value: 'low', label: 'Under ₹10,000' },
      { value: 'medium', label: '₹10,000 - ₹1,00,000' },
      { value: 'high', label: 'Above ₹1,00,000' }
    ],
    timeOfDay: [
      { value: 'all', label: 'All Hours' },
      { value: 'morning', label: 'Morning (9AM-12PM)' },
      { value: 'afternoon', label: 'Afternoon (12PM-4PM)' },
      { value: 'evening', label: 'Evening (4PM-6PM)' }
    ],
    staffMember: [
      { value: 'all', label: 'All Staff' },
      { value: 'senior', label: 'Senior Staff' },
      { value: 'junior', label: 'Junior Staff' },
      { value: 'trainee', label: 'Trainee Staff' }
    ]
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value }
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleResetFilters = () => {
    const resetFilters = Object.keys(filterOptions).reduce((acc, key) => {
      acc[key] = 'all'
      return acc
    }, {})
    setActiveFilters(resetFilters)
    onResetFilters(resetFilters)
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value && value !== 'all').length
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Advanced Filters
          </h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <select
          value={activeFilters.serviceType || 'all'}
          onChange={(e) => handleFilterChange('serviceType', e.target.value)}
          className="input-field text-sm"
        >
          {filterOptions.serviceType.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={activeFilters.customerType || 'all'}
          onChange={(e) => handleFilterChange('customerType', e.target.value)}
          className="input-field text-sm"
        >
          {filterOptions.customerType.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={activeFilters.timeOfDay || 'all'}
          onChange={(e) => handleFilterChange('timeOfDay', e.target.value)}
          className="input-field text-sm"
        >
          {filterOptions.timeOfDay.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="input-field text-sm pl-10"
            value={activeFilters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Amount Range
              </label>
              <select
                value={activeFilters.transactionAmount || 'all'}
                onChange={(e) => handleFilterChange('transactionAmount', e.target.value)}
                className="input-field"
              >
                {filterOptions.transactionAmount.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Staff Member
              </label>
              <select
                value={activeFilters.staffMember || 'all'}
                onChange={(e) => handleFilterChange('staffMember', e.target.value)}
                className="input-field"
              >
                {filterOptions.staffMember.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Range Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Wait Time (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                placeholder="0"
                className="input-field"
                value={activeFilters.minWaitTime || ''}
                onChange={(e) => handleFilterChange('minWaitTime', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Wait Time (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                placeholder="60"
                className="input-field"
                value={activeFilters.maxWaitTime || ''}
                onChange={(e) => handleFilterChange('maxWaitTime', e.target.value)}
              />
            </div>
          </div>

          {/* Satisfaction Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Customer Satisfaction Rating
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                className="flex-1"
                value={activeFilters.minRating || 1}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                {activeFilters.minRating || 1}/5
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value || value === 'all') return null
              
              const filterLabel = filterOptions[key]?.find(opt => opt.value === value)?.label || value
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                >
                  {filterLabel}
                  <button
                    onClick={() => handleFilterChange(key, 'all')}
                    className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel