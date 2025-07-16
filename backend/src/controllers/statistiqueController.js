const db = require('../config/database');

class StatistiqueController {
  static async getOverview(req, res) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT p.idProjet) as nbProjets,
          COUNT(DISTINCT d.idDevis) as nbDevis,
          (COUNT(CASE WHEN d.statut = 'Accepté' THEN 1 END) / COUNT(d.idDevis) * 100) as tauxConversion
        FROM Projet p
        LEFT JOIN Devis d ON p.idProjet = d.projetId
      `;
      
      db.query(query, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
        
        res.json({
          success: true,
          data: results[0]
        });
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async getByProject(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT 
          COUNT(d.idDevis) as nbDevis,
          (COUNT(CASE WHEN d.statut = 'Accepté' THEN 1 END) / COUNT(d.idDevis) * 100) as tauxConversion
        FROM Devis d
        WHERE d.projetId = ?
      `;
      
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
        
        res.json({
          success: true,
          data: results[0] || { nbDevis: 0, tauxConversion: 0 }
        });
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = StatistiqueController;