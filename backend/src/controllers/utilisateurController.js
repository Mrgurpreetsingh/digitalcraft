// src/controllers/utilisateurController.js
const UtilisateurModel = require('../models/utilisateurModel');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { validationResult } = require('express-validator');

class UtilisateurController {
  // Connexion
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { email, motDePasse } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await UtilisateurModel.getByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await UtilisateurModel.verifyPassword(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          id: user.idUtilisateur, 
          email: user.email, 
          role: user.role 
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

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
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Inscription
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { email, nom, prenom, motDePasse, role } = req.body;

      // Vérifier si l'email existe déjà
      const emailExists = await UtilisateurModel.emailExists(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Cette adresse email est déjà utilisée'
        });
      }

      // Créer l'utilisateur
      const userId = await UtilisateurModel.create({
        email,
        nom,
        prenom,
        motDePasse,
        role: role || 'Visiteur'
      });

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: { id: userId }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer tous les utilisateurs
  static async getAll(req, res) {
    try {
      const users = await UtilisateurModel.getAll();
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer un utilisateur par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UtilisateurModel.getById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un utilisateur
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { email, nom, prenom, role } = req.body;

      // Vérifier si l'utilisateur existe
      const existingUser = await UtilisateurModel.getById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier si l'email n'est pas déjà utilisé par un autre utilisateur
      const emailExists = await UtilisateurModel.emailExists(email, id);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Cette adresse email est déjà utilisée'
        });
      }

      // Mettre à jour l'utilisateur
      const updated = await UtilisateurModel.update(id, {
        email,
        nom,
        prenom,
        role
      });

      if (updated) {
        res.json({
          success: true,
          message: 'Utilisateur mis à jour avec succès'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la mise à jour'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un utilisateur
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Vérifier si l'utilisateur existe
      const existingUser = await UtilisateurModel.getById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Supprimer l'utilisateur
      const deleted = await UtilisateurModel.delete(id);

      if (deleted) {
        res.json({
          success: true,
          message: 'Utilisateur supprimé avec succès'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la suppression'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Profil utilisateur (utilisateur connecté)
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UtilisateurModel.getById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Changer le mot de passe
  static async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { motDePasseActuel, nouveauMotDePasse } = req.body;

      // Récupérer l'utilisateur avec son mot de passe
      const user = await UtilisateurModel.getByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier l'ancien mot de passe
      const isCurrentPasswordValid = await UtilisateurModel.verifyPassword(motDePasseActuel, user.motDePasse);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }

      // Mettre à jour le mot de passe
      const updated = await UtilisateurModel.updatePassword(userId, nouveauMotDePasse);

      if (updated) {
        res.json({
          success: true,
          message: 'Mot de passe changé avec succès'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors du changement de mot de passe'
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = UtilisateurController;