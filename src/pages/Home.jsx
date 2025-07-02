import React from 'react';
import '../styles/Home.css';

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
      <section className="testimonials">
        <h1>Ce que disent nos clients</h1>
        <p>La satisfaction client au cœur de notre mission</p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <img src="/img/marie-dubois.jpg" alt="Marie Dubois" />
            <h4>Marie Dubois</h4>
            <p>dev, TechStart</p>
            <p>★★★★★</p>
            <p>"DigitalCraft a transformé notre vision en une plateforme web exceptionnelle. Leur expertise technique et leur approche collaborative ont dépassé nos attentes. Un partenaire de confiance !"</p>
          </div>
          <div className="testimonial-card">
            <img src="/img/thomas-martin.jpg" alt="Thomas Martin" />
            <h4>Thomas Martin</h4>
            <p>Marketing, InnovateCorp</p>
            <p>★★★★★</p>
            <p>"L’équipe DigitalCraft a développé notre application mobile avec un professionnalisme remarquable. Le résultat final est à la hauteur de nos ambitions. Je recommande vivement !"</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;