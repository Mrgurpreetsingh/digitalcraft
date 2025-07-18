import React, { useState, useEffect } from 'react';
import useCookieConsent from '../hooks/useCookieConsent';
import '../styles/CookieBanner.css';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { hasConsent, acceptAll, rejectAll } = useCookieConsent();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    if (!hasConsent()) {
      setIsVisible(true);
    }
  }, [hasConsent]);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <p>
          Ce site utilise des cookies pour améliorer votre expérience. 
          <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer">
            En savoir plus
          </a>
        </p>
        
        <div className="cookie-banner-actions">
          <button 
            className="cookie-btn cookie-btn-reject"
            onClick={handleRejectAll}
          >
            Refuser
          </button>
          <button 
            className="cookie-btn cookie-btn-accept"
            onClick={handleAcceptAll}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner; 