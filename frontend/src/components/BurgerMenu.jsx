import React, { useState } from 'react';
import { User, ChevronDown, LogOut, Settings, BarChart3 } from 'lucide-react';
import '../styles/BurgerMenu.css';

function BurgerMenu({
  currentPage,
  handleNavClick,
  isAuthenticated,
  user,
  handleDashboardClick,
  handleLoginClick,
  handleLogout,
  isUserMenuOpen,
  toggleUserMenu,
  userMenuRef
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
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
            onClick={() => {
              handleNavClick('Accueil', '/');
              closeMenu();
            }}
          >
            Accueil
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/services"
            className={`nav-link ${currentPage === 'Services' ? 'active' : ''}`}
            onClick={() => {
              handleNavClick('Services', '/services');
              closeMenu();
            }}
          >
            Services
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/portfolio"
            className={`nav-link ${currentPage === 'Portfolio' ? 'active' : ''}`}
            onClick={() => {
              handleNavClick('Portfolio', '/portfolio');
              closeMenu();
            }}
          >
            Portfolio
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/contact"
            className={`nav-link ${currentPage === 'Contact' ? 'active' : ''}`}
            onClick={() => {
              handleNavClick('Contact', '/contact');
              closeMenu();
            }}
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
                onClick={() => {
                  handleDashboardClick();
                  closeMenu();
                }}
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
                className="nav-link"
                onClick={() => {
                  handleNavClick('Mon Profil', '/profil-employe');
                  closeMenu();
                }}
              >
                <User size={18} />
                Mon Profil
              </button>
            </li>
            <li className="nav-item mobile-only">
              <button
                className="nav-link logout-mobile"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
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
              onClick={() => {
                handleLoginClick();
                closeMenu();
              }}
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
                  onClick={() => {
                    handleDashboardClick();
                    closeMenu();
                  }}
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
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleNavClick('Mon Profil', '/profil-employe');
                    closeMenu();
                  }}
                >
                  <User size={16} />
                  Mon Profil
                </button>
                <hr className="dropdown-divider" />
                <button
                  className="dropdown-item logout-item"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </>
  );
}

export default BurgerMenu;
