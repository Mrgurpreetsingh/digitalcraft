import React from 'react';
import './ServicesGrid.css';
import ServiceCard from './ServiceCard';

function ServicesGrid({ services = [] }) {
  // Vérification de sécurité
  const safeServices = Array.isArray(services) ? services : [];
  
  return (
    <div className="services-grid">
      {safeServices.map((service) => (
        <ServiceCard
          key={service.id}
          icon={service.icon}
          title={service.title}
          description={service.description}
          items={service.items}
          linkText={service.linkText}
        />
      ))}
    </div>
  );
}

export default ServicesGrid;