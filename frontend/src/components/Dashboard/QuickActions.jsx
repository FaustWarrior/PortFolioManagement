import { useState, useEffect } from 'react'

const QuickActions = ({ onRefresh, portfolio }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedStock, setSelectedStock] = useState('')

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        handleSearch()
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.result?.slice(0, 5) || [])
      setShowResults(true)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickBuy = async (symbol, quantity = 1) => {
    try {
      const response = await fetch('/api/portfolio/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: symbol, quantity })
      })

      if (response.ok) {
        onRefresh()
        setSearchResults([])
        setSearchQuery('')
        setShowResults(false)
      }
    } catch (error) {
      console.error('Quick buy failed:', error)
    }
  }

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>🔍 Search & Add Stocks</h2>
        <p>Find and add stocks to your portfolio</p>
      </div>
      
      <div className="search-input-wrapper">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search stocks (AAPL, MSFT, TSLA...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(searchResults.length > 0)}
          />
          {loading && <div className="search-loading">⏳</div>}
        </div>

        {showResults && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((stock) => (
              <div key={stock.symbol} className="search-result-item">
                <div className="stock-details">
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.description?.substring(0, 40)}...</div>
                </div>
                <div className="stock-actions">
                  <input 
                    type="number" 
                    min="1" 
                    defaultValue="1" 
                    className="qty-input"
                    id={`qty-${stock.symbol}`}
                  />
                  <button 
                    onClick={() => {
                      const qty = parseInt(document.getElementById(`qty-${stock.symbol}`).value) || 1
                      handleQuickBuy(stock.symbol, qty)
                    }}
                    className="buy-btn"
                  >
                    Add to Portfolio
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="quick-actions-row">
        <button className="action-card" onClick={() => onRefresh('analytics')}>
          <div className="action-icon">📊</div>
          <span>Analytics</span>
        </button>
        
        <div className="chart-action-card">
          <select 
            value={selectedStock} 
            onChange={(e) => setSelectedStock(e.target.value)}
            className="stock-dropdown"
          >
            <option value="">Select stock for chart</option>
            {portfolio.map(stock => (
              <option key={stock.ticker} value={stock.ticker}>
                {stock.ticker}
              </option>
            ))}
          </select>
          <button 
            className="view-chart-btn"
            onClick={() => {
              if (selectedStock) {
                const stock = portfolio.find(s => s.ticker === selectedStock)
                onRefresh('chart', stock)
              }
            }}
            disabled={!selectedStock}
          >
            📈 Chart
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickActions