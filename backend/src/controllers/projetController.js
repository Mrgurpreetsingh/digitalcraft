// src/controllers/projetController.js
const { executeQuery } = require('../config/database');

class ProjetController {
  // Récupérer tous les projets
  static async getAll(req, res) {
    try {
      let query = `
        SELECT p.*, s.titre as serviceTitre, u1.nom as clientNom, u1.prenom as clientPrenom,
          u2.nom as employeNom, u2.prenom as employePrenom
        FROM Projet p
        LEFT JOIN Service s ON p.typeServiceId = s.idService
        LEFT JOIN Utilisateur u1 ON p.clientId = u1.idUtilisateur
        LEFT JOIN Utilisateur u2 ON p.employeId = u2.idUtilisateur
      `;
      const params = [];
      if (req.query.statut) {
        query += ' WHERE p.statut = ?';
        params.push(req.query.statut);
      }
      query += ' ORDER BY p.dateCreation DESC';
      const results = await executeQuery(query, params);
      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Erreur SQL:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
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
      const results = await executeQuery(query, [id]);
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Projet non trouvé' });
      }
      res.json({ success: true, data: results[0] });
    } catch (error) {
      console.error('Erreur SQL:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Créer un nouveau projet
  static async create(req, res) {
    try {
      const { titre, description, images, statut, typeServiceId, clientId, employeId } = req.body;
      if (!titre || !description || !typeServiceId) {
        return res.status(400).json({ success: false, message: 'Titre, description et type de service sont obligatoires' });
      }
      const query = 'INSERT INTO Projet (titre, description, images, statut, typeServiceId, clientId, employeId) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [titre, description, images || null, statut || 'En cours', typeServiceId, clientId || null, employeId || null];
      const result = await executeQuery(query, values);
      res.status(201).json({ success: true, message: 'Projet créé', data: { id: result.insertId } });
    } catch (error) {
      console.error('Erreur SQL:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Titre de projet déjà existant' });
      }
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Modifier un projet
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { titre, description, images, statut, typeServiceId, clientId, employeId } = req.body;
      const query = 'UPDATE Projet SET titre = ?, description = ?, images = ?, statut = ?, typeServiceId = ?, clientId = ?, employeId = ? WHERE idProjet = ?';
      const values = [titre, description, images, statut, typeServiceId, clientId, employeId, id];
      const result = await executeQuery(query, values);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Projet non trouvé' });
      }
      res.json({ success: true, message: 'Projet modifié' });
    } catch (error) {
      console.error('Erreur SQL:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Supprimer un projet
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await executeQuery('DELETE FROM Projet WHERE idProjet = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Projet non trouvé' });
      }
      res.json({ success: true, message: 'Projet supprimé' });
    } catch (error) {
      console.error('Erreur SQL:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
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
      const results = await executeQuery(query, [statut]);
      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Erreur SQL:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = ProjetController;