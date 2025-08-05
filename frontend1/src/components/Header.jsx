import { useState } from 'react'
import { Menu, X, Bell, Search, Settings, User, LogOut, TrendingUp } from 'lucide-react'

const Header = ({ user, onLogout, notifications = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)

  return (
    <header className="premium-card border-b border-white/20 backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Trinity Firms
                </h1>
                <p className="text-xs text-gray-500">Portfolio Manager</p>
              </div>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stocks, portfolio..."
                className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-xl bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    document.querySelector('#search-section')?.scrollIntoView({ behavior: 'smooth' })
                    document.querySelector('#search-section input')?.focus()
                  }
                }}
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button 
              onClick={() => document.querySelector('#search-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="md:hidden p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors duration-200"
            >
              <Search size={20} className="text-gray-600" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                className="p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors duration-200 relative"
              >
                <Bell size={20} className="text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {notificationMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 premium-card border border-white/20 shadow-premium rounded-2xl py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Stock Alerts</p>
                  </div>
                  
                  <div className="py-2">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${
                        notif.type === 'gain' ? 'border-green-500' : 'border-red-500'
                      }`}>
                        <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                      </div>
                    )) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500">No new alerts</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="hidden sm:block p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors duration-200">
              <Settings size={20} className="text-gray-600" />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                  <p className="text-xs text-gray-500">Premium Account</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 premium-card border border-white/20 shadow-premium rounded-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <User size={16} className="mr-3" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <Settings size={16} className="mr-3" />
                      Account Settings
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/20 bg-white/90 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            <button 
              onClick={() => {
                setMobileMenuOpen(false)
                document.querySelector('#portfolio-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center w-full px-3 py-2 text-gray-700 rounded-xl hover:bg-white/50 transition-colors duration-200"
            >
              <TrendingUp size={20} className="mr-3" />
              Overview
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false)
                document.querySelector('#portfolio-table')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center w-full px-3 py-2 text-gray-700 rounded-xl hover:bg-white/50 transition-colors duration-200"
            >
              <User size={20} className="mr-3" />
              Portfolio
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false)
                setProfileMenuOpen(true)
              }}
              className="flex items-center w-full px-3 py-2 text-gray-700 rounded-xl hover:bg-white/50 transition-colors duration-200"
            >
              <Settings size={20} className="mr-3" />
              Settings
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header