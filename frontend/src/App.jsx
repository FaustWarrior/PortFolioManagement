import { useState, useEffect } from 'react'
import LoginPage from './components/Auth/LoginPage'
import RegisterPage from './components/Auth/RegisterPage'
import Dashboard from './components/Dashboard/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const switchToRegister = () => setAuthMode('register')
  const switchToLogin = () => setAuthMode('login')

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginPage onLogin={handleLogin} switchToRegister={switchToRegister} />
    ) : (
      <RegisterPage onLogin={handleLogin} switchToLogin={switchToLogin} />
    )
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App