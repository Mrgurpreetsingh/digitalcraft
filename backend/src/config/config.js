// src/config/config.js
require('dotenv').config();

const config = {
  // Configuration serveur
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuration JWT
  JWT_SECRET: process.env.JWT_SECRET || 'digitalcraft_secret_key_2025',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Configuration base de données
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'digitalcraft',
  
  // Configuration CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Configuration upload
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '5MB',
  
  // Configuration email (pour plus tard)
  EMAIL_HOST: process.env.EMAIL_HOST || '',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  
  // Configuration rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // 100 requêtes par fenêtre
  
  // Rôles utilisateur
  ROLES: {
    VISITEUR: 'Visiteur',
    EMPLOYE: 'Employé',
    ADMINISTRATEUR: 'Administrateur'
  },
  
  // Statuts des entités
  STATUTS: {
    PROJET: ['En cours', 'Terminé', 'Annulé'],
    DEVIS: ['En attente', 'Validé', 'Rejeté', 'En traitement'],
    AVIS: ['En attente', 'Validé', 'Rejeté'],
    CONTACT: ['En attente', 'Traité', 'Fermé'],
    RESEAU_SOCIAL: ['Brouillon', 'Publié', 'Programmé']
  },
  
  // Plateformes réseaux sociaux
  PLATEFORMES: ['Facebook', 'Instagram', 'LinkedIn', 'Twitter']
};

module.exports = config;