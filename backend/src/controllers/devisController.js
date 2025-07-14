// src/controllers/devisController.js
const mysql = require('mysql2');
const DevisModel = require('../models/devisModel'); // à ajouter en haut

// Configuration de la base de données (à adapter selon ta config)
const db = require('../config/database');

class DevisController {
  
  // Récupérer tous les devis
  static async getAll(req, res) {
    try {
      const query = `
        SELECT 
          d.*, 
          s.titre as serviceTitre,
          u.nom as employeNom, 
          u.prenom as employePrenom
        FROM Devis d
        LEFT JOIN Service s ON d.typeServiceId = s.idService
        LEFT JOIN Utilisateur u ON d.employeId = u.idUtilisateur
        ORDER BY d.dateCreation DESC
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

  // Récupérer un devis par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT 
          d.*, 
          s.titre as serviceTitre,
          u.nom as employeNom, 
          u.prenom as employePrenom
        FROM Devis d
        LEFT JOIN Service s ON d.typeServiceId = s.idService
        LEFT JOIN Utilisateur u ON d.employeId = u.idUtilisateur
        WHERE d.idDevis = ?
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
            message: 'Devis non trouvé' 
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

  // Créer un nouveau devis
  static async create(req, res) {
    try {
      const { 
        nomDemandeur, 
        prenomDemandeur, 
        emailDemandeur, 
        telephoneDemandeur, 
        budgetEstime, 
        description, 
        typeServiceId,
        employeId
      } = req.body;
      
      // Vérifications basiques
      if (!nomDemandeur || !prenomDemandeur || !emailDemandeur || !budgetEstime || !description || !typeServiceId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tous les champs obligatoires doivent être remplis' 
        });
      }

      // Générer le numéro de devis unique
      const numeroDevis = await DevisModel.generateNumeroDevis();
      
      const query = `
        INSERT INTO Devis 
        (numeroDevis, nomDemandeur, prenomDemandeur, emailDemandeur, telephoneDemandeur, budgetEstime, description, typeServiceId, employeId, statut) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [numeroDevis, nomDemandeur, prenomDemandeur, emailDemandeur, telephoneDemandeur, budgetEstime, description, typeServiceId, employeId, 'En attente'];
      
      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
              success: false, 
              message: 'Ce numéro de devis existe déjà' 
            });
          }
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        res.status(201).json({
          success: true,
          message: 'Devis créé avec succès',
          data: { id: results.insertId, numeroDevis }
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

  // Mettre à jour un devis
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { statut } = req.body;

      if (!statut) {
        return res.status(400).json({ 
          success: false, 
          message: 'Le statut doit être spécifié' 
        });
      }

      const query = `
        UPDATE Devis SET statut = ? WHERE idDevis = ?
      `;
      const values = [statut, id];

      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        res.json({
          success: true,
          message: 'Devis mis à jour avec succès'
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

  // Supprimer un devis
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const query = `
        DELETE FROM Devis WHERE idDevis = ?
      `;
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        res.json({
          success: true,
          message: 'Devis supprimé avec succès'
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

module.exports = DevisController;
