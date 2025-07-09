// src/middleware/validation.js
const { body, param, query } = require('express-validator');
const config = require('../config/config');

// Validations pour les utilisateurs
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('nom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('prenom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('motDePasse')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  body('role')
    .optional()
    .isIn(Object.values(config.ROLES))
    .withMessage('Rôle invalide')
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('motDePasse')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

const validateUserUpdate = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('nom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('prenom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('role')
    .optional()
    .isIn(Object.values(config.ROLES))
    .withMessage('Rôle invalide')
];

const validatePasswordChange = [
  body('motDePasseActuel')
    .notEmpty()
    .withMessage('Mot de passe actuel requis'),
  body('nouveauMotDePasse')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
];

// Validations pour les services
const validateService = [
  body('titre')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Le titre doit contenir entre 3 et 255 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('tarifBase')
    .isFloat({ min: 0 })
    .withMessage('Le tarif de base doit être un nombre positif'),
  body('exemples')
    .optional()
    .trim()
];

// Validations pour les projets
const validateProject = [
  body('titre')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Le titre doit contenir entre 3 et 255 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('statut')
    .optional()
    .isIn(config.STATUTS.PROJET)
    .withMessage('Statut invalide'),
  body('typeServiceId')
    .isInt({ min: 1 })
    .withMessage('ID du service invalide'),
  body('clientId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID du client invalide'),
  body('employeId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de l\'employé invalide')
];

// Validations pour les devis
const validateDevis = [
  body('nomDemandeur')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('prenomDemandeur')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('emailDemandeur')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('telephoneDemandeur')
    .optional()
    .isMobilePhone('fr-FR')
    .withMessage('Numéro de téléphone invalide'),
  body('budgetEstime')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Budget estimé requis'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('typeServiceId')
    .isInt({ min: 1 })
    .withMessage('ID du service invalide'),
  body('statut')
    .optional()
    .isIn(config.STATUTS.DEVIS)
    .withMessage('Statut invalide')
];

// Validations pour les avis
const validateAvis = [
  body('contenu')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Le contenu doit contenir au moins 10 caractères'),
  body('nomClient')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom du client doit contenir entre 2 et 100 caractères'),
  body('note')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
  body('projetId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID du projet invalide'),
  body('statut')
    .optional()
    .isIn(config.STATUTS.AVIS)
    .withMessage('Statut invalide')
];

// Validations pour les contacts
const validateContact = [
  body('nomVisiteur')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('prenomVisiteur')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('emailVisiteur')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('titre')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Le titre doit contenir entre 5 et 255 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('statut')
    .optional()
    .isIn(config.STATUTS.CONTACT)
    .withMessage('Statut invalide')
];

// Validations pour les réseaux sociaux
const validateReseauSocial = [
  body('plateforme')
    .isIn(config.PLATEFORMES)
    .withMessage('Plateforme invalide'),
  body('contenu')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le contenu est requis'),
  body('statut')
    .optional()
    .isIn(config.STATUTS.RESEAU_SOCIAL)
    .withMessage('Statut invalide'),
  body('datePublication')
    .optional()
    .isISO8601()
    .withMessage('Date de publication invalide'),
  body('projetId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID du projet invalide')
];

// Validations pour les paramètres d'URL
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID invalide')
];

// Validations pour les paramètres de requête
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100')
];

module.exports = {
  // Utilisateurs
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  
  // Services
  validateService,
  
  // Projets
  validateProject,
  
  // Devis
  validateDevis,
  
  // Avis
  validateAvis,
  
  // Contacts
  validateContact,
  
  // Réseaux sociaux
  validateReseauSocial,
  
  // Paramètres
  validateId,
  validatePagination
};