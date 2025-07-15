const express = require('express');
const router = express.Router();
const StatistiqueController = require('../controllers/statistiqueController'); // À créer

const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Récupérer les statistiques générales
router.get('/overview', authenticateToken, requireAdmin, StatistiqueController.getOverview);

// Récupérer les statistiques par projet (exemple)
router.get('/projet/:id', authenticateToken, requireAdmin, StatistiqueController.getByProject);

module.exports = router;