import React from 'react';
import '../styles/Services.css';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';

function Services() {
  const servicesData = [
    {
      title: 'Création de Sites Web',
      description: 'Sites web modernes et performants, adaptés à tous les appareils. Nous créons des expériences utilisateur exceptionnelles qui convertissent vos visiteurs en clients. De la vitrine corporate au e-commerce complexe.',
      items: ['Design responsive', 'Performance optimale', 'Optimisation SEO', 'CMS intégré'],
      linkText: 'En savoir plus',
    },
    {
      title: 'Applications Mobiles',
      description: 'Applications natives et cross-platform pour iOS et Android. Interface intuitive, performance optimale et intégration parfaite avec vos systèmes existants. De l\'idée au déploiement sur les stores.',
      items: ['iOS & Android', 'API intégration', 'UX/UI moderne', 'Maintenance incluse'],
      linkText: 'En savoir plus',
    },
    {
      title: 'Marketing Digital',
      description: 'Stratégies marketing complètes pour maximiser votre visibilité en ligne. SEO, publicité payante, email marketing et analytics pour mesurer votre ROI. Nous transformons votre audience en clients fidèles.',
      items: ['Stratégie SEO/SEA', 'Email marketing', 'Analytics & reporting', 'Conversion optimization'],
      linkText: 'En savoir plus',
    },
    {
      title: 'Gestion Réseaux Sociaux',
      description: 'Développez votre communauté et engagez votre audience sur tous les réseaux sociaux. Création de contenu, planning éditorial, community management et campagnes publicitaires ciblées pour maximiser votre impact.',
      items: ['Stratégie de contenu', 'Community management', 'Publicité ciblée', 'Analyse performance'],
      linkText: 'En savoir plus',
    },
  ];

  return (
    <main>
      <section className="services-section blue-bg">
        <h1>Prêt à Transformer Votre Entreprise ?</h1>
        <p>Discutons de vos projets et découvrons ensemble comment nos services peuvent propulser votre croissance digitale.</p>
        <Button>Demander un devis</Button>
        <p>ou appelez-nous directement au <a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
      </section>
      <section className="services-section">
        <h1>Nos Expertises Digitales</h1>
        <p>Chaque service est conçu pour répondre à vos besoins spécifiques et faire croître votre activité</p>
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              items={service.items}
              linkText={service.linkText}
            />
          ))}
        </div>
      </section>
      <section className="services-section blue-bg">
        <h1>Nos Services pour Votre Succès</h1>
        <p>Découvrez nos expertises en création digitale</p>
        <p>Des solutions sur mesure pour propulser votre entreprise dans l'ère numérique</p>
        <Button>Contacter un expert</Button>
      </section>
    </main>
  );
}

export default Services;