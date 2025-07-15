const express = require('express');
const router = express.Router();
const UtilisateurController = require('../controllers/utilisateurController');

// Débogage
console.log('UtilisateurController:', UtilisateurController);
console.log('Methods available:', Object.getOwnPropertyNames(UtilisateurController));

const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateUserUpdate, 
  validatePasswordChange,
  validateId,
  validatePagination 
} = require('../middleware/validation');
const verifyCaptcha = require('../middleware/verifyCaptcha');

// Routes publiques
router.post('/register', validateUserRegistration, UtilisateurController.register);
router.post('/login', validateUserLogin, verifyCaptcha, UtilisateurController.login); // Ajoute verifyCaptcha

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