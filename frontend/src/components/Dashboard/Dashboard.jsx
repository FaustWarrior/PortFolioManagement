import { useState, useEffect } from 'react'
import DashboardHeader from './DashboardHeader'
import StatsCards from './StatsCards'
import QuickActions from './QuickActions'
import PortfolioOverview from './PortfolioOverview'
import RecentActivity from './RecentActivity'
import AnalyticsModal from './AnalyticsModal'
import ChartModal from './ChartModal'
import ContactFooter from '../Footer/ContactFooter'
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState({
    portfolio: [],
    summary: {
      totalInvested: 0,
      currentValue: 0,
      totalPnL: 0,
      pnlPercentage: 0,
      totalStocks: 0,
      totalShares: 0
    },
    recentActivity: []
  })
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [portfolioRes, summaryRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/portfolio/summary')
      ])

      const portfolio = await portfolioRes.json()
      const summary = await summaryRes.json()

      setDashboardData({
        portfolio,
        summary,
        recentActivity: portfolio.slice(0, 5)
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const handleAction = (action, data = null) => {
    switch (action) {
      case 'analytics':
        setShowAnalytics(true)
        break
      case 'chart':
        setSelectedStock(data)
        setShowChart(true)
        break
      case 'charts':
        if (dashboardData.portfolio.length > 0) {
          setSelectedStock(dashboardData.portfolio[0])
          setShowChart(true)
        }
        break
      default:
        loadDashboardData()
    }
  }

  return (
    <div className="dashboard">
      <DashboardHeader user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <StatsCards summary={dashboardData.summary} />
        
        <div className="centered-search">
          <QuickActions onRefresh={handleAction} portfolio={dashboardData.portfolio} />
        </div>
        
        <PortfolioOverview portfolio={dashboardData.portfolio} onRefresh={handleAction} />
        
        <RecentActivity activity={dashboardData.recentActivity} />
      </div>

      <AnalyticsModal 
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        portfolio={dashboardData.portfolio}
        summary={dashboardData.summary}
      />

      <ChartModal 
        isOpen={showChart}
        onClose={() => setShowChart(false)}
        selectedStock={selectedStock}
      />
      
      <ContactFooter />
    </div>
  )
}

export default Dashboard