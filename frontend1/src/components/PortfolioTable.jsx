import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, ShoppingCart, Trash2, DollarSign } from 'lucide-react'
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material'

const PortfolioTable = ({ portfolio, onStockAction, onShowChart }) => {
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', stock: null })
  const [quantity, setQuantity] = useState('1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAction = async () => {
    if (!actionDialog.stock || !quantity) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/api/portfolio/${actionDialog.type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: actionDialog.stock.ticker,
          quantity: parseInt(quantity)
        })
      })

      const data = await response.json()

      if (response.ok) {
        onStockAction(actionDialog.type, actionDialog.stock.ticker, quantity)
        setActionDialog({ open: false, type: '', stock: null })
        setQuantity('1')
      } else {
        setError(data.error || `Failed to ${actionDialog.type} stock`)
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (stock) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/portfolio/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: stock.ticker })
      })

      if (response.ok) {
        onStockAction('remove', stock.ticker, 0)
      }
    } catch (error) {
      console.error('Remove error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="text-gray-500" size={40} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Holdings Yet</h3>
        <p className="text-gray-600 mb-6">Start building your portfolio by searching and buying stocks above.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-2 font-semibold text-gray-900">Stock</th>
              <th className="text-right py-4 px-2 font-semibold text-gray-900">Shares</th>
              <th className="text-right py-4 px-2 font-semibold text-gray-900">Avg Price</th>
              <th className="text-right py-4 px-2 font-semibold text-gray-900">Current Price</th>
              <th className="text-right py-4 px-2 font-semibold text-gray-900">Total Invested</th>
              <th className="text-right py-4 px-2 font-semibold text-gray-900">Current Value</th>
              <th className="text-right py-4 px-2 font-semibold text-gray-900">P&L</th>
              <th className="text-center py-4 px-2 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, index) => {
              const totalValue = stock.current_value || 0
              const change = stock.pnl_percentage || 0
              const isPositive = change >= 0

              return (
                <tr key={stock.ticker} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200">
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <span className="text-white font-bold text-sm">{stock.ticker?.charAt(0) || 'S'}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{stock.ticker}</div>
                        <div className="text-sm text-gray-600">{stock.companyName || 'Company Name'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="font-semibold text-gray-900">{(stock.quantity || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">shares</div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="font-semibold text-gray-900">${(stock.avg_buy_price || 0).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">avg cost</div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="font-semibold text-gray-900">${(stock.current_price || 0).toFixed(2)}</div>
                    <div className={`text-xs font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}{Math.abs(change).toFixed(2)}%
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="font-semibold text-gray-900">${(stock.total_invested || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-xs text-gray-500">invested</div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="font-bold text-gray-900">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-xs text-gray-500">current</div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className={`font-bold text-lg ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}${(stock.total_pnl || 0).toFixed(2)}
                    </div>
                    <div className={`text-xs font-medium flex items-center justify-end space-x-1 ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{Math.abs(change).toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => setActionDialog({ open: true, type: 'buy', stock })}
                        className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200 hover:scale-105"
                        title="Buy more"
                      >
                        <ShoppingCart size={14} />
                      </button>
                      <button
                        onClick={() => setActionDialog({ open: true, type: 'sell', stock })}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 hover:scale-105"
                        title="Sell shares"
                        disabled={!stock.quantity || stock.quantity <= 0}
                      >
                        <DollarSign size={14} />
                      </button>
                      <button
                        onClick={() => onShowChart(stock)}
                        className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200 hover:scale-105"
                        title="View chart"
                      >
                        <BarChart3 size={14} />
                      </button>
                      <button
                        onClick={() => handleRemove(stock)}
                        disabled={loading}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 hover:scale-105"
                        title="Remove from portfolio"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Action Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onClose={() => setActionDialog({ open: false, type: '', stock: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-center">
          {actionDialog.type === 'buy' ? 'Buy More Shares' : 'Sell Shares'} - {actionDialog.stock?.ticker}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4 rounded-xl">
              {error}
            </Alert>
          )}
          
          <div className="space-y-4 pt-4">
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              inputProps={{ min: 1, max: actionDialog.type === 'sell' ? actionDialog.stock?.quantity : undefined }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
            
            {actionDialog.stock && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-semibold">${(actionDialog.stock.current_price || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shares Owned:</span>
                  <span className="font-semibold">{actionDialog.stock.quantity || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Avg Buy Price:</span>
                  <span className="font-semibold">${(actionDialog.stock.avg_buy_price || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-900 font-semibold">
                    {actionDialog.type === 'buy' ? 'Total Cost:' : 'Total Value:'}
                  </span>
                  <span className="font-bold text-lg">
                    ${(((actionDialog.stock.current_price || 0) * parseInt(quantity || 0))).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="p-6">
          <Button 
            onClick={() => setActionDialog({ open: false, type: '', stock: null })}
            className="btn-secondary"
          >
            Cancel
          </Button>
          <button
            onClick={handleAction}
            disabled={loading || !quantity}
            className={`btn-primary ${actionDialog.type === 'sell' ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              `${actionDialog.type === 'buy' ? 'Buy' : 'Sell'} ${quantity} Shares`
            )}
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PortfolioTable