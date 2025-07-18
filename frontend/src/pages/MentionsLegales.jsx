import React from 'react';
import '../styles/MentionsLegales.css';

const MentionsLegales = () => {
  return (
    <div className="mentions-container">
      <div className="mentions-content">
        <h1>Mentions Légales</h1>
        
        <section>
          <h2>1. Éditeur du site</h2>
          <div className="info-block">
            <p><strong>Raison sociale :</strong> DigitalCraft</p>
            <p><strong>Adresse :</strong> Paris, France</p>
            <p><strong>Email :</strong> contact@digitalcraft.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Activité :</strong> Développement web et mobile</p>
          </div>
        </section>

        <section>
          <h2>2. Hébergement</h2>
          <div className="info-block">
            <p><strong>Hébergeur :</strong> [Nom de l'hébergeur]</p>
            <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
            <p><strong>Téléphone :</strong> [Téléphone de l'hébergeur]</p>
          </div>
        </section>

        <section>
          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale 
            sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
            reproduction sont réservés, y compris pour les documents téléchargeables 
            et les représentations iconographiques et photographiques.
          </p>
          <p>
            La reproduction de tout ou partie de ce site sur un support électronique 
            quel qu'il soit est formellement interdite sauf autorisation expresse 
            du directeur de la publication.
          </p>
        </section>

        <section>
          <h2>4. Responsabilité</h2>
          <p>
            Les informations contenues sur ce site sont aussi précises que possible 
            et le site est périodiquement remis à jour, mais peut toutefois contenir 
            des inexactitudes, des omissions ou des lacunes.
          </p>
          <p>
            Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, 
            merci de bien vouloir le signaler par email à l'adresse contact@digitalcraft.fr, 
            en décrivant le problème de la manière la plus précise possible.
          </p>
        </section>

        <section>
          <h2>5. Liens hypertextes</h2>
          <p>
            Les liens hypertextes mis en place dans le cadre du présent site web en 
            direction d'autres ressources présentes sur le réseau Internet ne sauraient 
            engager la responsabilité de DigitalCraft.
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Le site peut-être amené à vous demander l'acceptation des cookies pour 
            des besoins de statistiques et d'affichage. Un cookie ne nous permet pas 
            de vous identifier ; il sert uniquement à enregistrer des informations 
            relatives à la navigation de votre ordinateur sur notre site.
          </p>
          <p>
            Vous pouvez à tout moment désactiver ces cookies et être libre de refuser 
            leur dépôt en prenant connaissance de notre politique de confidentialité.
          </p>
        </section>

        <section>
          <h2>7. Droit applicable</h2>
          <p>
            Tout litige en relation avec l'utilisation du site digitalcraft.fr est 
            soumis au droit français. En dehors des cas où la loi ne le permet pas, 
            il est fait attribution exclusive de juridiction aux tribunaux compétents 
            de Paris.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <div className="contact-info">
            <p>Pour toute question concernant ces mentions légales :</p>
            <p><strong>Email :</strong> contact@digitalcraft.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Adresse :</strong> Paris, France</p>
          </div>
        </section>

        <div className="mentions-footer">
          <p><strong>Dernière mise à jour :</strong> Janvier 2025</p>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales; 