// src/controllers/projetController.js
const mysql = require('mysql2');

// Configuration de la base de données (à adapter selon ta config)
const db = require('../config/database');

class ProjetController {
  
  // Récupérer tous les projets
  static async getAll(req, res) {
    try {
      const query = `
        SELECT 
          p.*, 
          s.titre as serviceTitre, 
          u1.nom as clientNom, 
          u1.prenom as clientPrenom,
          u2.nom as employeNom, 
          u2.prenom as employePrenom
        FROM Projet p
        LEFT JOIN Service s ON p.typeServiceId = s.idService
        LEFT JOIN Utilisateur u1 ON p.clientId = u1.idUtilisateur
        LEFT JOIN Utilisateur u2 ON p.employeId = u2.idUtilisateur
        ORDER BY p.dateCreation DESC
      `;
      
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

  // Récupérer un projet par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT 
          p.*, 
          s.titre as serviceTitre, 
          u1.nom as clientNom, 
          u1.prenom as clientPrenom,
          u2.nom as employeNom, 
          u2.prenom as employePrenom
        FROM Projet p
        LEFT JOIN Service s ON p.typeServiceId = s.idService
        LEFT JOIN Utilisateur u1 ON p.clientId = u1.idUtilisateur
        LEFT JOIN Utilisateur u2 ON p.employeId = u2.idUtilisateur
        WHERE p.idProjet = ?
      `;
      
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
            message: 'Projet non trouvé' 
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

  // Créer un nouveau projet
  static async create(req, res) {
    try {
      const { titre, description, images, statut, typeServiceId, clientId, employeId } = req.body;
      
      // Vérifications basiques
      if (!titre || !description || !typeServiceId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Titre, description et type de service sont obligatoires' 
        });
      }
      
      const query = 'INSERT INTO Projet (titre, description, images, statut, typeServiceId, clientId, employeId) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [titre, description, images, statut || 'En cours', typeServiceId, clientId, employeId];
      
      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
              success: false, 
              message: 'Ce titre de projet existe déjà' 
            });
          }
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        res.status(201).json({
          success: true,
          message: 'Projet créé avec succès',
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

  // Modifier un projet
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { titre, description, images, statut, typeServiceId, clientId, employeId } = req.body;
      
      const query = 'UPDATE Projet SET titre = ?, description = ?, images = ?, statut = ?, typeServiceId = ?, clientId = ?, employeId = ? WHERE idProjet = ?';
      const values = [titre, description, images, statut, typeServiceId, clientId, employeId, id];
      
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
            message: 'Projet non trouvé' 
          });
        }
        
        res.json({
          success: true,
          message: 'Projet modifié avec succès'
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

  // Supprimer un projet
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'DELETE FROM Projet WHERE idProjet = ?';
      
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
            message: 'Projet non trouvé' 
          });
        }
        
        res.json({
          success: true,
          message: 'Projet supprimé avec succès'
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

  // Récupérer les projets par statut
  static async getByStatut(req, res) {
    try {
      const { statut } = req.params;
      const query = `
        SELECT 
          p.*, 
          s.titre as serviceTitre, 
          u1.nom as clientNom, 
          u1.prenom as clientPrenom,
          u2.nom as employeNom, 
          u2.prenom as employePrenom
        FROM Projet p
        LEFT JOIN Service s ON p.typeServiceId = s.idService
        LEFT JOIN Utilisateur u1 ON p.clientId = u1.idUtilisateur
        LEFT JOIN Utilisateur u2 ON p.employeId = u2.idUtilisateur
        WHERE p.statut = ?
        ORDER BY p.dateCreation DESC
      `;
      
      db.query(query, [statut], (error, results) => {
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
}

module.exports = ProjetController;