const PortfolioSummary = ({ summary }) => {
  return (
    <div className="card">
      <h2>Portfolio Summary</h2>
      <div className="portfolio-summary">
        <div className="summary-card">
          <div className="summary-value">${summary.currentValue.toFixed(2)}</div>
          <div className="summary-label">Current Value</div>
        </div>
        <div className="summary-card">
          <div className={`summary-value ${summary.totalPnL >= 0 ? 'profit' : 'loss'}`}>
            ${summary.totalPnL.toFixed(2)}
          </div>
          <div className="summary-label">Total P&L</div>
        </div>
        <div className="summary-card">
          <div className={`summary-value ${summary.pnlPercentage >= 0 ? 'profit' : 'loss'}`}>
            {summary.pnlPercentage.toFixed(2)}%
          </div>
          <div className="summary-label">P&L %</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{summary.totalStocks}</div>
          <div className="summary-label">Total Stocks</div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary