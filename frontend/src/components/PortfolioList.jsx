import { useState } from 'react'

const PortfolioList = ({ portfolio, onBuyStock, onSellStock, onRemoveStock, onShowChart }) => {
  if (portfolio.length === 0) {
    return (
      <div className="card">
        <h2>Your Portfolio</h2>
        <p className="loading">Your portfolio is empty. Search and add some stocks to get started!</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Your Portfolio</h2>
      <div>
        {portfolio.map((item) => (
          <PortfolioItem
            key={item.ticker}
            item={item}
            onBuyStock={onBuyStock}
            onSellStock={onSellStock}
            onRemoveStock={onRemoveStock}
            onShowChart={onShowChart}
          />
        ))}
      </div>
    </div>
  )
}

const PortfolioItem = ({ item, onBuyStock, onSellStock, onRemoveStock, onShowChart }) => {
  const [buyQty, setBuyQty] = useState('')
  const [sellQty, setSellQty] = useState('')

  const handleBuy = () => {
    const qty = parseInt(buyQty)
    if (!qty || qty <= 0) return
    onBuyStock(item.ticker, qty)
    setBuyQty('')
  }

  const handleSell = () => {
    const qty = parseInt(sellQty)
    if (!qty || qty <= 0) return
    onSellStock(item.ticker, qty)
    setSellQty('')
  }

  const pnlClass = item.total_pnl >= 0 ? 'profit' : 'loss'
  const pnlSign = item.total_pnl >= 0 ? '+' : ''

  return (
    <div className="portfolio-item">
      <div className="portfolio-header">
        <div className="ticker-info">
          <span className="ticker-symbol">{item.ticker}</span>
          <span className="quantity-badge">{item.quantity} shares</span>
          <span className="ticker-price">${item.current_price.toFixed(2)}</span>
          <span className="avg-price">Avg: ${item.avg_buy_price.toFixed(2)}</span>
        </div>
        <div className="pnl-info">
          <span className="current-value">Value: ${item.current_value.toFixed(2)}</span>
          <span className={`pnl ${pnlClass}`}>
            {pnlSign}${item.total_pnl.toFixed(2)} ({pnlSign}{item.pnl_percentage.toFixed(2)}%)
          </span>
        </div>
      </div>
      <div className="portfolio-actions">
        <input
          type="number"
          className="quantity-input"
          min="1"
          placeholder="Qty"
          value={buyQty}
          onChange={(e) => setBuyQty(e.target.value)}
        />
        <button className="btn btn-success btn-small" onClick={handleBuy}>
          Buy
        </button>
        <input
          type="number"
          className="quantity-input"
          min="1"
          placeholder="Qty"
          value={sellQty}
          onChange={(e) => setSellQty(e.target.value)}
        />
        <button className="btn btn-danger btn-small" onClick={handleSell}>
          Sell
        </button>
        <button className="btn btn-info btn-small" onClick={() => onShowChart(item.ticker)}>
          Chart
        </button>
        <button className="btn btn-danger btn-small" onClick={() => onRemoveStock(item.ticker)}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default PortfolioList