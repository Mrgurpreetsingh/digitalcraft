import React, { useState } from 'react';

const Portfoliogrid = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Boutique Mode Premium",
      description: "Site e-commerce complet avec système de paiement intégré et interface d'administration.",
      category: "Site Web",
      tags: ["React", "WooCommerce"],
      image: "frontend/public/img/e-commerce.png", // Placer l'image de la boutique mode ici
      link: "#"
    },
    {
      id: 2,
      title: "App Fitness Tracker",
      description: "Application mobile de suivi sportif avec géolocalisation et communauté intégrée.",
      category: "App Mobile",
      tags: ["React Native", "Firebase"],
      image: "frontend/public/img/fitness-app.jpg", // Placer l'image de l'app fitness ici
      link: "#"
    },
    {
      id: 3,
      title: "Campagne Lancement Produit",
      description: "Stratégie marketing 360° avec SEO, publicité payante et content marketing.",
      category: "Marketing",
      tags: ["SEO/SEA", "Analytics"],
      image: "frontend/public/img/digital_marketing.png", // Placer l'image de la campagne marketing ici
      link: "#"
    },
    {
      id: 4,
      title: "Site Connectify",
      description: "Site vitrine, réseau social pour amoureux de la musique.",
      category: "Site Web",
      tags: ["React","javascript"],
      image: "frontend/public/img/connectify.PNG", 
      link: "#"
    },
    {
      id: 5,
      title: "Stratégie Réseaux Sociaux",
      description: "Gestion complète des réseaux sociaux avec création de contenu et community management.",
      category: "Social Media",
      tags: ["Instagram", "LinkedIn"],
      image: "/images/social-media.jpg", // Placer l'image de la stratégie social media ici
      link: "#"
    },
    {
      id: 6,
      title: "App To-do list",
      description: "Application de liste mobile.",
      category: "App Mobile",
      tags: ["React Native", "Firebase"],
      image: "/frontend/public/img/page accueil screen.PNG",
      link: "#"
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Site Web': '#2563eb',
      'App Mobile': '#059669',
      'Marketing': '#dc2626',
      'Social Media': '#7c3aed'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <div 
          key={project.id}
          className={`project-card ${hoveredCard === project.id ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard(project.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="project-image-container">
            <img 
              src={project.image} 
              alt={project.title}
              className="project-image"
            />
            <div className="project-overlay">
              <div className="project-category" style={{ backgroundColor: getCategoryColor(project.category) }}>
                {project.category}
              </div>
            </div>
          </div>
          
          <div className="project-content">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="project-tag">{tag}</span>
              ))}
            </div>
            
            <div className="project-actions">
              <button className="project-btn-primary">
                En savoir plus →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Portfoliogrid;