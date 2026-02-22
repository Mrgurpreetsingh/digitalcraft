const express = require('express');
const router = express.Router();
const { getLogs, deleteOldLogs } = require('../services/firebaseService');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/logs
 * @desc    Récupérer les logs avec filtres (admin seulement)
 * @access  Private (Admin)
 */
router.get('/', protect, authorize('Administrateur'), async (req, res) => {
  try {
    const { action, userId, dateDebut, dateFin, limit } = req.query;

    const filters = {};
    if (action) filters.action = action;
    if (userId) filters.userId = userId;
    if (dateDebut) filters.dateDebut = dateDebut;
    if (dateFin) filters.dateFin = dateFin;

    const logs = await getLogs(filters, parseInt(limit) || 100);

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Erreur GET /api/logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logs'
    });
  }
});

/**
 * @route   DELETE /api/logs/cleanup
 * @desc    Supprimer les logs de plus de X jours (RGPD)
 * @access  Private (Admin)
 */
router.delete('/cleanup', protect, authorize('Administrateur'), async (req, res) => {
  try {
    const { days } = req.query;
    const deletedCount = await deleteOldLogs(parseInt(days) || 90);

    res.json({
      success: true,
      message: `${deletedCount} logs supprimés`,
      deletedCount
    });
  } catch (error) {
    console.error('Erreur DELETE /api/logs/cleanup:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression des logs'
    });
  }
});

/**
 * @route   GET /api/logs/stats
 * @desc    Statistiques sur les logs
 * @access  Private (Admin)
 */
router.get('/stats', protect, authorize('Administrateur'), async (req, res) => {
  try {
    const logs = await getLogs({}, 1000);

    // Grouper par action
    const actionsCount = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    // Grouper par utilisateur
    const usersCount = logs.reduce((acc, log) => {
      if (log.user?.email) {
        acc[log.user.email] = (acc[log.user.email] || 0) + 1;
      }
      return acc;
    }, {});

    res.json({
      success: true,
      stats: {
        total: logs.length,
        actions: actionsCount,
        users: usersCount,
        dernierLog: logs[0] || null
      }
    });
  } catch (error) {
    console.error('Erreur GET /api/logs/stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router;
