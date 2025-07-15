// middlewares/verifyCaptcha.js
const axios = require('axios');

module.exports = async function verifyCaptcha(req, res, next) {
  console.log('=== DEBUT VERIFICATION CAPTCHA ===');
  console.log('Body reçu:', req.body);
  
  // Chercher le token dans différents champs possibles
  const token = req.body.token || req.body.captchaToken || req.body.recaptchaToken;
  
  if (!token) {
    console.log('❌ Token manquant');
    console.log('Champs disponibles:', Object.keys(req.body));
    return res.status(400).json({
      success: false,
      message: 'Token reCAPTCHA manquant.'
    });
  }

  if (!process.env.RECAPTCHA_SECRET) {
    console.log('❌ RECAPTCHA_SECRET non configuré');
    return res.status(500).json({
      success: false,
      message: 'Configuration serveur incorrecte.'
    });
  }

  console.log('✅ Token présent, vérification en cours...');

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: token,
        },
        timeout: 10000 // 10 secondes
      }
    );

    console.log('Réponse Google reCAPTCHA:', response.data);

    if (!response.data.success) {
      console.log('❌ Échec reCAPTCHA:', response.data['error-codes']);
      return res.status(403).json({
        success: false,
        message: 'Échec de vérification reCAPTCHA.',
        errors: response.data['error-codes']
      });
    }

    console.log('✅ reCAPTCHA validé avec succès');
    console.log('=== FIN VERIFICATION CAPTCHA ===');
    
    // Supprimer les tokens du body pour éviter qu'ils soient traités plus tard
    delete req.body.token;
    delete req.body.captchaToken;
    delete req.body.recaptchaToken;
    
    next();
  } catch (error) {
    console.error('❌ Erreur lors de la vérification reCAPTCHA:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(500).json({
        success: false,
        message: 'Timeout lors de la vérification reCAPTCHA.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du reCAPTCHA.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
    });
  }
};