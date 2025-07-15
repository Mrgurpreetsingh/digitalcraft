import React from 'react';
import '../styles/Portfolio.css';
import ProjectGrid from '../components/PortfolioGrid';

const Portfolio = () => {
  return (
    <div className="portfolio-container">
      {/* Section bannière bleue */}
      <section className="portfolio-hero">
        <div className="hero-content">
          <h1>Nos Réalisations</h1>
          <p className="hero-subtitle">Découvrez nos projets numériques</p>
          <p className="hero-description">
            Une sélection de nos meilleures créations digitales qui ont transformé nos clients
          </p>
          <button className="cta-button">
            <span className="button-icon">👁️</span>
            Voir tous les projets
          </button>
        </div>
        <div className="hero-background-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </section>

      {/* Section grille de projets */}
      <section className="portfolio-projects">
        <div className="projects-header">
          <h2>Nos Projets Réalisés</h2>
          <p>Chaque projet raconte une histoire de réussite digitale</p>
        </div>
        <ProjectGrid />
      </section>
    </div>
  );
};

export default Portfolio;