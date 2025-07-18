import React from 'react';
import '../styles/Home.css';
import Avis from '../components/Avis';

function Home() {
  return (
    <main>
      <section className="home-section">
        <div className="home-content">
          <div className="home-text">
            <h1>Créez votre présence digitale</h1>
            <p>Sites web, apps, marketing - tout sous un même toit</p>
            <p>Transformez vos idées en solutions digitales performantes avec notre équipe d'experts.</p>
            <button>Demander un devis</button>
          </div>
          <div className="home-image">
            <img src="/img/banniere-hero-page-accueil.png" alt="Illustration" />
          </div>
        </div>
      </section>
      <section className="services">
        {/* Sections services et testimonials peuvent être ajoutées progressivement */}
        <h1>Nos Services Experts</h1>
        <p>Des solutions complètes pour développer votre présence digitale et faire croître votre entreprise.</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>Création de Sites Web</h3>
            <ul>
              <li>Design responsive</li>
              <li>Optimisation SEO</li>
              <li>Performance optimale</li>
            </ul>
          </div>
          <div className="service-card">
            <div className="service-icon">📱</div>
            <h3>Applications Mobiles</h3>
            <ul>
              <li>iOS & Android</li>
              <li>UX/UI moderne</li>
              <li>Maintenance incluse</li>
            </ul>
          </div>
          <div className="service-card">
            <div className="service-icon">📈</div>
            <h3>Marketing Digital</h3>
            <ul>
              <li>Stratégie SEO/SEA</li>
              <li>Réseaux sociaux</li>
              <li>Analytics & reporting</li>
            </ul>
          </div>
        </div>
      </section>
      <Avis />
    </main>
  );
}

export default Home;