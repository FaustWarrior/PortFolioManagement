import { useState } from 'react'
import { Search, Plus, TrendingUp } from 'lucide-react'
import { TextField, Button, Autocomplete, Alert } from '@mui/material'

const SearchSection = ({ onStockAction }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedStock, setSelectedStock] = useState(null)
  const [quantity, setQuantity] = useState('1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const searchStocks = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (response.ok && data.result) {
        const resultsWithPrices = await Promise.all(
          data.result.slice(0, 8).map(async (stock) => {
            try {
              const priceResponse = await fetch(`http://localhost:3000/api/price/${stock.symbol}`)
              const priceData = await priceResponse.json()
              return {
                ...stock,
                currentPrice: priceData.c || 0,
                change: priceData.d || 0,
                changePercent: priceData.dp || 0,
                high: priceData.h || 0,
                low: priceData.l || 0
              }
            } catch {
              return { ...stock, currentPrice: 0, change: 0, changePercent: 0 }
            }
          })
        )
        setSearchResults(resultsWithPrices)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleBuyStock = async () => {
    if (!selectedStock || !quantity) {
      setError('Please select a stock and enter quantity')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:3000/api/portfolio/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: selectedStock.symbol,
          quantity: parseInt(quantity)
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Successfully bought ${quantity} shares of ${selectedStock.symbol}`)
        setSelectedStock(null)
        setQuantity('1')
        setSearchQuery('')
        onStockAction('buy', selectedStock.symbol, quantity)
      } else {
        setError(data.error || 'Failed to buy stock')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="premium-card p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
          <Search className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add to Portfolio</h2>
          <p className="text-gray-600">Search and buy stocks to add to your portfolio</p>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="mb-4 rounded-xl">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4 rounded-xl">
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => `${option.symbol} - ${option.description}`}
            value={selectedStock}
            onChange={(event, newValue) => setSelectedStock(newValue)}
            inputValue={searchQuery}
            onInputChange={(event, newInputValue) => {
              setSearchQuery(newInputValue)
              searchStocks(newInputValue)
            }}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search stocks"
                placeholder="Enter ticker symbol or company name"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-sm">{option.symbol.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 text-lg">{option.symbol}</span>
                      {option.currentPrice > 0 && (
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          option.changePercent >= 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {option.changePercent >= 0 ? '+' : ''}{option.changePercent.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-md mt-1">
                      {option.description}
                    </div>
                    {option.currentPrice > 0 && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>H: ${option.high.toFixed(2)}</span>
                        <span>L: ${option.low.toFixed(2)}</span>
                        <span>Chg: ${option.change.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  {option.currentPrice > 0 ? (
                    <div className="text-xl font-bold text-gray-900">
                      ${option.currentPrice.toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Loading...</div>
                  )}
                </div>
              </li>
            )}
          />
        </div>

        <div className="flex gap-2">
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
              }
            }}
          />
          
          <button
            onClick={handleBuyStock}
            disabled={!selectedStock || loading}
            className="btn-primary flex items-center space-x-2 px-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Plus size={20} />
                <span>Buy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {selectedStock && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedStock.symbol}</h3>
              <p className="text-sm text-gray-600">{selectedStock.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Shares</p>
              <p className="text-xl font-bold text-blue-600">{quantity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchSection