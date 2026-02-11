// src/components/Navbar.tsx
import { useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  onFeaturesClick: () => void;
  onStatsClick: () => void;
  onGetStartedClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}
const Navbar: React.FC<NavbarProps> = ({
  onFeaturesClick,
  onStatsClick,
  onGetStartedClick,
  onLoginClick,
  onRegisterClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">ProjectHub</span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <button onClick={onFeaturesClick} className="nav-link">Features</button>
          <button onClick={onStatsClick} className="nav-link">Stats</button>
          <button onClick={onGetStartedClick} className="nav-link">Get Started</button>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="nav-auth">
          <button onClick={onLoginClick} className="auth-btn login-btn">Sign In</button>
          <button onClick={onRegisterClick} className="auth-btn register-btn">Get Started</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => { onFeaturesClick(); setIsMenuOpen(false); }} className="mobile-nav-link">
            Features
          </button>
          <button onClick={() => { onStatsClick(); setIsMenuOpen(false); }} className="mobile-nav-link">
            Stats
          </button>
          <button onClick={() => { onGetStartedClick(); setIsMenuOpen(false); }} className="mobile-nav-link">
            Get Started
          </button>
          <div className="mobile-auth">
            <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="auth-btn login-btn">
              Sign In
            </button>
            <button onClick={() => { onRegisterClick(); setIsMenuOpen(false); }} className="auth-btn register-btn">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;