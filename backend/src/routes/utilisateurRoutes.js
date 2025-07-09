// src/routes/utilisateurRoutes.js
const express = require('express');
const router = express.Router();
const UtilisateurController = require('../controllers/utilisateurController');
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateUserUpdate, 
  validatePasswordChange,
  validateId,
  validatePagination 
} = require('../middleware/validation');

// Routes publiques
router.post('/register', validateUserRegistration, UtilisateurController.register);
router.post('/login', validateUserLogin, UtilisateurController.login);

// Routes protégées - utilisateur connecté
router.get('/profile', authenticateToken, UtilisateurController.getProfile);
router.put('/profile', authenticateToken, validateUserUpdate, UtilisateurController.updateProfile);
router.put('/change-password', authenticateToken, validatePasswordChange, UtilisateurController.changePassword);

// Routes protégées - administrateur uniquement
router.get('/', authenticateToken, requireAdmin, validatePagination, UtilisateurController.getAll);
router.get('/:id', authenticateToken, requireAdmin, validateId, UtilisateurController.getById);
router.put('/:id', authenticateToken, requireAdmin, validateId, validateUserUpdate, UtilisateurController.update);
router.delete('/:id', authenticateToken, requireAdmin, validateId, UtilisateurController.delete);

// Routes pour les statistiques
router.get('/stats/overview', authenticateToken, requireAdmin, UtilisateurController.getUserStats);

// Route pour changer le rôle d'un utilisateur
router.put('/:id/role', authenticateToken, requireAdmin, validateId, UtilisateurController.changeUserRole);

module.exports = router;