import React, { useState } from 'react';
import '../styles/Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <a href="/">
            <span className="logo-icon">🔧</span>
            <span className="logo-text">DigitalCraft</span>
          </a>
        </div>

        {/* Menu Burger Button */}
        <button 
          className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a href="/" className="nav-link" onClick={closeMenu}>
              Accueil
            </a>
          </li>
          <li className="nav-item">
            <a href="/services" className="nav-link" onClick={closeMenu}>
              Services
            </a>
          </li>
          <li className="nav-item">
            <a href="/portfolio" className="nav-link" onClick={closeMenu}>
              Portfolio
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link" onClick={closeMenu}>
              Contact
            </a>
          </li>
          <li className="nav-item">
            <a 
              href={isLoggedIn ? '/' : '/connexion'} 
              className="nav-link connexion-link" 
              onClick={() => {
                if (isLoggedIn) setIsLoggedIn(false);
                closeMenu();
              }}
            >
              {isLoggedIn ? 'Déconnexion' : 'Connexion'}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;