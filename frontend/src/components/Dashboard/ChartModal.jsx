import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import './ChartModal.css'

const ChartModal = ({ isOpen, onClose, selectedStock }) => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState('1M')

  useEffect(() => {
    if (isOpen && selectedStock) {
      loadChartData()
    }
  }, [isOpen, selectedStock, timeframe])

  const loadChartData = async () => {
    if (!selectedStock) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/history/${selectedStock.ticker}`)
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const formattedData = data.results.map(item => ({
          date: new Date(item.t).toLocaleDateString(),
          price: item.c,
          volume: item.v,
          high: item.h,
          low: item.l,
          open: item.o
        }))
        setChartData(formattedData)
      }
    } catch (error) {
      console.error('Failed to load chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !selectedStock) return null

  const currentPrice = selectedStock.current_price
  const avgPrice = selectedStock.avg_buy_price
  const priceChange = currentPrice - avgPrice
  const priceChangePercent = ((priceChange / avgPrice) * 100)

  return (
    <div className="chart-overlay">
      <div className="chart-modal">
        <div className="chart-header">
          <div className="stock-info">
            <h2>{selectedStock.ticker}</h2>
            <div className="price-info">
              <span className="current-price">${currentPrice.toFixed(2)}</span>
              <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                {priceChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="timeframe-selector">
          {['1W', '1M', '3M', '6M', '1Y'].map(period => (
            <button
              key={period}
              className={`timeframe-btn ${timeframe === period ? 'active' : ''}`}
              onClick={() => setTimeframe(period)}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="chart-content">
          {loading ? (
            <div className="chart-loading">
              <div className="loading-spinner"></div>
              <p>Loading chart data...</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#667eea' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="stock-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Shares Owned</span>
              <span className="detail-value">{selectedStock.quantity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Avg Cost</span>
              <span className="detail-value">${selectedStock.avg_buy_price.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Value</span>
              <span className="detail-value">${selectedStock.current_value.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total P&L</span>
              <span className={`detail-value ${selectedStock.total_pnl >= 0 ? 'positive' : 'negative'}`}>
                ${selectedStock.total_pnl.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartModal