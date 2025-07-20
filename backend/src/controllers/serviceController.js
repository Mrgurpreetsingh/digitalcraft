// src/controllers/serviceController.js
const { executeQuery } = require('../config/database');
const ServiceModel = require('../models/serviceModel');

class ServiceController {
  // Récupérer tous les services
  static async getAll(req, res) {
    try {
      const results = await ServiceModel.getAll();
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Récupérer les services actifs (public)
  static async getActive(req, res) {
    try {
      const results = await ServiceModel.getActive();
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Récupérer un service par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const service = await ServiceModel.getById(id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service non trouvé' });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      console.error('Erreur lors de la récupération du service:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Créer un nouveau service
  static async create(req, res) {
    try {
      const { titre, description, tarifBase, exemples, statut } = req.body;
      if (!titre || !description || !tarifBase) {
        return res.status(400).json({ success: false, message: 'Titre, description et tarif sont obligatoires' });
      }
      const result = await executeQuery('INSERT INTO Service (titre, description, tarifBase, exemples, statut) VALUES (?, ?, ?, ?, ?)', [titre, description, tarifBase, exemples, statut || 'inactif']);
      const created = await executeQuery('SELECT * FROM Service WHERE idService = ?', [result.insertId]);
      res.status(201).json({ success: true, message: 'Service créé avec succès', data: created[0] });
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Ce titre de service existe déjà' });
      }
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Modifier un service
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { titre, description, tarifBase, exemples, statut } = req.body;
      const result = await executeQuery('UPDATE Service SET titre = ?, description = ?, tarifBase = ?, exemples = ?, statut = ? WHERE idService = ?', [titre, description, tarifBase, exemples, statut, id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Service non trouvé' });
      }
      const updated = await executeQuery('SELECT * FROM Service WHERE idService = ?', [id]);
      res.json({ success: true, message: 'Service modifié avec succès', data: updated[0] });
    } catch (error) {
      console.error('Erreur lors de la modification du service:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Supprimer un service
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await executeQuery('DELETE FROM Service WHERE idService = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Service non trouvé' });
      }
      res.json({ success: true, message: 'Service supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du service:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = ServiceController;