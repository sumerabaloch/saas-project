import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link-active' : '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🚀</span>
          ProjectHub
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="navbar-links">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/projects" className={`nav-link ${isActive('/projects')}`} onClick={() => setIsMobileMenuOpen(false)}>
              Projects
            </Link>
            <Link to="/activity" className={`nav-link ${isActive('/activity')}`} onClick={() => setIsMobileMenuOpen(false)}>
              Activity
            </Link>
          </div>

          <div className="navbar-actions">
            <div className="user-menu">
              <button className="user-menu-button">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.name || 'User'}</span>
                {isAdmin() && <span className="admin-badge">Admin</span>}
              </button>
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="dropdown-icon">👤</span>
                  Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
