// src/middleware/errorHandler.js

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  console.error('❌ Erreur:', err);

  // Erreur de validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(error => error.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // Erreur de contrainte unique Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Ressource déjà existante';
    error = {
      message,
      statusCode: 409
    };
  }

  // Erreur de clé étrangère Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Référence invalide';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erreur de connexion à la base de données
  if (err.name === 'SequelizeConnectionError') {
    const message = 'Erreur de connexion à la base de données';
    error = {
      message,
      statusCode: 500
    };
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    error = {
      message,
      statusCode: 401
    };
  }

  // Erreur JWT expiré
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = {
      message,
      statusCode: 401
    };
  }

  // Erreur de cast (ID invalide)
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = {
      message,
      statusCode: 404
    };
  }

  // Erreur de syntaxe JSON
  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    const message = 'Format JSON invalide';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erreur de taille de fichier
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Fichier trop volumineux';
    error = {
      message,
      statusCode: 413
    };
  }

  // Erreur de type de fichier
  if (err.code === 'LIMIT_FILE_TYPE') {
    const message = 'Type de fichier non autorisé';
    error = {
      message,
      statusCode: 400
    };
  }

  // Réponse d'erreur
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware pour les erreurs asynchrones
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = errorHandler;
module.exports.asyncHandler = asyncHandler;