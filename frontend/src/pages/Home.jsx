import React, { useEffect } from 'react';
import '../styles/Home.css';
import Avis from '../components/Avis';
import { applyPageSEO } from '../utils/seo';

function Home() {
  useEffect(() => {
    // Appliquer le SEO pour la page d'accueil
    applyPageSEO('home');
  }, []);

  return (
    <main id="main-content">
      {/* Section Hero */}
      <section className="home-section">
        <div className="home-content">
          <div className="home-text">
            <h1>Créez votre présence digitale</h1>
            <p className="hero-subtitle">Sites web, apps, marketing - tout sous un même toit</p>
            <p className="hero-description">
              Transformez vos idées en solutions digitales performantes avec notre équipe d'experts.
            </p>
            <button className="cta-button">
              Demander un devis
            </button>
          </div>
          <div className="home-image">
            <img 
              src="/img/banniere-hero-page-accueil.png" 
              alt="Illustration de développement web et création digitale" 
              loading="eager"
              width="600"
              height="400"
            />
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section className="services">
        <header className="services-header">
          <h2>Nos Services Experts</h2>
          <p>
            Des solutions complètes pour développer votre présence digitale et faire croître votre entreprise.
          </p>
        </header>
        
        <div className="services-grid">
          <article className="service-card">
            <div className="service-icon">🌐</div>
            <h3>Création de Sites Web</h3>
            <ul>
              <li>Design responsive</li>
              <li>Optimisation SEO</li>
              <li>Performance optimale</li>
            </ul>
          </article>
          
          <article className="service-card">
            <div className="service-icon">📱</div>
            <h3>Applications Mobiles</h3>
            <ul>
              <li>iOS & Android</li>
              <li>UX/UI moderne</li>
              <li>Maintenance incluse</li>
            </ul>
          </article>
          
          <article className="service-card">
            <div className="service-icon">📈</div>
            <h3>Marketing Digital</h3>
            <ul>
              <li>Stratégie SEO/SEA</li>
              <li>Réseaux sociaux</li>
              <li>Analytics & reporting</li>
            </ul>
          </article>
        </div>
      </section>

      {/* Section Témoignages */}
      <section>
        <Avis />
      </section>
    </main>
  );
}

export default Home;