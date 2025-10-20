// src/contexts/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authAPI } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Vérifier la validité du token avec le backend
          const response = await authAPI.getProfile();
          if (response.data.success) {
            setIsAuthenticated(true);
            setUser(response.data.data);
          } else {
            // Token invalide, nettoyer le localStorage
            logout();
          }
        } catch (error) {
          console.error('Erreur de vérification du token:', error);
          // Token expiré ou invalide, nettoyer le localStorage
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    // Stocker les données de manière sécurisée
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    // Nettoyer toutes les données d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentPage');
    
    // Appeler l'API de logout si possible
    try {
      authAPI.logout();
    } catch (error) {
      console.error('Erreur lors du logout:', error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;