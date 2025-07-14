// src/routes/devisRoutes.js
const express = require('express');
const router = express.Router();
const DevisController = require('../controllers/devisController');
const { authenticateToken, requireAdmin, requireEmployee } = require('../middleware/auth');
const { validationResult } = require('express-validator');
// TODO: Ajouter un vrai validateDevis si besoin
// const { validateDevis } = require('../middleware/validation');

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

// Récupérer tous les devis (admin/employé)
router.get('/', authenticateToken, requireEmployee, DevisController.getAll);

// Récupérer un devis par ID (admin/employé)
router.get('/:id', authenticateToken, requireEmployee, DevisController.getById);

// Créer un devis (public)
router.post('/', 
  // validateDevis, // décommente si tu ajoutes la validation
  // handleValidationErrors, 
  DevisController.create
);

// Modifier un devis (admin/employé)
router.put('/:id', 
  authenticateToken, 
  requireEmployee, 
  // validateDevis, // décommente si tu ajoutes la validation
  // handleValidationErrors, 
  DevisController.update
);

// Supprimer un devis (admin)
router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  DevisController.delete
);

module.exports = router;
