import React, { useEffect, useState } from 'react';
import '../styles/Services.css';
import Button from '../components/Button';
import ServicesGrid from '../components/ServicesGrid';
import ServiceHero from '../components/ServiceHero';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/services/public/actifs')
      .then(res => res.json())
      .then(data => {
        setServices(data.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <main className="services-main">
      <ServiceHero 
        title="Nos Services pour Votre Succès"
        subtitle="Découvrez nos expertises en création digitale"
        description="Des solutions sur mesure pour propulser votre entreprise dans l'ère numérique"
        buttonText="Contacter un expert"
      />
      <section className="services-content">
        <div className="services-header">
          <h2>Nos Expertises Digitales</h2>
          <p>Chaque service est conçu pour répondre à vos besoins spécifiques et faire croître votre activité</p>
        </div>
        <ServicesGrid services={services} />
      </section>
      <section className="services-cta">
        <div className="cta-content">
          <h2>Prêt à Transformer Votre Entreprise ?</h2>
          <p>Discutons de vos projets et découvrons ensemble comment nos services peuvent propulser votre croissance digitale.</p>
          <Button onClick={() => window.location.href='/devis'}>Demander un devis</Button>
        </div>
      </section>
    </main>
  );
}

export default Services;