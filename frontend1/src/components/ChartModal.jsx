import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import { X, TrendingUp, Calendar, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const ChartModal = ({ stock, onClose }) => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeframe, setTimeframe] = useState('6M')

  useEffect(() => {
    if (stock) {
      fetchHistoricalData()
    }
  }, [stock])

  const fetchHistoricalData = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/api/history/${stock.ticker}`)
      const data = await response.json()

      if (response.ok && data.results) {
        const formattedData = data.results.map(item => ({
          date: new Date(item.t).toLocaleDateString(),
          price: item.c,
          volume: item.v,
          high: item.h,
          low: item.l,
          open: item.o
        }))
        setChartData(formattedData)
      } else {
        setError('Failed to load chart data')
      }
    } catch (error) {
      setError('Unable to fetch historical data')
    } finally {
      setLoading(false)
    }
  }

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : (stock.current_price || 0)
  const firstPrice = chartData.length > 0 ? chartData[0].price : (stock.current_price || 0)
  const priceChange = currentPrice - firstPrice
  const percentChange = ((priceChange / firstPrice) * 100)
  const isPositive = priceChange >= 0

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        className: 'premium-card border-0 shadow-2xl rounded-3xl'
      }}
    >
      <DialogTitle className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{stock.ticker}</h2>
            <p className="text-gray-600">{stock.companyName || 'Historical Price Chart'}</p>
          </div>
        </div>
        <IconButton onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-6">
        {/* Price Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-600 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-gray-900">${currentPrice.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-600 mb-1">Change</p>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={16} className={isPositive ? '' : 'rotate-180'} />
              <span className="text-xl font-bold">${Math.abs(priceChange).toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-600 mb-1">Change %</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-600 mb-1">Your Shares</p>
            <p className="text-2xl font-bold text-gray-900">{stock.quantity || 0}</p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-600" />
            <span className="text-gray-700 font-medium">Timeframe:</span>
          </div>
          <div className="flex space-x-2">
            {['1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  timeframe === period
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading chart data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="text-red-500" size={32} />
                </div>
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={fetchHistoricalData}
                  className="mt-2 btn-secondary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value, name) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#priceGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Additional Stats */}
        {chartData.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">High</p>
              <p className="font-bold text-green-600">
                ${Math.max(...chartData.map(d => d.high)).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Low</p>
              <p className="font-bold text-red-600">
                ${Math.min(...chartData.map(d => d.low)).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Avg Volume</p>
              <p className="font-bold text-blue-600">
                {(chartData.reduce((sum, d) => sum + d.volume, 0) / chartData.length / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Your Value</p>
              <p className="font-bold text-purple-600">
                ${(currentPrice * (stock.quantity || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ChartModal