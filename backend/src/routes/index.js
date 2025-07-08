// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import des routes
const utilisateurRoutes = require('./utilisateurRoutes');
const serviceRoutes = require('./serviceRoutes');
const projetRoutes = require('./projetRoutes');
const devisRoutes = require('./devisRoutes');
const avisRoutes = require('./avisRoutes');
const contactRoutes = require('./contactRoutes');
const statistiqueRoutes = require('./statistiqueRoutes');
const reseauSocialRoutes = require('./reseauSocialRoutes');

// Configuration des routes
router.use('/utilisateurs', utilisateurRoutes);
router.use('/services', serviceRoutes);
router.use('/projets', projetRoutes);
router.use('/devis', devisRoutes);
router.use('/avis', avisRoutes);
router.use('/contacts', contactRoutes);
router.use('/statistiques', statistiqueRoutes);
router.use('/reseaux-sociaux', reseauSocialRoutes);

// Route d'information sur l'API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API DigitalCraft - Endpoints disponibles',
    endpoints: {
      utilisateurs: '/api/utilisateurs',
      services: '/api/services',
      projets: '/api/projets',
      devis: '/api/devis',
      avis: '/api/avis',
      contacts: '/api/contacts',
      statistiques: '/api/statistiques',
      reseaux_sociaux: '/api/reseaux-sociaux'
    },
    documentation: 'Consultez la documentation pour plus d\'informations'
  });
});

module.exports = router;