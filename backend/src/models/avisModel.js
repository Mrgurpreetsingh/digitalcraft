// src/models/avisModel.js
const { executeQuery } = require('../config/database');

class AvisModel {
  // Créer un avis
  static async create(avisData) {
    const { 
      numeroAvis, 
      contenu, 
      nomClient, 
      note, 
      statut = 'En attente', 
      projetId 
    } = avisData;
    
    const query = `
      INSERT INTO Avis (numeroAvis, contenu, nomClient, note, statut, projetId)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [numeroAvis, contenu, nomClient, note, statut, projetId]);
    return result.insertId;
  }

  // Récupérer tous les avis
  static async getAll() {
    const query = `
      SELECT a.idAvis, a.numeroAvis, a.contenu, a.nomClient, a.note, 
             a.statut, a.dateCreation, p.titre as projetTitre
      FROM Avis a
      LEFT JOIN Projet p ON a.projetId = p.idProjet
      ORDER BY a.dateCreation DESC
    `;
    
    return await executeQuery(query);
  }

  // Récupérer un avis par ID
  static async getById(id) {
    const query = `
      SELECT a.idAvis, a.numeroAvis, a.contenu, a.nomClient, a.note,
             a.statut, a.dateCreation, p.titre as projetTitre
      FROM Avis a
      LEFT JOIN Projet p ON a.projetId = p.idProjet
      WHERE a.idAvis = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result[0] || null;
  }

  // Mettre à jour un avis
  static async update(id, avisData) {
    const { contenu, nomClient, note, statut } = avisData;
    
    const query = `
      UPDATE Avis
      SET contenu = ?, nomClient = ?, note = ?, statut = ?
      WHERE idAvis = ?
    `;
    
    const result = await executeQuery(query, [contenu, nomClient, note, statut, id]);
    return result.affectedRows > 0;
  }

  // Supprimer un avis
  static async delete(id) {
    const query = `
      DELETE FROM Avis
      WHERE idAvis = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Récupérer les avis par statut
  static async getByStatut(statut) {
    const query = `
      SELECT a.idAvis, a.numeroAvis, a.contenu, a.nomClient, a.note,
             a.statut, a.dateCreation, p.titre as projetTitre
      FROM Avis a
      LEFT JOIN Projet p ON a.projetId = p.idProjet
      WHERE a.statut = ?
      ORDER BY a.dateCreation DESC
    `;
    
    return await executeQuery(query, [statut]);
  }

  // Récupérer les avis validés (pour affichage public)
  static async getValidated() {
    const query = `
      SELECT a.idAvis, a.contenu, a.nomClient, a.note, a.dateCreation,
             p.titre as projetTitre
      FROM Avis a
      LEFT JOIN Projet p ON a.projetId = p.idProjet
      WHERE a.statut = 'Validé'
      ORDER BY a.dateCreation DESC
    `;
    
    return await executeQuery(query);
  }

  // Générer un numéro d'avis unique
  static async generateNumeroAvis() {
    const prefix = 'AVIS';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const query = `
      SELECT COUNT(*) as count
      FROM Avis
      WHERE numeroAvis LIKE ?
    `;
    
    const pattern = `${prefix}${year}${month}%`;
    const result = await executeQuery(query, [pattern]);
    const count = result[0].count + 1;
    
    return `${prefix}${year}${month}${String(count).padStart(3, '0')}`;
  }
}

module.exports = AvisModel;