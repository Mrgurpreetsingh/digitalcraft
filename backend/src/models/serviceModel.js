// src/models/serviceModel.js
const { executeQuery } = require('../config/database');

class ServiceModel {
  // Récupérer tous les services
  static async getAll() {
    return await executeQuery('SELECT * FROM Service ORDER BY dateCreation DESC');
  }

  // Récupérer un service par ID
  static async getById(id) {
    const res = await executeQuery('SELECT * FROM Service WHERE idService = ?', [id]);
    return res[0] || null;
  }

  // Créer un service
  static async create({ titre, description, tarifBase, exemples }) {
    return await executeQuery(
      'INSERT INTO Service (titre, description, tarifBase, exemples) VALUES (?, ?, ?, ?)',
      [titre, description, tarifBase, exemples]
    );
  }

  // Mettre à jour un service
  static async update(id, { titre, description, tarifBase, exemples }) {
    return await executeQuery(
      'UPDATE Service SET titre=?, description=?, tarifBase=?, exemples=? WHERE idService=?',
      [titre, description, tarifBase, exemples, id]
    );
  }

  // Supprimer un service
  static async delete(id) {
    return await executeQuery('DELETE FROM Service WHERE idService = ?', [id]);
  }

  static async getActive() {
    return await executeQuery("SELECT * FROM Service WHERE statut = 'actif' ORDER BY dateCreation DESC");
  }
}

module.exports = ServiceModel;