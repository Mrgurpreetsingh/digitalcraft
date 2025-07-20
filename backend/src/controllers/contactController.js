// src/controllers/contactController.js
const ContactModel = require('../models/contactModel');

class ContactController {
  // Créer un contact
  static async create(req, res) {
    try {
      const { nomVisiteur, prenomVisiteur, emailVisiteur, titre, description } = req.body;
      if (!nomVisiteur || !prenomVisiteur || !emailVisiteur || !titre || !description) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs obligatoires doivent être remplis'
        });
      }
      // Générer le numéro de contact unique
      const numeroContact = await ContactModel.generateNumeroContact();
      const contactData = {
        numeroContact,
        nomVisiteur,
        prenomVisiteur,
        emailVisiteur,
        titre,
        description
      };
      const id = await ContactModel.create(contactData);
      res.status(201).json({
        success: true,
        message: 'Message de contact envoyé avec succès',
        data: { id, numeroContact }
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Récupérer tous les contacts (pour l'admin)
  static async getAll(req, res) {
    try {
      const contacts = await ContactModel.getAll();
      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Récupérer un contact par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const contact = await ContactModel.getById(id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact non trouvé'
        });
      }
      res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Mettre à jour un contact (marquer comme traité, ajouter des notes)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { statut, notes, employeId } = req.body;
      
      // Vérifier que le contact existe
      const existingContact = await ContactModel.getById(id);
      if (!existingContact) {
        return res.status(404).json({
          success: false,
          message: 'Contact non trouvé'
        });
      }

      // Mettre à jour le contact
      const updateData = {};
      if (statut) updateData.statut = statut;
      if (notes !== undefined) updateData.notes = notes;
      if (employeId) updateData.employeId = employeId;

      const result = await ContactModel.update(id, updateData);
      
      res.json({
        success: true,
        message: 'Contact mis à jour avec succès',
        data: { id }
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Supprimer un contact
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Vérifier que le contact existe
      const existingContact = await ContactModel.getById(id);
      if (!existingContact) {
        return res.status(404).json({
          success: false,
          message: 'Contact non trouvé'
        });
      }

      // Supprimer le contact
      await ContactModel.delete(id);
      
      res.json({
        success: true,
        message: 'Contact supprimé avec succès'
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Récupérer les statistiques des contacts
  static async getStats(req, res) {
    try {
      const stats = await ContactModel.getStats();
      res.json({
        success: true,
        data: stats
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

module.exports = ContactController;
