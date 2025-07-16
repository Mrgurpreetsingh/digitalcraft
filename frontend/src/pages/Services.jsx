import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Services.css';
import Button from '../components/Button';
import ServicesGrid from '../components/ServicesGrid';
import ServiceHero from '../components/ServiceHero';

function Services() {
  const servicesData = [
    {
      id: 1,
      icon: '💻',
      title: 'Création de Sites Web',
      description: 'Sites web modernes et performants, adaptés à tous les appareils. Nous créons des expériences utilisateur exceptionnelles qui convertissent vos visiteurs en clients. De la vitrine corporate au e-commerce complexe.',
      items: ['Design responsive', 'Performance optimale', 'Optimisation SEO', 'CMS intégré'],
      linkText: 'En savoir plus',
    },
    {
      id: 2,
      icon: '📱',
      title: 'Applications Mobiles',
      description: 'Applications natives et cross-platform pour iOS et Android. Interface intuitive, performance optimale et intégration parfaite avec vos systèmes existants. De l\'idée au déploiement sur les stores.',
      items: ['iOS & Android', 'API intégration', 'UX/UI moderne', 'Maintenance incluse'],
      linkText: 'En savoir plus',
    },
    {
      id: 3,
      icon: '📈',
      title: 'Marketing Digital',
      description: 'Stratégies marketing complètes pour maximiser votre visibilité en ligne. SEO, publicité payante, email marketing et analytics pour mesurer votre ROI. Nous transformons votre audience en clients fidèles.',
      items: ['Stratégie SEO/SEA', 'Email marketing', 'Analytics & reporting', 'Conversion optimization'],
      linkText: 'En savoir plus',
    },
    {
      id: 4,
      icon: '📊',
      title: 'Gestion Réseaux Sociaux',
      description: 'Développez votre communauté et engagez votre audience sur tous les réseaux sociaux. Création de contenu, planning éditorial, community management et campagnes publicitaires ciblées pour maximiser votre impact.',
      items: ['Stratégie de contenu', 'Community management', 'Publicité ciblée', 'Analyse performance'],
      linkText: 'En savoir plus',
    },
  ];

  const navigate = useNavigate();

  const handleDevisClick = () => {
    navigate('/devis');
  };

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
        <ServicesGrid services={servicesData} />
      </section>
      <section className="services-cta">
        <div className="cta-content">
          <h2>Prêt à Transformer Votre Entreprise ?</h2>
          <p>Discutons de vos projets et découvrons ensemble comment nos services peuvent propulser votre croissance digitale.</p>
          <Button onClick={handleDevisClick}>Demander un devis</Button>
        </div>
      </section>
    </main>
  );
}

export default Services;