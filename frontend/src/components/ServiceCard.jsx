import React from 'react';
import './ServiceCard.css';

function ServiceCard({ icon, title, description, items = [], linkText }) {
  // Vérification de sécurité supplémentaire
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <div className="service-card">
      <div className="service-icon">
        {icon}
      </div>
      <div className="service-content">
        <h3>{title}</h3>
        <p className="service-description">{description}</p>
        <ul className="service-items">
          {safeItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <a href="#" className="service-link">
          {linkText} →
        </a>
      </div>
    </div>
  );
}

export default ServiceCard;