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
const { body, validationResult } = require('express-validator');
const verifyCaptcha = require('../middleware/verifyCaptcha');

// Routes publiques
router.post('/register', validateUserRegistration, UtilisateurController.register);
router.post('/login', validateUserLogin, verifyCaptcha, UtilisateurController.login);

// Route admin pour créer des utilisateurs (sans reCAPTCHA)
router.post('/admin/create', authenticateToken, requireAdmin, [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('nom')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Nom contient des caractères non autorisés'),
  body('prenom')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Prénom contient des caractères non autorisés'),
  body('motDePasse')
    .isLength({ min: 12 }).withMessage('Mot de passe doit contenir au moins 12 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/).withMessage('Mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
  body('confirmationMotDePasse')
    .custom((value, { req }) => {
      if (value !== req.body.motDePasse) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    }),
  body('role')
    .isIn(['Employé', 'Administrateur']).withMessage('Rôle invalide')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation échouée', errors: errors.array() });
  }
  next();
}, UtilisateurController.createAdmin);

// Routes protégées - utilisateur connecté
router.get('/profile', authenticateToken, UtilisateurController.getProfile);
router.put('/profile', authenticateToken, validateUserUpdate, UtilisateurController.updateProfile);
router.put('/change-password', authenticateToken, validatePasswordChange, UtilisateurController.changePassword);

// Routes protégées - administrateur uniquement
router.get('/', authenticateToken, requireAdmin, validatePagination, (req, res, next) => {
  if (req.query.role && !['Administrateur', 'Employé', 'Visiteur'].includes(req.query.role)) {
    return res.status(400).json({ success: false, message: 'Rôle invalide' });
  }
  next();
}, UtilisateurController.getAll);
router.get('/employees-and-admins', authenticateToken, requireAdmin, UtilisateurController.getEmployeesAndAdmins);
router.get('/:id', authenticateToken, requireAdmin, validateId, UtilisateurController.getById);
router.put('/:id', authenticateToken, requireAdmin, validateId, [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('nom')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Nom contient des caractères non autorisés'),
  body('prenom')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Prénom contient des caractères non autorisés'),
  body('motDePasse')
    .optional()
    .isLength({ min: 12 }).withMessage('Mot de passe doit contenir au moins 12 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/).withMessage('Mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
  body('role')
    .isIn(['Employé', 'Administrateur']).withMessage('Rôle invalide')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation échouée', errors: errors.array() });
  }
  next();
}, UtilisateurController.update);
router.delete('/:id', authenticateToken, requireAdmin, validateId, UtilisateurController.delete);

// Routes pour les statistiques
router.get('/stats', authenticateToken, requireAdmin, UtilisateurController.getUserStats); // Unifié sous /stats

// Route pour changer le rôle d'un utilisateur
router.put('/:id/role', authenticateToken, requireAdmin, validateId, UtilisateurController.changeUserRole);

module.exports = router;