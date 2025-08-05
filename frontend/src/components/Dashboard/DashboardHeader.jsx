import AnimatedLogo from '../Logo/AnimatedLogo'

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <AnimatedLogo size="medium" />
          <div className="header-text">
            <h1>Portfolio Dashboard</h1>
            <p>Welcome back, {user.username}!</p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user.username}</span>
          </div>
          
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader