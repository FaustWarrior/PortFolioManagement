import { useState } from 'react'

const PortfolioOverview = ({ portfolio, onRefresh }) => {
  const [expandedStock, setExpandedStock] = useState(null)
  const [actionQuantities, setActionQuantities] = useState({})

  const handleStockAction = async (action, ticker, quantity = 1) => {
    try {
      const response = await fetch(`/api/portfolio/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, quantity })
      })

      if (response.ok) {
        onRefresh()
        setActionQuantities(prev => ({ ...prev, [`${action}_${ticker}`]: '' }))
      } else {
        const error = await response.json()
        alert(error.error || `Failed to ${action} stock`)
      }
    } catch (error) {
      console.error(`${action} failed:`, error)
      alert(`Failed to ${action} stock`)
    }
  }

  const updateQuantity = (action, ticker, value) => {
    setActionQuantities(prev => ({ ...prev, [`${action}_${ticker}`]: value }))
  }

  const getQuantity = (action, ticker) => {
    return actionQuantities[`${action}_${ticker}`] || ''
  }

  if (portfolio.length === 0) {
    return (
      <div className="portfolio-overview">
        <div className="section-header">
          <h3>💼 Portfolio Holdings</h3>
          <div className="portfolio-stats">
            <span className="stat-badge empty">0 Holdings</span>
          </div>
        </div>
        <div className="empty-portfolio">
          <div className="empty-illustration">
            <div className="empty-icon">📈</div>
            <div className="empty-chart"></div>
          </div>
          <h4>Start Building Your Portfolio</h4>
          <p>Search for stocks above and start investing</p>
          <div className="suggested-stocks">
            <small>Popular: AAPL, MSFT, GOOGL, TSLA, AMZN</small>
          </div>
        </div>
      </div>
    )
  }

  const totalValue = portfolio.reduce((sum, stock) => sum + stock.current_value, 0)
  const totalPnL = portfolio.reduce((sum, stock) => sum + stock.total_pnl, 0)

  return (
    <div className="portfolio-overview">
      <div className="section-header">
        <h3>💼 Portfolio Holdings</h3>
        <div className="portfolio-stats">
          <span className="stat-badge">{portfolio.length} Holdings</span>
          <span className={`stat-badge ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="portfolio-grid">
        {portfolio.map((stock) => (
          <div key={stock.ticker} className="stock-card">
            <div className="stock-header">
              <div className="stock-info">
                <h4 className="stock-symbol">{stock.ticker}</h4>
                <div className="stock-shares">{stock.quantity} shares</div>
              </div>
              <div className="stock-value">
                <div className="current-price">${stock.current_price.toFixed(2)}</div>
                <div className={`pnl ${stock.total_pnl >= 0 ? 'positive' : 'negative'}`}>
                  {stock.total_pnl >= 0 ? '+' : ''}${stock.total_pnl.toFixed(2)}
                  <span className="pnl-percent">({stock.pnl_percentage.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
            
            <div className="stock-details">
              <div className="detail-row">
                <span>Avg Cost:</span>
                <span>${stock.avg_buy_price.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span>Total Value:</span>
                <span>${stock.current_value.toFixed(2)}</span>
              </div>
            </div>

            <div className="stock-actions">
              <div className="action-group">
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  className="qty-input"
                  value={getQuantity('buy', stock.ticker)}
                  onChange={(e) => updateQuantity('buy', stock.ticker, e.target.value)}
                />
                <button 
                  onClick={() => {
                    const qty = parseInt(getQuantity('buy', stock.ticker)) || 1
                    handleStockAction('buy', stock.ticker, qty)
                  }}
                  className="action-btn buy"
                >
                  Buy
                </button>
              </div>
              
              <div className="action-group">
                <input
                  type="number"
                  min="1"
                  max={stock.quantity}
                  placeholder="Qty"
                  className="qty-input"
                  value={getQuantity('sell', stock.ticker)}
                  onChange={(e) => updateQuantity('sell', stock.ticker, e.target.value)}
                />
                <button 
                  onClick={() => {
                    const qty = parseInt(getQuantity('sell', stock.ticker)) || 1
                    if (qty > stock.quantity) {
                      alert(`You only have ${stock.quantity} shares`)
                      return
                    }
                    handleStockAction('sell', stock.ticker, qty)
                  }}
                  className="action-btn sell"
                >
                  Sell
                </button>
              </div>
              
              <button 
                onClick={() => onRefresh('chart', stock)}
                className="action-btn chart"
                title="View Chart"
              >
                📈
              </button>
              
              <button 
                onClick={() => {
                  if (confirm(`Remove all ${stock.ticker} holdings?`)) {
                    handleStockAction('remove', stock.ticker)
                  }
                }}
                className="action-btn remove"
                title="Remove Stock"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PortfolioOverview