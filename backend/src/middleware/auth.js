// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const UtilisateurModel = require('../models/utilisateurModel');

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Vérifier si l'utilisateur existe encore
    const user = await UtilisateurModel.getById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non valide'
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
};

// Middleware pour vérifier les rôles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Privilèges insuffisants'
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est administrateur
const requireAdmin = requireRole(['Administrateur']);

// Middleware pour vérifier si l'utilisateur est employé ou admin
const requireEmployee = requireRole(['Employé', 'Administrateur']);

// Middleware pour vérifier si l'utilisateur peut accéder à la ressource
const requireOwnershipOrAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resourceId = req.params.id;
    const userRole = req.user.role;

    // Admin peut tout faire
    if (userRole === 'Administrateur') {
      return next();
    }

    // Employé peut accéder à ses propres ressources
    if (userRole === 'Employé' && userId.toString() === resourceId.toString()) {
      return next();
    }

    // Visiteur peut seulement accéder à ses propres ressources
    if (userRole === 'Visiteur' && userId.toString() === resourceId.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Accès refusé - Vous ne pouvez accéder qu\'à vos propres ressources'
    });
  } catch (error) {
    console.error('Erreur dans requireOwnershipOrAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireEmployee,
  requireOwnershipOrAdmin
};