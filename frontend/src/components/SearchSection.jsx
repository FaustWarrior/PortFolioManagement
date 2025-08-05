import { useState } from 'react'

const SearchSection = ({ onBuyStock, showMessage }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const searchStocks = async () => {
    if (!query.trim()) {
      showMessage('Please enter a search term', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.result || [])
    } catch (error) {
      showMessage('Failed to search stocks', 'error')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPortfolio = (symbol, quantity) => {
    onBuyStock(symbol, quantity)
  }

  return (
    <div className="card">
      <h2>Search & Add Stocks</h2>
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search for stocks (e.g., AAPL, MSFT, TSLA)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchStocks()}
        />
        <button className="btn btn-primary" onClick={searchStocks} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div className="search-results">
        {loading && <div className="loading">Searching...</div>}
        {!loading && results.length === 0 && query && (
          <p className="loading">No results found</p>
        )}
        {results.slice(0, 10).map((item) => (
          <SearchResultItem
            key={item.symbol}
            item={item}
            onAddToPortfolio={handleAddToPortfolio}
          />
        ))}
      </div>
    </div>
  )
}

const SearchResultItem = ({ item, onAddToPortfolio }) => {
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    onAddToPortfolio(item.symbol, quantity)
    setQuantity(1)
  }

  return (
    <div className="search-item">
      <div className="search-item-info">
        <div className="search-symbol">{item.symbol}</div>
        <div className="search-description">{item.description || 'No description available'}</div>
      </div>
      <div className="search-actions">
        <input
          type="number"
          className="quantity-input"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        />
        <button className="btn btn-primary btn-small" onClick={handleAdd}>
          Add to Portfolio
        </button>
      </div>
    </div>
  )
}

export default SearchSection