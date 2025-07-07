import React, { useState } from 'react';
import '../styles/Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav>
      <ul>
        <li><a href="/">Accueil</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/portfolio">Portfolio</a></li>
        <li><a href="/contact">Contact</a></li>
        <li>
          <a href={isLoggedIn ? '/' : '/connexion'} onClick={() => isLoggedIn && setIsLoggedIn(false)}>
            {isLoggedIn ? 'Déconnexion' : 'Connexion'}
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;