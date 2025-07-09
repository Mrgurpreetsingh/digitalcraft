// src/models/devisModel.js
const { executeQuery } = require('../config/database');

class DevisModel {
  // Créer un devis
  static async create(devisData) {
    const { 
      numeroDevis, 
      nomDemandeur, 
      prenomDemandeur, 
      emailDemandeur, 
      telephoneDemandeur, 
      budgetEstime, 
      description, 
      statut = 'En attente', 
      typeServiceId 
    } = devisData;
    
    const query = `
      INSERT INTO Devis (numeroDevis, nomDemandeur, prenomDemandeur, emailDemandeur, telephoneDemandeur, 
                        budgetEstime, description, statut, typeServiceId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [
      numeroDevis, nomDemandeur, prenomDemandeur, emailDemandeur, telephoneDemandeur,
      budgetEstime, description, statut, typeServiceId
    ]);
    return result.insertId;
  }

  // Récupérer tous les devis
  static async getAll() {
    const query = `
      SELECT d.idDevis, d.numeroDevis, d.nomDemandeur, d.prenomDemandeur, 
             d.emailDemandeur, d.budgetEstime, d.description, d.statut, 
             d.dateCreation, s.titre as serviceNom
      FROM Devis d
      LEFT JOIN Service s ON d.typeServiceId = s.idService
      ORDER BY d.dateCreation DESC
    `;
    
    return await executeQuery(query);
  }

  // Récupérer un devis par ID
  static async getById(id) {
    const query = `
      SELECT d.idDevis, d.numeroDevis, d.nomDemandeur, d.prenomDemandeur,
             d.emailDemandeur, d.telephoneDemandeur, d.budgetEstime, 
             d.description, d.statut, d.dateCreation, d.reponseEmail,
             s.titre as serviceNom
      FROM Devis d
      LEFT JOIN Service s ON d.typeServiceId = s.idService
      WHERE d.idDevis = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result[0] || null;
  }

  // Mettre à jour un devis
  static async update(id, devisData) {
    const { statut, reponseEmail, employeId } = devisData;
    
    const query = `
      UPDATE Devis
      SET statut = ?, reponseEmail = ?, employeId = ?
      WHERE idDevis = ?
    `;
    
    const result = await executeQuery(query, [statut, reponseEmail, employeId, id]);
    return result.affectedRows > 0;
  }

  // Supprimer un devis
  static async delete(id) {
    const query = `
      DELETE FROM Devis
      WHERE idDevis = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Récupérer les devis par statut
  static async getByStatut(statut) {
    const query = `
      SELECT d.idDevis, d.numeroDevis, d.nomDemandeur, d.prenomDemandeur,
             d.emailDemandeur, d.budgetEstime, d.statut, d.dateCreation,
             s.titre as serviceNom
      FROM Devis d
      LEFT JOIN Service s ON d.typeServiceId = s.idService
      WHERE d.statut = ?
      ORDER BY d.dateCreation DESC
    `;
    
    return await executeQuery(query, [statut]);
  }

  // Générer un numéro de devis unique
  static async generateNumeroDevis() {
    const prefix = 'DEV';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const query = `
      SELECT COUNT(*) as count
      FROM Devis
      WHERE numeroDevis LIKE ?
    `;
    
    const pattern = `${prefix}${year}${month}%`;
    const result = await executeQuery(query, [pattern]);
    const count = result[0].count + 1;
    
    return `${prefix}${year}${month}${String(count).padStart(3, '0')}`;
  }
}

module.exports = DevisModel;