import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Admin from './pages/Admin'
import Login from './pages/Login'
import RoleBasedRoute from './components/Auth/RoleBasedRoute'
import ChatBot from './components/ChatBot'

/**
 * Main App Component - ABC Bank Branch Operations Analytics Dashboard
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
function App() {
  const isAuthenticated = () => {
    const user = localStorage.getItem('user')
    return user && JSON.parse(user).username
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/*" element={
            isAuthenticated() ? (
              <>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/admin" element={
                      <RoleBasedRoute allowedRoles={['admin', 'manager']}>
                        <Admin />
                      </RoleBasedRoute>
                    } />
                  </Routes>
                </Layout>
                <ChatBot />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App