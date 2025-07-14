// src/controllers/serviceController.js
const mysql = require('mysql2');

// Configuration de la base de données (à adapter selon ta config)
const db = require('../config/database');

class ServiceController {
  
  // Récupérer tous les services
  static async getAll(req, res) {
    try {
      const query = 'SELECT * FROM Service ORDER BY dateCreation DESC';
      
      db.query(query, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        res.json({
          success: true,
          data: results
        });
      });
      
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  // Récupérer un service par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM Service WHERE idService = ?';
      
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Service non trouvé' 
          });
        }
        
        res.json({
          success: true,
          data: results[0]
        });
      });
      
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  // Créer un nouveau service
  static async create(req, res) {
    try {
      const { titre, description, tarifBase, exemples } = req.body;
      
      // Vérifications basiques
      if (!titre || !description || !tarifBase) {
        return res.status(400).json({ 
          success: false, 
          message: 'Titre, description et tarif sont obligatoires' 
        });
      }
      
      const query = 'INSERT INTO Service (titre, description, tarifBase, exemples) VALUES (?, ?, ?, ?)';
      const values = [titre, description, tarifBase, exemples];
      
      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
              success: false, 
              message: 'Ce titre de service existe déjà' 
            });
          }
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        res.status(201).json({
          success: true,
          message: 'Service créé avec succès',
          data: { id: results.insertId }
        });
      });
      
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  // Modifier un service
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { titre, description, tarifBase, exemples } = req.body;
      
      const query = 'UPDATE Service SET titre = ?, description = ?, tarifBase = ?, exemples = ? WHERE idService = ?';
      const values = [titre, description, tarifBase, exemples, id];
      
      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        if (results.affectedRows === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Service non trouvé' 
          });
        }
        
        res.json({
          success: true,
          message: 'Service modifié avec succès'
        });
      });
      
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  // Supprimer un service
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'DELETE FROM Service WHERE idService = ?';
      
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        if (results.affectedRows === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Service non trouvé' 
          });
        }
        
        res.json({
          success: true,
          message: 'Service supprimé avec succès'
        });
      });
      
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }
}

module.exports = ServiceController;