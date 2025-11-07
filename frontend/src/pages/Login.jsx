import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'

/**
 * Login Page Component
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (formData) => {
    setIsLoading(true)
    
    try {
      // Simulate authentication API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock authentication logic
      const validCredentials = [
        { username: 'admin', password: 'password123', role: 'admin' },
        { username: 'manager', password: 'password123', role: 'manager' },
        { username: 'analyst', password: 'password123', role: 'analyst' }
      ]
      
      const user = validCredentials.find(
        cred => cred.username === formData.username && cred.password === formData.password
      )
      
      if (user) {
        // Store user data in localStorage (in real app, use secure token storage)
        localStorage.setItem('user', JSON.stringify({
          username: user.username,
          role: user.role,
          branch: formData.branch,
          loginTime: new Date().toISOString()
        }))
        
        // Navigate to dashboard
        navigate('/dashboard')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return <LoginForm onLogin={handleLogin} isLoading={isLoading} />
}

export default Login