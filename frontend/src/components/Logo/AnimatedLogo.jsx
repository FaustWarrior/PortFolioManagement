import './AnimatedLogo.css'

const AnimatedLogo = ({ size = 'medium' }) => {
  return (
    <div className={`animated-logo ${size}`}>
      <div className="fuji-container">
        <div className="mountain-base"></div>
        <div className="mountain-peak"></div>
        <div className="snow-cap"></div>
        <div className="sun"></div>
        <div className="clouds">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
        </div>
      </div>
      <div className="logo-text">
        <span className="trinity">Trinity</span>
        <span className="firms">Firms</span>
      </div>
    </div>
  )
}

export default AnimatedLogo