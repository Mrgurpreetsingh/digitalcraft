// src/models/serviceModel.js
const { executeQuery } = require('../config/database');

class ServiceModel {
  // Créer un service
  static async create(serviceData) {
    const { titre, description, tarifBase, exemples } = serviceData;
    
    const query = `
      INSERT INTO Service (titre, description, tarifBase, exemples)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [titre, description, tarifBase, exemples]);
    return result.insertId;
  }

  // Récupérer tous les services
  static async getAll() {
    const query = `
      SELECT idService, titre, description, tarifBase, exemples, dateCreation
      FROM Service
      ORDER BY titre
    `;
    
    return await executeQuery(query);
  }

  // Récupérer un service par ID
  static async getById(id) {
    const query = `
      SELECT idService, titre, description, tarifBase, exemples, dateCreation
      FROM Service
      WHERE idService = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result[0] || null;
  }

  // Mettre à jour un service
  static async update(id, serviceData) {
    const { titre, description, tarifBase, exemples } = serviceData;
    
    const query = `
      UPDATE Service
      SET titre = ?, description = ?, tarifBase = ?, exemples = ?
      WHERE idService = ?
    `;
    
    const result = await executeQuery(query, [titre, description, tarifBase, exemples, id]);
    return result.affectedRows > 0;
  }

  // Supprimer un service
  static async delete(id) {
    const query = `
      DELETE FROM Service
      WHERE idService = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Vérifier si un titre existe déjà
  static async titreExists(titre) {
    const query = `
      SELECT COUNT(*) as count
      FROM Service
      WHERE titre = ?
    `;
    
    const result = await executeQuery(query, [titre]);
    return result[0].count > 0;
  }
}

module.exports = ServiceModel;