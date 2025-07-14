const express = require('express');
const router = express.Router();

// Route de test
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Endpoint statistiques' });
});

module.exports = router;