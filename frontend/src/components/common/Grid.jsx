import React from 'react'

/**
 * Responsive Grid System Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const Grid = ({ children, cols = 1, gap = 6, className = '' }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }

  return (
    <div className={`grid ${gridClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}

export const GridItem = ({ children, span = 1, className = '' }) => {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 lg:col-span-2',
    3: 'col-span-1 lg:col-span-3',
    'full': 'col-span-full'
  }

  return (
    <div className={`${spanClasses[span]} ${className}`}>
      {children}
    </div>
  )
}

export default Grid