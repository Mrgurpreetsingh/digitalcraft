// src/models/contactModel.js
const { executeQuery } = require('../config/database');

class ContactModel {
  // Créer un contact
  static async create(contactData) {
    const { 
      numeroContact, 
      nomVisiteur, 
      prenomVisiteur, 
      emailVisiteur, 
      titre, 
      description, 
      statut = 'En attente' 
    } = contactData;
    
    const query = `
      INSERT INTO Contact (numeroContact, nomVisiteur, prenomVisiteur, emailVisiteur, titre, description, statut)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [
      numeroContact, nomVisiteur, prenomVisiteur, emailVisiteur, titre, description, statut
    ]);
    return result.insertId;
  }

  // Récupérer tous les contacts
  static async getAll() {
    const query = `
      SELECT idContact, numeroContact, nomVisiteur, prenomVisiteur, emailVisiteur,
             titre, description, statut, dateCreation
      FROM Contact
      ORDER BY dateCreation DESC
    `;
    
    return await executeQuery(query);
  }

  // Récupérer un contact par ID
  static async getById(id) {
    const query = `
      SELECT idContact, numeroContact, nomVisiteur, prenomVisiteur, emailVisiteur,
             titre, description, statut, dateCreation, reponseEmail
      FROM Contact
      WHERE idContact = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result[0] || null;
  }

  // Mettre à jour un contact
  static async update(id, contactData) {
    const { statut, reponseEmail, employeId } = contactData;
    
    const query = `
      UPDATE Contact
      SET statut = ?, reponseEmail = ?, employeId = ?
      WHERE idContact = ?
    `;
    
    const result = await executeQuery(query, [statut, reponseEmail, employeId, id]);
    return result.affectedRows > 0;
  }

  // Supprimer un contact
  static async delete(id) {
    const query = `
      DELETE FROM Contact
      WHERE idContact = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Récupérer les contacts par statut
  static async getByStatut(statut) {
    const query = `
      SELECT idContact, numeroContact, nomVisiteur, prenomVisiteur, emailVisiteur,
             titre, description, statut, dateCreation
      FROM Contact
      WHERE statut = ?
      ORDER BY dateCreation DESC
    `;
    
    return await executeQuery(query, [statut]);
  }

  // Générer un numéro de contact unique
  static async generateNumeroContact() {
    const prefix = 'CON';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const query = `
      SELECT COUNT(*) as count
      FROM Contact
      WHERE numeroContact LIKE ?
    `;
    
    const pattern = `${prefix}${year}${month}%`;
    const result = await executeQuery(query, [pattern]);
    const count = result[0].count + 1;
    
    return `${prefix}${year}${month}${String(count).padStart(3, '0')}`;
  }
}

module.exports = ContactModel;