import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>DigitalCraft</h3>
          <p>Votre partenaire digital pour créer des solutions web et mobiles innovantes qui propulsent votre entreprise vers le succès.</p>
        </div>
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li>Sites Web</li>
            <li>Applications Mobiles</li>
            <li>Marketing Digital</li>
            <li>Consulting</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:contact@digitalcraft.fr">contact@digitalcraft.fr</a></li>
            <li>+33 1 23 45 67 89</li>
            <li>Paris, France</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 DigitalCraft. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;