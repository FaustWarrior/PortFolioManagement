import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { X, TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from 'lucide-react'
import './AnalyticsModal.css'

const AnalyticsModal = ({ isOpen, onClose, portfolio, summary }) => {
  const [activeTab, setActiveTab] = useState('overview')

  if (!isOpen) return null

  // Prepare data for charts
  const portfolioData = portfolio.map(stock => ({
    name: stock.ticker,
    value: stock.current_value,
    pnl: stock.total_pnl,
    percentage: stock.pnl_percentage,
    shares: stock.quantity,
    avgPrice: stock.avg_buy_price,
    currentPrice: stock.current_price
  }))

  const pnlData = portfolio.map(stock => ({
    name: stock.ticker,
    profit: stock.total_pnl > 0 ? stock.total_pnl : 0,
    loss: stock.total_pnl < 0 ? Math.abs(stock.total_pnl) : 0,
    percentage: stock.pnl_percentage
  }))

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            Value: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="analytics-overlay">
      <div className="analytics-modal">
        <div className="modal-header">
          <h2>📊 Portfolio Analytics</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="analytics-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'allocation' ? 'active' : ''}`}
            onClick={() => setActiveTab('allocation')}
          >
            Allocation
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
        </div>

        <div className="analytics-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon success">
                    <DollarSign size={24} />
                  </div>
                  <div className="metric-info">
                    <h3>${summary.currentValue.toFixed(2)}</h3>
                    <p>Total Portfolio Value</p>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className={`metric-icon ${summary.totalPnL >= 0 ? 'success' : 'danger'}`}>
                    {summary.totalPnL >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                  <div className="metric-info">
                    <h3>${summary.totalPnL.toFixed(2)}</h3>
                    <p>Total P&L ({summary.pnlPercentage.toFixed(2)}%)</p>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon info">
                    <PieIcon size={24} />
                  </div>
                  <div className="metric-info">
                    <h3>{summary.totalStocks}</h3>
                    <p>Holdings ({summary.totalShares} shares)</p>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <h3>Portfolio Composition</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'allocation' && (
            <div className="allocation-tab">
              <div className="chart-section">
                <h3>Portfolio Allocation by Value</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="allocation-list">
                <h3>Detailed Allocation</h3>
                {portfolioData.map((stock, index) => {
                  const percentage = (stock.value / summary.currentValue * 100).toFixed(1)
                  return (
                    <div key={stock.name} className="allocation-item">
                      <div className="allocation-info">
                        <div className="stock-indicator" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div>
                          <strong>{stock.name}</strong>
                          <small>{stock.shares} shares @ ${stock.currentPrice.toFixed(2)}</small>
                        </div>
                      </div>
                      <div className="allocation-value">
                        <span className="value">${stock.value.toFixed(2)}</span>
                        <span className="percentage">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="performance-tab">
              <div className="chart-section">
                <h3>Profit & Loss Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={pnlData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profit" fill="#10B981" name="Profit" />
                    <Bar dataKey="loss" fill="#EF4444" name="Loss" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="performance-list">
                <h3>Performance Summary</h3>
                {pnlData.map((stock) => (
                  <div key={stock.name} className="performance-item">
                    <div className="performance-info">
                      <strong>{stock.name}</strong>
                      <div className={`performance-indicator ${stock.profit > 0 ? 'positive' : 'negative'}`}>
                        {stock.profit > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {stock.percentage.toFixed(2)}%
                      </div>
                    </div>
                    <div className={`performance-value ${stock.profit > 0 ? 'positive' : 'negative'}`}>
                      ${stock.profit > 0 ? stock.profit.toFixed(2) : stock.loss.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsModal