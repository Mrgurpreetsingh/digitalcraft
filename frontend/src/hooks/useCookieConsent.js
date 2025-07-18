import { useState, useEffect } from 'react';

const useCookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedConsent = localStorage.getItem('cookieConsent');
    const savedPreferences = localStorage.getItem('cookiePreferences');
    
    if (savedConsent) {
      setCookieConsent(savedConsent);
    }
    
    if (savedPreferences) {
      try {
        setCookiePreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Erreur lors du chargement des préférences de cookies:', error);
      }
    }
  }, []);

  const acceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    setCookieConsent('accepted');
    setCookiePreferences(preferences);
  };

  const rejectAll = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    setCookieConsent('rejected');
    setCookiePreferences(preferences);
  };

  const saveCustomPreferences = (preferences) => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    setCookieConsent('custom');
    setCookiePreferences(preferences);
  };

  const hasConsent = () => {
    return cookieConsent !== null;
  };

  const canUseAnalytics = () => {
    return cookiePreferences.analytics;
  };

  const canUseMarketing = () => {
    return cookiePreferences.marketing;
  };

  const canUsePreferences = () => {
    return cookiePreferences.preferences;
  };

  return {
    cookieConsent,
    cookiePreferences,
    acceptAll,
    rejectAll,
    saveCustomPreferences,
    hasConsent,
    canUseAnalytics,
    canUseMarketing,
    canUsePreferences
  };
};

export default useCookieConsent; 