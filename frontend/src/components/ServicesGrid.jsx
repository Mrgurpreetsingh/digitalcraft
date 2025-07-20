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
          key={service.idService}
          title={service.titre}
          description={service.description}
          tarif={service.tarifBase}
          items={service.exemples ? (Array.isArray(service.exemples) ? service.exemples : service.exemples.split(/,|\n/).map(e => e.trim()).filter(Boolean)) : []}
        />
      ))}
    </div>
  );
}

export default ServicesGrid;