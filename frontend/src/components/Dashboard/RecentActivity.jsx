const RecentActivity = ({ activity }) => {
  if (activity.length === 0) {
    return (
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="no-activity">
          <p>No recent activity</p>
        </div>
      </div>
    )
  }

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      
      <div className="activity-list">
        {activity.map((item, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">
              {item.total_pnl >= 0 ? '📈' : '📉'}
            </div>
            <div className="activity-content">
              <div className="activity-title">
                <strong>{item.ticker}</strong>
                <span className="activity-shares">{item.quantity} shares</span>
              </div>
              <div className="activity-details">
                <span className="activity-price">${item.current_price.toFixed(2)}</span>
                <span className={`activity-pnl ${item.total_pnl >= 0 ? 'positive' : 'negative'}`}>
                  {item.total_pnl >= 0 ? '+' : ''}${item.total_pnl.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity