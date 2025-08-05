import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react'
import AnimatedLogo from '../Logo/AnimatedLogo'
import './ContactFooter.css'

const ContactFooter = () => {
  return (
    <footer className="contact-footer">
      <div className="footer-content">
        <div className="footer-section company-info">
          <AnimatedLogo size="medium" />
          <p className="company-description">
            Professional portfolio management solutions for modern investors. 
            Track, analyze, and grow your investments with confidence.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link">
              <Linkedin size={20} />
            </a>
            <a href="#" className="social-link">
              <Github size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section contact-info">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <Mail size={18} />
            <span>contact@trinityfirms.com</span>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="contact-item">
            <MapPin size={18} />
            <span>123 Financial District, NY 10004</span>
          </div>
        </div>

        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h3>Stay Updated</h3>
          <p>Get the latest market insights and portfolio tips.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2024 Trinity Firms. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ContactFooter