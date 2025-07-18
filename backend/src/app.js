// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import des routes
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Création de l'application Express
const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Middleware CORS
app.use(cors(corsOptions));

// Middleware de logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting - Configuration différente selon l'environnement
const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 60 * 1000, // 15 min en prod, 1 min en dev
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 en prod, 1000 en dev
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Ajouter plus d'infos dans les logs
  handler: (req, res, next, options) => {
    console.log(`Rate limit atteinte pour IP: ${req.ip}, URL: ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  }
});

// Rate limiting spécifique pour login (plus restrictif)
const loginLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 2 * 60 * 1000, // 15 min en prod, 2 min en dev
  max: process.env.NODE_ENV === 'production' ? 5 : 20, // 5 en prod, 20 en dev
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les échecs
  handler: (req, res, next, options) => {
    console.log(`Login rate limit atteinte pour IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  }
});

// Appliquer le rate limiting général
app.use('/api/', limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DigitalCraft Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Rate limiting spécifique pour les routes de login
app.use('/api/utilisateurs/login', loginLimiter);

// Routes API
app.use('/api', routes);

// Route 404 pour les endpoints non trouvés
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} non trouvé`
  });
});

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;