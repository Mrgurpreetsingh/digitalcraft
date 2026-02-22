// utils/emailService.js
const nodemailer = require('nodemailer');

/**
 * Service d'envoi d'emails (optionnel - nécessite configuration SMTP)
 *
 * Configuration Gmail :
 * 1. Activer "Validation en 2 étapes" sur votre compte Google
 * 2. Générer un "Mot de passe d'application" : https://myaccount.google.com/apppasswords
 * 3. Ajouter dans .env :
 *    EMAIL_HOST=smtp.gmail.com
 *    EMAIL_PORT=587
 *    EMAIL_USER=votre.email@gmail.com
 *    EMAIL_PASS=votre_mot_de_passe_app
 */

class EmailService {
  constructor() {
    // Debug: Afficher les variables d'environnement
    console.log('🔍 DEBUG EMAIL CONFIG:');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'undefined');

    // Vérifier si les variables d'environnement sont configurées
    this.isConfigured = !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
    );

    console.log('✅ SMTP Configuré:', this.isConfigured);

    if (this.isConfigured) {
      // Créer le transporteur SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true pour port 465, false pour autres ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('✅ Transporteur SMTP créé');
    } else {
      console.log('⚠️ SMTP non configuré - Mode développement');
    }
  }

  /**
   * Envoyer un email de confirmation de devis
   */
  async sendDevisConfirmation(devisData) {
    try {
      // Si pas configuré, loguer seulement (mode dev)
      if (!this.isConfigured) {
        console.log('📧 [MODE DEV] Email non envoyé (SMTP non configuré)');
        console.log('Destinataire:', devisData.emailDemandeur);
        console.log('Numéro devis:', devisData.numeroDevis);
        return { success: true, message: 'Mode développement - Email non envoyé' };
      }

      const mailOptions = {
        from: `"DigitalCraft" <${process.env.EMAIL_USER}>`,
        to: devisData.emailDemandeur,
        subject: `Confirmation de réception - Devis ${devisData.numeroDevis}`,
        text: this.getDevisConfirmationText(devisData),
        html: this.getDevisConfirmationHTML(devisData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé:', info.messageId);

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Erreur envoi email:', error.message);
      // Ne pas faire crasher l'app si l'email échoue
      return { success: false, error: error.message };
    }
  }

  /**
   * Template texte brut
   */
  getDevisConfirmationText(devisData) {
    return `
Bonjour ${devisData.prenomDemandeur} ${devisData.nomDemandeur},

Nous avons bien reçu votre demande de devis (N° ${devisData.numeroDevis}).

Détails de votre demande :
- Service : ${devisData.serviceTitre || 'Non spécifié'}
- Budget estimé : ${devisData.budgetEstime}
- Description : ${devisData.description}

Nous reviendrons vers vous dans les plus brefs délais avec une proposition personnalisée.

Cordialement,
L'équipe DigitalCraft

---
Cet email est généré automatiquement, merci de ne pas y répondre directement.
Pour toute question : contact@digitalcraft.fr
    `.trim();
  }

  /**
   * Template HTML
   */
  getDevisConfirmationHTML(devisData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #1e40af; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DigitalCraft</h1>
      <p>Confirmation de réception</p>
    </div>
    <div class="content">
      <p>Bonjour <strong>${devisData.prenomDemandeur} ${devisData.nomDemandeur}</strong>,</p>

      <p>Nous avons bien reçu votre demande de devis.</p>

      <div class="info-box">
        <p><strong>Numéro de devis :</strong> ${devisData.numeroDevis}</p>
        <p><strong>Service :</strong> ${devisData.serviceTitre || 'Non spécifié'}</p>
        <p><strong>Budget estimé :</strong> ${devisData.budgetEstime}</p>
        <p><strong>Description :</strong> ${devisData.description}</p>
      </div>

      <p>Nous reviendrons vers vous dans les <strong>plus brefs délais</strong> avec une proposition personnalisée.</p>

      <p>Cordialement,<br>L'équipe DigitalCraft</p>
    </div>
    <div class="footer">
      <p>Cet email est généré automatiquement, merci de ne pas y répondre directement.</p>
      <p>Pour toute question : contact@digitalcraft.fr</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}

module.exports = new EmailService();
