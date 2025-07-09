// src/models/projetModel.js
const { executeQuery } = require('../config/database');

class ProjetModel {
  // Créer un projet
  static async create(projetData) {
    const { titre, description, images, statut = 'En cours', typeServiceId, clientId, employeId } = projetData;
    
    const query = `
      INSERT INTO Projet (titre, description, images, statut, typeServiceId, clientId, employeId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [titre, description, images, statut, typeServiceId, clientId, employeId]);
    return result.insertId;
  }

  // Récupérer tous les projets
  static async getAll() {
    const query = `
      SELECT p.idProjet, p.titre, p.description, p.images, p.statut, p.dateCreation,
             s.titre as serviceNom,
             u1.nom as clientNom, u1.prenom as clientPrenom,
             u2.nom as employeNom, u2.prenom as employePrenom
      FROM Projet p
      LEFT JOIN Service s ON p.typeServiceId = s.idService
      LEFT JOIN Utilisateur u1 ON p.clientId = u1.idUtilisateur
      LEFT JOIN Utilisateur u2 ON p.employeId = u2.idUtilisateur
      ORDER BY p.dateCreation DESC
    `;
    
    return await executeQuery(query);
  }

  // Récupérer un projet par ID
  static async getById(id) {
    const query = `
      SELECT p.idProjet, p.titre, p.description, p.images, p.statut, p.dateCreation,
             s.titre as serviceNom,
             u1.nom as clientNom, u1.prenom as clientPrenom,
             u2.nom as employeNom, u2.prenom as employePrenom
      FROM Projet p
      LEFT JOIN Service s ON p.typeServiceId = s.idService
      LEFT JOIN Utilisateur u1 ON p.clientId = u1.idUtilisateur
      LEFT JOIN Utilisateur u2 ON p.employeId = u2.idUtilisateur
      WHERE p.idProjet = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result[0] || null;
  }

  // Mettre à jour un projet
  static async update(id, projetData) {
    const { titre, description, images, statut, typeServiceId, clientId, employeId } = projetData;
    
    const query = `
      UPDATE Projet
      SET titre = ?, description = ?, images = ?, statut = ?, typeServiceId = ?, clientId = ?, employeId = ?
      WHERE idProjet = ?
    `;
    
    const result = await executeQuery(query, [titre, description, images, statut, typeServiceId, clientId, employeId, id]);
    return result.affectedRows > 0;
  }

  // Supprimer un projet
  static async delete(id) {
    const query = `
      DELETE FROM Projet
      WHERE idProjet = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Récupérer les projets par statut
  static async getByStatut(statut) {
    const query = `
      SELECT p.idProjet, p.titre, p.description, p.statut, p.dateCreation,
             s.titre as serviceNom
      FROM Projet p
      LEFT JOIN Service s ON p.typeServiceId = s.idService
      WHERE p.statut = ?
      ORDER BY p.dateCreation DESC
    `;
    
    return await executeQuery(query, [statut]);
  }

  // Récupérer les projets d'un client
  static async getByClient(clientId) {
    const query = `
      SELECT p.idProjet, p.titre, p.description, p.statut, p.dateCreation,
             s.titre as serviceNom
      FROM Projet p
      LEFT JOIN Service s ON p.typeServiceId = s.idService
      WHERE p.clientId = ?
      ORDER BY p.dateCreation DESC
    `;
    
    return await executeQuery(query, [clientId]);
  }
}

module.exports = ProjetModel;