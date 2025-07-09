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
      SELECT idUtilisateur, email, nom, prenom, role, dateCreation
      FROM Utilisateur
      ORDER BY nom, prenom
    `;
    
    return await executeQuery(query);
  }

  // Récupérer un utilisateur par ID
  static async getById(id) {
    const query = `
      SELECT idUtilisateur, email, nom, prenom, role, dateCreation
      FROM Utilisateur
      WHERE idUtilisateur = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result[0] || null;
  }

  // Récupérer un utilisateur par email (pour login)
  static async getByEmail(email) {
    const query = `
      SELECT idUtilisateur, email, nom, prenom, motDePasse, role
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

  // Supprimer un utilisateur
  static async delete(id) {
    const query = `
      DELETE FROM Utilisateur
      WHERE idUtilisateur = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Vérifier si un email existe déjà
  static async emailExists(email) {
    const query = `
      SELECT COUNT(*) as count
      FROM Utilisateur
      WHERE email = ?
    `;
    
    const result = await executeQuery(query, [email]);
    return result[0].count > 0;
  }
}

module.exports = UtilisateurModel;