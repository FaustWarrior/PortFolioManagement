import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts'

const StatsCards = ({ totalValue, totalHoldings, totalShares, totalPnL, portfolio }) => {
  // Generate sample data for mini charts
  const generateChartData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 100) + 50
    }))
  }

  const totalInvested = portfolio.reduce((sum, stock) => sum + (stock.total_invested || 0), 0)
  const portfolioChangePercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${portfolioChangePercent >= 0 ? '+' : ''}${portfolioChangePercent.toFixed(2)}%`,
      changeType: 'positive',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      chartData: generateChartData(),
      chartColor: '#10b981'
    },
    {
      title: 'Total Holdings',
      value: totalHoldings.toString(),
      change: totalHoldings > 0 ? `${totalHoldings} stocks` : 'No holdings',
      changeType: totalHoldings > 0 ? 'positive' : 'neutral',
      icon: PieChart,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      chartData: generateChartData(),
      chartColor: '#3b82f6'
    },
    {
      title: 'Total Shares',
      value: totalShares.toLocaleString(),
      change: `${totalShares} shares`,
      changeType: 'positive',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      chartData: generateChartData(),
      chartColor: '#8b5cf6'
    },
    {
      title: 'Total P&L',
      value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`,
      change: `${portfolioChangePercent >= 0 ? '+' : ''}${portfolioChangePercent.toFixed(2)}%`,
      changeType: totalPnL >= 0 ? 'positive' : 'negative',
      icon: Activity,
      gradient: totalPnL >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600',
      bgGradient: totalPnL >= 0 ? 'from-green-50 to-emerald-50' : 'from-red-50 to-pink-50',
      chartData: generateChartData(),
      chartColor: totalPnL >= 0 ? '#10b981' : '#ef4444'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="metric-card group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : stat.changeType === 'negative' ? (
                    <TrendingDown size={16} className="text-red-500" />
                  ) : null}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300`}>
                <Icon className="text-white" size={24} />
              </div>
            </div>

            {/* Mini Chart */}
            <div className="h-16 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stat.chartData}>
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={stat.chartColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={stat.chartColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={stat.chartColor}
                    strokeWidth={2}
                    fill={`url(#gradient-${index})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards