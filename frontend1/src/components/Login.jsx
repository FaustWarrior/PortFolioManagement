import { useState } from 'react'
import { Card, CardContent, TextField, Button, Typography, Alert, Box } from '@mui/material'
import { TrendingUp, Sparkles, Shield, BarChart3 } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password }

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.user)
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (error) {
      setError('Connection failed. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Trinity Firms
              </h1>
            </div>
            <p className="text-xl text-blue-100">
              Professional Portfolio Management Platform
            </p>
            <p className="text-blue-200 text-lg leading-relaxed">
              Experience next-generation investment tracking with real-time analytics, 
              advanced charting, and institutional-grade portfolio management tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-4 text-center">
              <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Real-time Analytics</h3>
              <p className="text-sm text-blue-200">Live market data</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Secure Platform</h3>
              <p className="text-sm text-blue-200">Bank-grade security</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">AI Insights</h3>
              <p className="text-sm text-blue-200">Smart recommendations</p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="animate-slide-up">
          <Card className="premium-card border-0 shadow-2xl">
            <CardContent className="p-8">
              <Box className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <TrendingUp className="text-white" size={32} />
                </div>
                <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Join Trinity Firms'}
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  {isLogin ? 'Sign in to your account' : 'Create your premium account'}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert severity="error" className="rounded-xl">
                    {error}
                  </Alert>
                )}
                
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    className="rounded-xl"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(10px)',
                      }
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                    }
                  }}
                />

                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(10px)',
                      }
                    }}
                  />
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg font-semibold py-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <Box className="text-center mt-8">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login