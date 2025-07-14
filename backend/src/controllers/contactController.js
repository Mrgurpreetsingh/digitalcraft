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
}

module.exports = ContactController;
