import React from 'react';
import '../styles/PolitiqueConfidentialite.css';

const PolitiqueConfidentialite = () => {
  return (
    <div className="politique-container">
      <div className="politique-content">
        <h1>Politique de Confidentialité</h1>
        
        <section>
          <h2>1. Introduction</h2>
          <p>
            DigitalCraft ("nous", "notre", "nos") s'engage à protéger la vie privée de ses utilisateurs. 
            Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
            vos informations personnelles lorsque vous utilisez notre site web.
          </p>
        </section>

        <section>
          <h2>2. Informations que nous collectons</h2>
          <h3>2.1 Informations que vous nous fournissez</h3>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone</li>
            <li>Messages et demandes de contact</li>
            <li>Informations de devis</li>
          </ul>

          <h3>2.2 Informations collectées automatiquement</h3>
          <ul>
            <li>Adresse IP</li>
            <li>Type de navigateur</li>
            <li>Système d'exploitation</li>
            <li>Pages visitées</li>
            <li>Durée de visite</li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation des cookies</h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience. Les cookies sont de petits 
            fichiers texte stockés sur votre appareil.
          </p>
          
          <h3>3.1 Types de cookies utilisés</h3>
          <ul>
            <li><strong>Cookies nécessaires :</strong> Essentiels au fonctionnement du site</li>
            <li><strong>Cookies de préférences :</strong> Mémorisent vos choix</li>
            <li><strong>Cookies d'analyse :</strong> Nous aident à comprendre l'utilisation du site</li>
            <li><strong>Cookies marketing :</strong> Pour des contenus personnalisés</li>
          </ul>

          <h3>3.2 Gestion des cookies</h3>
          <p>
            Vous pouvez accepter ou refuser les cookies via notre bannière de cookies. 
            Vous pouvez également modifier vos préférences à tout moment.
          </p>
        </section>

        <section>
          <h2>4. Utilisation de vos informations</h2>
          <p>Nous utilisons vos informations pour :</p>
          <ul>
            <li>Répondre à vos demandes de contact</li>
            <li>Traiter vos demandes de devis</li>
            <li>Améliorer nos services</li>
            <li>Vous envoyer des informations sur nos services (avec votre consentement)</li>
            <li>Assurer la sécurité du site</li>
          </ul>
        </section>

        <section>
          <h2>5. Partage de vos informations</h2>
          <p>
            Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. 
            Nous pouvons partager vos informations uniquement dans les cas suivants :
          </p>
          <ul>
            <li>Avec votre consentement explicite</li>
            <li>Pour respecter une obligation légale</li>
            <li>Pour protéger nos droits et notre sécurité</li>
            <li>Avec nos prestataires de services (hébergement, analyse) sous stricte confidentialité</li>
          </ul>
        </section>

        <section>
          <h2>6. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations 
            personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
          </p>
        </section>

        <section>
          <h2>7. Conservation des données</h2>
          <p>
            Nous conservons vos informations personnelles aussi longtemps que nécessaire pour 
            atteindre les objectifs décrits dans cette politique, sauf si une période de conservation 
            plus longue est requise ou autorisée par la loi.
          </p>
        </section>

        <section>
          <h2>8. Vos droits</h2>
          <p>Conformément au RGPD, vous avez les droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> Demander une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
            <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
          </ul>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
            contactez-nous :
          </p>
          <div className="contact-info">
            <p><strong>Email :</strong> contact@digitalcraft.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Adresse :</strong> Paris, France</p>
          </div>
        </section>

        <section>
          <h2>10. Modifications de cette politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
            Les modifications seront publiées sur cette page avec une date de mise à jour révisée.
          </p>
        </section>

        <section>
          <h2>11. Droit applicable</h2>
          <p>
            Cette politique de confidentialité est régie par le droit français. Tout litige sera 
            soumis à la compétence des tribunaux français.
          </p>
        </section>

        <div className="politique-footer">
          <p><strong>Dernière mise à jour :</strong> Janvier 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite; 