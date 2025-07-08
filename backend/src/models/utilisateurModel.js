// src/models/utilisateurModel.js
const { executeQuery } = require('../config/database');
const bcrypt = require('bcrypt');

class UtilisateurModel {
  // Créer un utilisateur
  static async create(userData) {
    const { email, nom, prenom, motDePasse, role = 'Visiteur' } = userData;
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    
    const query = `
      INSERT INTO Utilisateur (email, nom, prenom, motDePasse, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [email, nom, prenom, hashedPassword, role]);
    return result.insertId;
  }

  // Récupérer tous les utilisateurs
  static async getAll() {
    const query = `
      SELECT idUtilisateur, email, nom, prenom, role, dateCreation, dateMaj
      FROM Utilisateur
      ORDER BY dateCreation DESC
    `;
    
    return await executeQuery(query);
  }

  // Récupérer un utilisateur par ID
  static async getById(id) {
    const query = `
      SELECT idUtilisateur, email, nom, prenom, role, dateCreation, dateMaj
      FROM Utilisateur
      WHERE idUtilisateur = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result[0] || null;
  }

  // Récupérer un utilisateur par email (avec mot de passe pour login)
  static async getByEmail(email) {
    const query = `
      SELECT idUtilisateur, email, nom, prenom, motDePasse, role, dateCreation, dateMaj
      FROM Utilisateur
      WHERE email = ?
    `;
    
    const result = await executeQuery(query, [email]);
    return result[0] || null;
  }

  // Mettre à jour un utilisateur
  static async update(id, userData) {
    const { email, nom, prenom, role } = userData;
    
    const query = `
      UPDATE Utilisateur
      SET email = ?, nom = ?, prenom = ?, role = ?
      WHERE idUtilisateur = ?
    `;
    
    const result = await executeQuery(query, [email, nom, prenom, role, id]);
    return result.affectedRows > 0;
  }

  // Mettre à jour le mot de passe
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = `
      UPDATE Utilisateur
      SET motDePasse = ?
      WHERE idUtilisateur = ?
    `;
    
    const result = await executeQuery(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  // Supprimer un utilisateur
  static async delete(id) {
    const query = `
      DELETE FROM Utilisateur
      WHERE idUtilisateur = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Vérifier si un email existe
  static async emailExists(email, excludeId = null) {
    let query = `
      SELECT COUNT(*) as count
      FROM Utilisateur
      WHERE email = ?
    `;
    
    let params = [email];
    
    if (excludeId) {
      query += ` AND idUtilisateur != ?`;
      params.push(excludeId);
    }
    
    const result = await executeQuery(query, params);
    return result[0].count > 0;
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Récupérer les utilisateurs par rôle
  static async getByRole(role) {
    const query = `
      SELECT idUtilisateur, email, nom, prenom, role, dateCreation, dateMaj
      FROM Utilisateur
      WHERE role = ?
      ORDER BY nom, prenom
    `;
    
    return await executeQuery(query, [role]);
  }

  // Statistiques utilisateurs
  static async getStats() {
    const query = `
      SELECT 
        role,
        COUNT(*) as nombre,
        MAX(dateCreation) as dernierInscrit
      FROM Utilisateur
      GROUP BY role
    `;
    
    return await executeQuery(query);
  }
}

module.exports = UtilisateurModel;