// src/middleware/csrf.js
const crypto = require('crypto');

class CSRFProtection {
  constructor() {
    this.tokens = new Map();
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 1000 * 60 * 60); // Nettoyage toutes les heures
  }

  // Générer un token CSRF
  generateToken(sessionId) {
    const token = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    this.tokens.set(token, {
      sessionId,
      timestamp,
      used: false
    });
    
    return token;
  }

  // Vérifier un token CSRF
  verifyToken(token, sessionId) {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) {
      return { valid: false, reason: 'Token invalide' };
    }
    
    if (tokenData.sessionId !== sessionId) {
      return { valid: false, reason: 'Session invalide' };
    }
    
    if (tokenData.used) {
      return { valid: false, reason: 'Token déjà utilisé' };
    }
    
    // Token expiré après 1 heure
    if (Date.now() - tokenData.timestamp > 1000 * 60 * 60) {
      this.tokens.delete(token);
      return { valid: false, reason: 'Token expiré' };
    }
    
    // Marquer le token comme utilisé
    tokenData.used = true;
    
    return { valid: true };
  }

  // Nettoyer les tokens expirés
  cleanup() {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (now - data.timestamp > 1000 * 60 * 60) { // 1 heure
        this.tokens.delete(token);
      }
    }
  }

  // Middleware pour générer le token CSRF
  generateTokenMiddleware(req, res, next) {
    if (!req.session) {
      return res.status(500).json({
        success: false,
        message: 'Session non disponible'
      });
    }

    const token = this.generateToken(req.session.id);
    res.locals.csrfToken = token;
    next();
  }

  // Middleware pour vérifier le token CSRF
  verifyTokenMiddleware(req, res, next) {
    // Skip CSRF pour les méthodes GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const token = req.headers['x-csrf-token'] || req.body._csrf;
    
    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'Token CSRF manquant'
      });
    }

    if (!req.session) {
      return res.status(500).json({
        success: false,
        message: 'Session non disponible'
      });
    }

    const result = this.verifyToken(token, req.session.id);
    
    if (!result.valid) {
      return res.status(403).json({
        success: false,
        message: `Token CSRF invalide: ${result.reason}`
      });
    }

    next();
  }
}

// Instance singleton
const csrfProtection = new CSRFProtection();

module.exports = csrfProtection; 