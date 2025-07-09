// src/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');
const { validateService } = require('../middleware/validation');
const { authenticateToken, requireAdmin, requireEmployee } = require('../middleware/auth');
const { validationResult } = require('express-validator');

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

// Route publique - Récupérer tous les services (accessible à tous)
router.get('/', ServiceController.getAll);

// Route publique - Récupérer un service par ID (accessible à tous)
router.get('/:id', ServiceController.getById);

// Routes protégées - Création, modification et suppression (admin/employé seulement)
router.post('/', 
  authenticateToken, 
  requireEmployee, 
  validateService, 
  handleValidationErrors, 
  ServiceController.create
);

router.put('/:id', 
  authenticateToken, 
  requireEmployee, 
  validateService, 
  handleValidationErrors, 
  ServiceController.update
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  ServiceController.delete
);

module.exports = router;
