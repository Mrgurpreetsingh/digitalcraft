import React from 'react';
import './Button.css'; // Fichier CSS séparé pour le bouton

function Button({ children, onClick }) {
  return (
    <button className="cta-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;