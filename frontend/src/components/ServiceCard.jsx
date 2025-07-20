import React from 'react';
import './ServiceCard.css';

function ServiceCard({ title, description, tarif, items = [] }) {
  // Vérification de sécurité supplémentaire
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <div className="service-card">
      <div className="service-content">
        <h3>{title}</h3>
        <p className="service-description">{description}</p>
        {tarif && (
          <p className="service-price"><strong>Tarif de base :</strong> {tarif} €</p>
        )}
        {safeItems.length > 0 && (
          <ul className="service-items">
            {safeItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ServiceCard;