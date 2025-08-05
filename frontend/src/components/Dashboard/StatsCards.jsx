import { TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

const StatsCards = ({ summary }) => {
  // Mock trend data for mini charts
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    value: Math.random() * 100 + 50
  }))
  const stats = [
    {
      title: 'Portfolio Value',
      value: `$${summary.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '💰',
      color: 'primary',
      subtitle: 'Total Investment Value'
    },
    {
      title: 'Total P&L',
      value: `${summary.totalPnL >= 0 ? '+' : ''}$${Math.abs(summary.totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: summary.totalPnL >= 0 ? '📈' : '📉',
      color: summary.totalPnL >= 0 ? 'success' : 'danger',
      percentage: `${summary.pnlPercentage >= 0 ? '+' : ''}${summary.pnlPercentage.toFixed(2)}%`,
      subtitle: 'Profit & Loss'
    },
    {
      title: 'Holdings',
      value: summary.totalStocks,
      icon: '📊',
      color: 'info',
      subtitle: `${summary.totalShares} Total Shares`
    },
    {
      title: 'Invested',
      value: `$${summary.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '🏦',
      color: 'secondary',
      subtitle: 'Total Amount Invested'
    }
  ]

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-header">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-trend">
              {stat.percentage && (
                <span className={`trend-indicator ${summary.totalPnL >= 0 ? 'positive' : 'negative'}`}>
                  {stat.percentage}
                </span>
              )}
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-title">{stat.title}</p>
            <small className="stat-subtitle">{stat.subtitle}</small>
            {index === 1 && (
              <div className="mini-chart">
                <ResponsiveContainer width="100%" height={30}>
                  <LineChart data={trendData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={summary.totalPnL >= 0 ? '#10b981' : '#ef4444'} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards