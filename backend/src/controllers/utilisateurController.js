const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const verifyCaptcha = require('../middleware/verifyCaptcha'); // Importe le middleware
const { body, validationResult } = require('express-validator'); // Pour express-validator

class UtilisateurController {
  // Récupérer tous les utilisateurs (filtrable par rôle)
  static async getAll(req, res) {
    try {
      let query = 'SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur';
      const params = [];
      if (req.query.role) {
        query += ' WHERE role = ?';
        params.push(req.query.role);
      }
      const results = await executeQuery(query, params);
      res.json({ success: true, data: results });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Récupérer seulement les employés/admins
  static async getEmployeesAndAdmins(req, res) {
    try {
      const results = await executeQuery(
        'SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur WHERE role IN (?, ?) ORDER BY role DESC',
        ['Administrateur', 'Employé']
      );
      res.json({ success: true, data: results });
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

  // Créer un nouvel utilisateur (admin seulement, sans reCAPTCHA)
  static async createAdmin(req, res) {
    try {
      console.log('=== CRÉATION UTILISATEUR ADMIN ===');
      console.log('Admin:', req.user.email);
      console.log('Données reçues:', { 
        email: req.body.email, 
        nom: req.body.nom, 
        prenom: req.body.prenom, 
        role: req.body.role,
        motDePasse: '[MASQUÉ]'
      });

      const { email, nom, prenom, motDePasse, role } = req.body;

      // Vérifier si l'email existe déjà
      console.log('Vérification email existant...');
      const existingUser = await executeQuery('SELECT idUtilisateur FROM Utilisateur WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        console.log('❌ Email déjà existant:', email);
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }

      // Hasher le mot de passe
      console.log('Hashage du mot de passe...');
      const hashedPassword = await bcrypt.hash(motDePasse, 12); // Augmenté à 12 rounds

      // Insérer l'utilisateur
      console.log('Insertion en base de données...');
      const result = await executeQuery(
        'INSERT INTO Utilisateur (email, nom, prenom, motDePasse, role) VALUES (?, ?, ?, ?, ?)',
        [email, nom, prenom, hashedPassword, role]
      );
      
      console.log('✅ Utilisateur inséré, ID:', result.insertId);
      
      // Récupérer l'utilisateur créé pour le retourner
      const newUser = await executeQuery(
        'SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur WHERE idUtilisateur = ?',
        [result.insertId]
      );
      
      console.log('✅ Utilisateur créé avec succès:', newUser[0].email);
      console.log('=== FIN CRÉATION UTILISATEUR ADMIN ===');
      
      res.status(201).json({ 
        success: true, 
        message: 'Utilisateur créé avec succès', 
        data: newUser[0]
      });
    } catch (error) {
      console.error('❌ Erreur lors de la création admin:', error);
      console.error('Stack trace:', error.stack);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la création de l\'utilisateur',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Créer un nouvel utilisateur avec reCAPTCHA et validation
  static async register(req, res) {
    try {
      // Vérifie les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation échouée', errors: errors.array() });
      }

      const { email, nom, prenom, motDePasse, role } = req.body;

      const existingUser = await executeQuery('SELECT idUtilisateur FROM Utilisateur WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }

      let finalRole = 'Visiteur';
      if (req.user && req.user.role === 'Administrateur' && role && ['Administrateur', 'Employé'].includes(role)) {
        finalRole = role;
      }

      const hashedPassword = await bcrypt.hash(motDePasse, 10);
      const result = await executeQuery(
        'INSERT INTO Utilisateur (email, nom, prenom, motDePasse, role) VALUES (?, ?, ?, ?, ?)',
        [email, nom, prenom, hashedPassword, finalRole]
      );
      res.status(201).json({ success: true, message: 'Utilisateur créé', data: { id: result.insertId } });
    } catch (error) {
      console.log('Erreur:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Validation avec express-validator pour register
  static validateRegister = [
    body('email').isEmail().withMessage('Email invalide'),
    body('nom').notEmpty().withMessage('Nom requis'),
    body('prenom').notEmpty().withMessage('Prénom requis'),
    body('motDePasse').isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1
    }).withMessage('Mot de passe trop faible (8 caractères, majuscule, minuscule, chiffre)'),
    body('recaptchaToken').notEmpty().withMessage('Token reCAPTCHA requis')
  ];

  // Login (simplifié)
  static async login(req, res) {
    try {
      console.log('=== DEBUT LOGIN ===');
      console.log('Body reçu:', { email: '[MASQUÉ]', motDePasse: '[MASQUÉ]' });
      const { email, motDePasse } = req.body;
      if (!email || !motDePasse) {
        console.log('❌ Champs manquants');
        return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
      }
      const results = await executeQuery('SELECT * FROM Utilisateur WHERE email = ?', [email]);
      if (!results.length) {
        console.log('❌ Utilisateur non trouvé');
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        console.log('❌ Mot de passe incorrect');
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }
      if (!process.env.JWT_SECRET) {
        console.log('❌ JWT_SECRET non configuré');
        return res.status(500).json({ success: false, message: 'Configuration serveur incorrecte' });
      }
      const token = jwt.sign({ id: user.idUtilisateur, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '24h' });
      console.log('✅ Connexion réussie');
      console.log('=== FIN LOGIN ===');
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: { token, user: { id: user.idUtilisateur, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role } }
      });
    } catch (error) {
      console.error('❌ Erreur dans login:', error.message);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Récupérer le profil
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

  // Mettre à jour le profil
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { email, nom, prenom } = req.body;
      const result = await executeQuery('UPDATE Utilisateur SET email = ?, nom = ?, prenom = ? WHERE idUtilisateur = ?', [email, nom, prenom, userId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Profil mis à jour' });
    } catch (error) {
      console.log('Erreur:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Changer le mot de passe
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
      res.json({ success: true, message: 'Mot de passe modifié' });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Modifier un utilisateur (admin)
  static async update(req, res) {
    try {
      console.log('=== MODIFICATION UTILISATEUR ===');
      console.log('Admin:', req.user.email);
      console.log('ID utilisateur à modifier:', req.params.id);
      console.log('Données reçues:', { 
        email: req.body.email, 
        nom: req.body.nom, 
        prenom: req.body.prenom, 
        role: req.body.role,
        motDePasse: req.body.motDePasse ? '[MASQUÉ]' : 'Non fourni'
      });

      const { id } = req.params;
      const { email, nom, prenom, role, motDePasse } = req.body;

      // Vérifier si l'utilisateur existe
      const existingUser = await executeQuery('SELECT idUtilisateur FROM Utilisateur WHERE idUtilisateur = ?', [id]);
      if (existingUser.length === 0) {
        console.log('❌ Utilisateur non trouvé');
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      // Vérifier si l'email existe déjà (sauf pour l'utilisateur actuel)
      if (email) {
        const emailExists = await executeQuery('SELECT idUtilisateur FROM Utilisateur WHERE email = ? AND idUtilisateur != ?', [email, id]);
        if (emailExists.length > 0) {
          console.log('❌ Email déjà existant:', email);
          return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
        }
      }

      // Construire la requête de mise à jour
      let updateQuery = 'UPDATE Utilisateur SET email = ?, nom = ?, prenom = ?, role = ?';
      let updateParams = [email, nom, prenom, role];

      // Ajouter le mot de passe si fourni
      if (motDePasse) {
        console.log('Hashage du nouveau mot de passe...');
        const hashedPassword = await bcrypt.hash(motDePasse, 12);
        updateQuery += ', motDePasse = ?';
        updateParams.push(hashedPassword);
      }

      updateQuery += ' WHERE idUtilisateur = ?';
      updateParams.push(id);

      // Exécuter la mise à jour
      console.log('Mise à jour en base de données...');
      const result = await executeQuery(updateQuery, updateParams);
      
      if (result.affectedRows === 0) {
        console.log('❌ Aucune modification effectuée');
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      // Récupérer l'utilisateur mis à jour
      const updatedUser = await executeQuery(
        'SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur WHERE idUtilisateur = ?',
        [id]
      );
      
      console.log('✅ Utilisateur modifié avec succès:', updatedUser[0].email);
      console.log('=== FIN MODIFICATION UTILISATEUR ===');
      
      res.json({ 
        success: true, 
        message: 'Utilisateur modifié avec succès', 
        data: updatedUser[0]
      });
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      console.error('Stack trace:', error.stack);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Cet email existe déjà' });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la modification de l\'utilisateur',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Supprimer un utilisateur (admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      if (req.user.role !== 'Administrateur') {
        return res.status(403).json({ success: false, message: 'Accès refusé. Seuls les admins peuvent supprimer' });
      }
      const result = await executeQuery('DELETE FROM Utilisateur WHERE idUtilisateur = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Supprimer son propre compte
  static async deleteSelf(req, res) {
    try {
      const userId = req.user.id;
      const result = await executeQuery('DELETE FROM Utilisateur WHERE idUtilisateur = ?', [userId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Compte supprimé' });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  // Statistiques
  static async getUserStats(req, res) {
    try {
      const results = await executeQuery(`
        SELECT 
          COUNT(*) as totalUtilisateurs,
          COUNT(CASE WHEN role = 'Administrateur' THEN 1 END) as totalAdmins,
          COUNT(CASE WHEN role = 'Employé' THEN 1 END) as totalEmployes,
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

  // Changer le rôle (admin seulement)
  static async changeUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (req.user.role !== 'Administrateur') {
        return res.status(403).json({ success: false, message: 'Accès refusé. Seuls les admins peuvent changer les rôles' });
      }
      if (!role || !['Administrateur', 'Employé', 'Visiteur'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Rôle invalide' });
      }
      const result = await executeQuery('UPDATE Utilisateur SET role = ? WHERE idUtilisateur = ?', [role, id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.json({ success: true, message: 'Rôle modifié' });
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

module.exports = UtilisateurController;