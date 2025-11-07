import { useState, useEffect } from 'react'

/**
 * Custom hook for report filters state management
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
export const useReportFilters = () => {
  const [filters, setFilters] = useState({
    serviceType: 'all',
    customerType: 'all',
    transactionAmount: 'all',
    timeOfDay: 'all',
    staffMember: 'all',
    searchTerm: '',
    minWaitTime: '',
    maxWaitTime: '',
    minRating: 1
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      serviceType: 'all',
      customerType: 'all',
      transactionAmount: 'all',
      timeOfDay: 'all',
      staffMember: 'all',
      searchTerm: '',
      minWaitTime: '',
      maxWaitTime: '',
      minRating: 1
    })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value && value !== 'all' && value !== '' && value !== 1
    ).length
  }

  // Persist filters to localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('reportFilters')
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('reportFilters', JSON.stringify(filters))
  }, [filters])

  return {
    filters,
    updateFilter,
    resetFilters,
    getActiveFilterCount
  }
}