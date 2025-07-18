import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronDown, LogOut, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Accueil');
  const userMenuRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Récupérer la page actuelle du localStorage
  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  // Fermer le menu utilisateur si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setCurrentPage('Accueil');
    localStorage.setItem('currentPage', 'Accueil');
    closeMenu();
    navigate('/');
  };

  const handleNavClick = (page, path = '/') => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    closeMenu();
    navigate(path);
  };

  const handleDashboardClick = () => {
    const dashboardPage = user?.role === 'Administrateur' ? 'Admin Dashboard' : 'Employee Dashboard';
    const dashboardPath = user?.role === 'Administrateur' ? '/admin' : '/employe';
    
    setCurrentPage(dashboardPage);
    localStorage.setItem('currentPage', dashboardPage);
    setIsUserMenuOpen(false);
    closeMenu();
    navigate(dashboardPath);
  };

  const handleLoginClick = () => {
    navigate('/connexion');
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <a href="/" onClick={() => handleNavClick('Accueil', '/')}>
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
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
            <a 
              href="/" 
              className={`nav-link ${currentPage === 'Accueil' ? 'active' : ''}`}
              onClick={() => handleNavClick('Accueil', '/')}
            >
              Accueil
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="/services" 
              className={`nav-link ${currentPage === 'Services' ? 'active' : ''}`}
              onClick={() => handleNavClick('Services', '/services')}
            >
              Services
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="/portfolio" 
              className={`nav-link ${currentPage === 'Portfolio' ? 'active' : ''}`}
              onClick={() => handleNavClick('Portfolio', '/portfolio')}
            >
              Portfolio
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="/contact" 
              className={`nav-link ${currentPage === 'Contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('Contact', '/contact')}
            >
              Contact
            </a>
          </li>

          {/* Section Mobile pour utilisateur connecté */}
          {isAuthenticated && (
            <>
              <li className="nav-item mobile-only">
                <button 
                  className="nav-link dashboard-link"
                  onClick={handleDashboardClick}
                >
                  {user?.role === 'Administrateur' ? (
                    <>
                      <Settings size={18} />
                      Admin Dashboard
                    </>
                  ) : (
                    <>
                      <BarChart3 size={18} />
                      Employee Dashboard
                    </>
                  )}
                </button>
              </li>
              <li className="nav-item mobile-only">
                <button 
                  className="nav-link logout-mobile"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </li>
            </>
          )}

          {/* Menu utilisateur - Desktop uniquement */}
          {!isAuthenticated ? (
            <li className="nav-item">
              <button
                className="nav-link user-icon-button"
                onClick={handleLoginClick}
                aria-label="Se connecter"
              >
                <User size={20} />
              </button>
            </li>
          ) : (
            <li className="nav-item user-menu-container desktop-only" ref={userMenuRef}>
              <button
                className="nav-link user-menu-button"
                onClick={toggleUserMenu}
                aria-label="Menu utilisateur"
              >
                <User size={20} />
                <ChevronDown size={16} className={`chevron ${isUserMenuOpen ? 'rotate' : ''}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <span className="user-role">
                      {user?.role === 'Administrateur' ? 'Administrateur' : 'Employé'}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    onClick={handleDashboardClick}
                  >
                    {user?.role === 'Administrateur' ? (
                      <>
                        <Settings size={16} />
                        Admin Dashboard
                      </>
                    ) : (
                      <>
                        <BarChart3 size={16} />
                        Employee Dashboard
                      </>
                    )}
                  </button>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;