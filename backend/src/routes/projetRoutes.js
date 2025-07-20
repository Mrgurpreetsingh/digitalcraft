// src/routes/projetRoutes.js
const express = require('express');
const router = express.Router();
const ProjetController = require('../controllers/projetController');
const { authenticateToken, requireAdmin, requireEmployee } = require('../middleware/auth');
const { validationResult } = require('express-validator');
// TODO: Ajouter un vrai validateProjet si besoin
// const { validateProject } = require('../middleware/validation');

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

// Récupérer tous les projets (public)
router.get('/', ProjetController.getAll);

// Route pour les projets assignés à l'employé connecté
router.get('/assigned', authenticateToken, requireEmployee, ProjetController.getAssignedToEmployee);

// Récupérer un projet par ID (public)
router.get('/:id', ProjetController.getById);

// Récupérer les projets par statut (public)
router.get('/statut/:statut', ProjetController.getByStatut);

// Créer un projet (employé/admin)
router.post('/', 
  authenticateToken, 
  requireEmployee, 
  // validateProject, // décommente si tu ajoutes la validation
  // handleValidationErrors, 
  ProjetController.create
);

// Modifier un projet (employé/admin)
router.put('/:id', 
  authenticateToken, 
  requireEmployee, 
  // validateProject, // décommente si tu ajoutes la validation
  // handleValidationErrors, 
  ProjetController.update
);

// Supprimer un projet (admin)
router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  ProjetController.delete
);

module.exports = router;
