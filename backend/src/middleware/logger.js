const { createLog } = require('../services/firebaseService');

/**
 * Middleware pour logger les actions sensibles
 * Utilisation: router.post('/route', logAction('CREATION_DEVIS'), controller)
 */
const logAction = (actionType, getPayload = null) => {
  return async (req, res, next) => {
    // Stocker l'action pour le logger après la réponse
    req.logAction = {
      action: actionType,
      user: req.user ? {
        idUtilisateur: req.user.idUtilisateur,
        email: req.user.email,
        role: req.user.role
      } : null,
      payload: getPayload ? getPayload(req) : {
        body: req.body,
        params: req.params,
        query: req.query
      },
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // Logger après la réponse (ne pas bloquer la requête)
    const originalSend = res.send;
    res.send = function(data) {
      // Appeler la méthode originale
      originalSend.apply(res, arguments);

      // Logger de manière asynchrone (ne pas attendre)
      if (req.logAction && res.statusCode < 400) {
        createLog(req.logAction).catch(err => {
          console.error('Erreur logging:', err.message);
        });
      }
    };

    next();
  };
};

/**
 * Logger les erreurs
 */
const logError = async (error, req) => {
  try {
    await createLog({
      action: 'ERROR',
      user: req.user ? {
        idUtilisateur: req.user.idUtilisateur,
        email: req.user.email,
        role: req.user.role
      } : null,
      payload: {
        error: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method
      },
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('Erreur log error:', err.message);
  }
};

module.exports = {
  logAction,
  logError
};
