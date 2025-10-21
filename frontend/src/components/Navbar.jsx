import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import '../styles/Navbar.css';

function Navbar() {
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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setCurrentPage('Accueil');
    localStorage.setItem('currentPage', 'Accueil');
    navigate('/');
  };

  const handleNavClick = (page, path = '/') => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    navigate(path);
  };

  const handleDashboardClick = () => {
    const dashboardPage = user?.role === 'Administrateur' ? 'Admin Dashboard' : 'Employee Dashboard';
    const dashboardPath = user?.role === 'Administrateur' ? '/admin' : '/employe';

    setCurrentPage(dashboardPage);
    localStorage.setItem('currentPage', dashboardPage);
    setIsUserMenuOpen(false);
    navigate(dashboardPath);
  };

  const handleLoginClick = () => {
    navigate('/connexion');
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

        {/* Burger Menu Component */}
        <BurgerMenu
          currentPage={currentPage}
          handleNavClick={handleNavClick}
          isAuthenticated={isAuthenticated}
          user={user}
          handleDashboardClick={handleDashboardClick}
          handleLoginClick={handleLoginClick}
          handleLogout={handleLogout}
          isUserMenuOpen={isUserMenuOpen}
          toggleUserMenu={toggleUserMenu}
          userMenuRef={userMenuRef}
        />
      </div>
    </nav>
  );
}

export default Navbar;