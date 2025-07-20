// src/routes/avisRoutes.js
const express = require('express');
const router = express.Router();
const AvisController = require('../controllers/avisController');
const { authenticateToken, requireEmployee } = require('../middleware/auth');

// Récupérer tous les avis (public pour affichage)
router.get('/', AvisController.getAll);

// Récupérer un avis par ID (public)
router.get('/:id', AvisController.getById);

// Créer un avis (admin/employé)
router.post('/', authenticateToken, requireEmployee, AvisController.create);

// Modifier un avis (admin/employé)
router.put('/:id', authenticateToken, requireEmployee, AvisController.update);

// Supprimer un avis (admin seulement)
router.delete('/:id', authenticateToken, requireEmployee, AvisController.delete);

// Valider un avis (changer le statut) (admin/employé)
router.patch('/:id/validate', authenticateToken, requireEmployee, AvisController.validate);

// Récupérer les avis par statut (admin/employé)
router.get('/status/:status', authenticateToken, requireEmployee, AvisController.getByStatus);

// Récupérer les statistiques des avis (admin/employé)
router.get('/stats/overview', authenticateToken, requireEmployee, AvisController.getStats);

// DEBUG : Créer des avis de test dans MySQL (public pour debug)
router.post('/debug/create-test', AvisController.createTestAvis);

// DEBUG : Récupérer les avis Firebase uniquement (public pour debug)
router.get('/debug/firebase', AvisController.getFirebaseAvis);

// NOUVEAU : Synchroniser les avis Firebase avec MySQL (public temporaire pour debug)
router.post('/sync/firebase', AvisController.syncFromFirebase);

// NOUVEAU : Routes Firebase pour le dashboard admin (protégées)
router.patch('/firebase/:id/validate', authenticateToken, requireEmployee, AvisController.validateFirebaseAvis);
router.put('/firebase/:id', authenticateToken, requireEmployee, AvisController.updateFirebaseAvis);
router.delete('/firebase/:id', authenticateToken, requireEmployee, AvisController.deleteFirebaseAvis);

// NOUVEAU : Générer un token pour client (après projet terminé) - Admin seulement
router.post('/generate-token', authenticateToken, requireEmployee, AvisController.generateClientToken);

// NOUVEAU : Soumettre un avis avec token (pour clients réels) - Public
router.post('/submit-with-token', AvisController.submitWithToken);

module.exports = router;