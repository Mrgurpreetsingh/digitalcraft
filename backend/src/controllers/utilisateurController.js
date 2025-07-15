const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

class UtilisateurController {
  // Récupérer tous les utilisateurs
  static async getAll(req, res) {
    try {
      const results = await executeQuery('SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur');
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Récupérer un utilisateur par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const results = await executeQuery('SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur WHERE idUtilisateur = ?', [id]);
      if (!results.length) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, data: results[0] });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Créer un nouvel utilisateur
  static async register(req, res) {
    try {
      const { email, nom, prenom, motDePasse, role } = req.body;
      
      if (!email || !nom || !prenom || !motDePasse) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
      }

      // Vérifier si l'email existe déjà
      const existingUser = await executeQuery('SELECT idUtilisateur FROM Utilisateur WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }

      const hashedPassword = await bcrypt.hash(motDePasse, 10);
      const result = await executeQuery(
        'INSERT INTO Utilisateur (email, nom, prenom, motDePasse, role) VALUES (?, ?, ?, ?, ?)', 
        [email, nom, prenom, hashedPassword, role || 'Visiteur']
      );
      
      res.status(201).json({ 
        success: true, 
        message: 'Utilisateur créé avec succès', 
        data: { id: result.insertId } 
      });
    } catch (error) {
      console.log('Erreur:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

// Méthode login améliorée avec plus de logs
static async login(req, res) {
  try {
    console.log('=== DEBUT LOGIN ===');
    console.log('Body reçu:', { ...req.body, motDePasse: '[MASQUÉ]' });
    console.log('Headers:', req.headers);
    
    const { email, motDePasse } = req.body;
    
    if (!email || !motDePasse) {
      console.log('❌ Champs manquants - email:', !!email, 'motDePasse:', !!motDePasse);
      return res.status(400).json({ 
        success: false, 
        message: 'Email et mot de passe requis' 
      });
    }
    
    console.log('🔍 Recherche utilisateur avec email:', email);
    const results = await executeQuery('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    
    if (!results.length) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    console.log('✅ Utilisateur trouvé:', results[0].email);
    const user = results[0];
    
    console.log('🔐 Vérification du mot de passe...');
    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
    
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    console.log('✅ Mot de passe valide');
    
    // Vérifier que JWT_SECRET est présent
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET non configuré');
      return res.status(500).json({
        success: false,
        message: 'Configuration serveur incorrecte'
      });
    }
    
    console.log('🎫 Génération du token JWT...');
    const token = jwt.sign(
      { id: user.idUtilisateur, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    console.log('✅ Token généré avec succès');
    console.log('Connexion réussie pour:', email);
    console.log('=== FIN LOGIN ===');
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: { 
        token, 
        user: { 
          id: user.idUtilisateur, 
          email: user.email, 
          nom: user.nom, 
          prenom: user.prenom, 
          role: user.role 
        } 
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans login:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
}
  // Récupérer le profil de l'utilisateur connecté
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const results = await executeQuery('SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur WHERE idUtilisateur = ?', [userId]);
      if (!results.length) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, data: results[0] });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Mettre à jour le profil de l'utilisateur connecté
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { email, nom, prenom } = req.body;
      const result = await executeQuery('UPDATE Utilisateur SET email = ?, nom = ?, prenom = ? WHERE idUtilisateur = ?', [email, nom, prenom, userId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Profil mis à jour avec succès' });
    } catch (error) {
      console.log('Erreur:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Changer le mot de passe de l'utilisateur connecté
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { ancienMotDePasse, nouveauMotDePasse } = req.body;
      if (!ancienMotDePasse || !nouveauMotDePasse) {
        return res.status(400).json({ success: false, message: 'Ancien et nouveau mot de passe requis' });
      }
      
      const results = await executeQuery('SELECT motDePasse FROM Utilisateur WHERE idUtilisateur = ?', [userId]);
      if (!results.length) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      
      const isOldPasswordValid = await bcrypt.compare(ancienMotDePasse, results[0].motDePasse);
      if (!isOldPasswordValid) {
        return res.status(401).json({ success: false, message: 'Ancien mot de passe incorrect' });
      }
      
      const hashedNewPassword = await bcrypt.hash(nouveauMotDePasse, 10);
      await executeQuery('UPDATE Utilisateur SET motDePasse = ? WHERE idUtilisateur = ?', [hashedNewPassword, userId]);
      res.json({ success: true, message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Modifier un utilisateur (admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { email, nom, prenom, role } = req.body;
      const result = await executeQuery('UPDATE Utilisateur SET email = ?, nom = ?, prenom = ?, role = ? WHERE idUtilisateur = ?', [email, nom, prenom, role, id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Utilisateur modifié avec succès' });
    } catch (error) {
      console.log('Erreur:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Supprimer un utilisateur
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await executeQuery('DELETE FROM Utilisateur WHERE idUtilisateur = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Obtenir les statistiques des utilisateurs
  static async getUserStats(req, res) {
    try {
      const results = await executeQuery(`
        SELECT 
          COUNT(*) as totalUtilisateurs,
          COUNT(CASE WHEN role = 'Administrateur' THEN 1 END) as totalAdmins,
          COUNT(CASE WHEN role = 'Visiteur' THEN 1 END) as totalVisiteurs,
          COUNT(CASE WHEN DATE(dateCreation) = CURDATE() THEN 1 END) as nouveauxAujourdhui
        FROM Utilisateur
      `);
      res.json({ success: true, data: results[0] });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Changer le rôle d'un utilisateur
  static async changeUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!role || !['Administrateur', 'Employé', 'Visiteur'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Rôle invalide. Doit être Administrateur, Employé ou Visiteur' });
      }
      const result = await executeQuery('UPDATE Utilisateur SET role = ? WHERE idUtilisateur = ?', [role, id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Rôle utilisateur modifié avec succès' });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = UtilisateurController;