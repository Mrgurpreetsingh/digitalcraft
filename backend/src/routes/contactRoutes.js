// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { authenticateToken, requireEmployee } = require('../middleware/auth');
const { validationResult } = require('express-validator');
// TODO: Ajouter un vrai validateContact si besoin
// const { validateContact } = require('../middleware/validation');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  next();
};

// Créer un contact (public)
router.post('/', 
  // validateContact, // décommente si tu ajoutes la validation
  // handleValidationErrors, 
  ContactController.create
);

// Récupérer tous les contacts (admin/employé)
router.get('/', authenticateToken, requireEmployee, ContactController.getAll);

// Récupérer un contact par ID (admin/employé)
router.get('/:id', authenticateToken, requireEmployee, ContactController.getById);

// Mettre à jour un contact (admin/employé)
router.put('/:id', authenticateToken, requireEmployee, ContactController.update);

// Supprimer un contact (admin seulement)
router.delete('/:id', authenticateToken, requireEmployee, ContactController.delete);

// Récupérer les statistiques des contacts (admin/employé)
router.get('/stats/overview', authenticateToken, requireEmployee, ContactController.getStats);

module.exports = router;
