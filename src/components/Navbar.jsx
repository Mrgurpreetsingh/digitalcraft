import React, { useState } from 'react';
import '../App.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'flex-end', gap: '16px', padding: 0 }}>
        <li><a href="/" style={{ color: '#1A1A1A', textDecoration: 'none' }}>Accueil</a></li>
        <li><a href="/services" style={{ color: '#1A1A1A', textDecoration: 'none' }}>Services</a></li>
        <li><a href="/portfolio" style={{ color: '#1A1A1A', textDecoration: 'none' }}>Portfolio</a></li>
        <li><a href="/contact" style={{ color: '#1A1A1A', textDecoration: 'none' }}>Contact</a></li>
        <li>
          <a href={isLoggedIn ? '/' : '/login'} style={{ color: '#1A1A1A', textDecoration: 'none' }} onClick={() => isLoggedIn && setIsLoggedIn(false)}>
            {isLoggedIn ? 'Déconnexion' : 'Connexion'}
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;