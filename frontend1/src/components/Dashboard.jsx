import { useState, useEffect } from 'react'
import Header from './Header'
import StatsCards from './StatsCards'
import SearchSection from './SearchSection'
import PortfolioTable from './PortfolioTable'
import ChartModal from './ChartModal'
import { BarChart3, TrendingUp, DollarSign, PieChart as PieChartIcon, Activity, Plus } from 'lucide-react'
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = ({ user, onLogout }) => {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStock, setSelectedStock] = useState(null)
  const [showChart, setShowChart] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchPortfolio()
  }, [])
  
  useEffect(() => {
    if (portfolio.length > 0) {
      generateNotifications()
    }
  }, [portfolio])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/portfolio')
      const data = await response.json()
      setPortfolio(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNotifications = () => {
    const newNotifications = []
    portfolio.forEach(stock => {
      const change = stock.pnl_percentage || 0
      if (Math.abs(change) > 5) {
        newNotifications.push({
          id: stock.ticker,
          type: change > 0 ? 'gain' : 'loss',
          message: `${stock.ticker} ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}%`,
          timestamp: Date.now()
        })
      }
    })
    setNotifications(newNotifications.slice(0, 5))
  }

  const handleStockAction = async (action, ticker, quantity) => {
    try {
      const response = await fetch(`http://localhost:3000/api/portfolio/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, quantity: parseInt(quantity) })
      })
      
      if (response.ok) {
        fetchPortfolio()
      }
    } catch (error) {
      console.error(`Error ${action}ing stock:`, error)
    }
  }

  const totalValue = portfolio.reduce((sum, stock) => sum + (stock.current_value || 0), 0)
  const totalShares = portfolio.reduce((sum, stock) => sum + (stock.quantity || 0), 0)
  const totalPnL = portfolio.reduce((sum, stock) => sum + (stock.total_pnl || 0), 0)

  const sidebarItems = [
    { id: 'overview', label: 'Portfolio', icon: PieChartIcon },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: Activity },
  ]
  
  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <div id="portfolio-section">
              <StatsCards 
                totalValue={totalValue}
                totalHoldings={portfolio.length}
                totalShares={totalShares}
                totalPnL={totalPnL}
                portfolio={portfolio}
              />
            </div>
            
            {portfolio.length > 0 && (
              <div className="premium-card p-8 mb-8 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse"></div>
                  Portfolio Overview
                </h3>
                <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={portfolio.slice(0, 6).map((stock, index) => ({
                        name: stock.ticker,
                        value: stock.current_value || 0,
                        pnl: stock.total_pnl || 0,
                        fill: stock.total_pnl >= 0 ? '#10b981' : '#ef4444'
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                        formatter={(value, name) => [
                          `$${value.toLocaleString()}`, 
                          name === 'value' ? 'Current Value' : 'P&L'
                        ]}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="url(#valueGradient)" 
                        name="value"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1500}
                        animationBegin={200}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            <div id="search-section" className="mb-8">
              <SearchSection onStockAction={handleStockAction} />
            </div>
            
            <div id="portfolio-table" className="mb-8">
              <div className="premium-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Holdings</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Total Value:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <PortfolioTable
                  portfolio={portfolio}
                  onStockAction={handleStockAction}
                  onShowChart={(stock) => {
                    setSelectedStock(stock)
                    setShowChart(true)
                  }}
                />
              </div>
            </div>
          </>
        )
      case 'analytics':
        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16']
        const pieData = portfolio.map((stock, index) => ({
          name: stock.ticker,
          value: stock.current_value || 0,
          fill: colors[index % colors.length]
        }))
        
        const performanceData = portfolio.map(stock => ({
          name: stock.ticker,
          invested: stock.total_invested || 0,
          current: stock.current_value || 0,
          pnl: stock.total_pnl || 0
        }))
        
        return (
          <div className="space-y-8">
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Portfolio Analytics</h2>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                    Portfolio Allocation
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1500}
                          label={({name, percent}) => percent > 0.03 ? `${name} ${(percent * 100).toFixed(1)}%` : ''}
                          labelLine={false}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)'
                          }}
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-3"></div>
                    Performance Comparison
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value) => [`$${value.toLocaleString()}`, '']}
                        />
                        <Bar 
                          dataKey="invested" 
                          fill="url(#investedGradient)" 
                          name="Invested"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                        <Bar 
                          dataKey="current" 
                          fill="url(#currentGradient)" 
                          name="Current Value"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-3xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="text-green-500 mr-3" size={24} />
                    Top Performers
                  </h3>
                  <div className="space-y-4">
                    {portfolio.filter(s => (s.pnl_percentage || 0) > 0).slice(0, 3).map((stock, index) => (
                      <div key={stock.ticker} className="flex justify-between items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">{stock.ticker.charAt(0)}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{stock.ticker}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-bold text-lg">+{(stock.pnl_percentage || 0).toFixed(2)}%</div>
                          <div className="text-sm text-gray-500">${(stock.total_pnl || 0).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-8 rounded-3xl border border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="text-red-500 mr-3 rotate-180" size={24} />
                    Underperformers
                  </h3>
                  <div className="space-y-4">
                    {portfolio.filter(s => (s.pnl_percentage || 0) < 0).slice(0, 3).map((stock, index) => (
                      <div key={stock.ticker} className="flex justify-between items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">{stock.ticker.charAt(0)}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{stock.ticker}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-red-600 font-bold text-lg">{(stock.pnl_percentage || 0).toFixed(2)}%</div>
                          <div className="text-sm text-gray-500">${(stock.total_pnl || 0).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'activity':
        return (
          <div className="premium-card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 rounded-xl border-l-4 ${
                  notif.type === 'gain' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                }`}>
                  <p className="font-medium text-gray-900">{notif.message}</p>
                  <p className="text-sm text-gray-500">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="premium-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header user={user} onLogout={onLogout} notifications={notifications} />
      </div>
      
      <div className="flex pt-20">
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-20 z-40">
          <div className="flex-1 flex flex-col min-h-0 premium-card m-4">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">Trinity Firms</p>
                  <p className="text-xs text-gray-500">Portfolio Manager</p>
                </div>
              </div>
              
              <nav className="mt-5 flex-1 px-2 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`sidebar-item w-full group transition-all duration-200 ${activeTab === item.id ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-r-2 border-blue-500' : 'hover:bg-white/50'}`}
                    >
                      <Icon size={20} className="mr-3" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
          <main className="flex-1 p-6">
            {activeTab === 'overview' && (
              <div className="mb-8">
                <div className="premium-card p-8 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border-gradient">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.username || 'Investor'}! 👋
                      </h1>
                      <p className="text-gray-600 text-lg">
                        Here's what's happening with your portfolio today
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-glow">
                        <DollarSign className="text-white" size={40} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <button 
        onClick={() => document.querySelector('#search-section')?.scrollIntoView({ behavior: 'smooth' })}
        className="floating-action"
        title="Add Stock"
      >
        <Plus size={24} />
      </button>

      {showChart && selectedStock && (
        <ChartModal
          stock={selectedStock}
          onClose={() => {
            setShowChart(false)
            setSelectedStock(null)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard