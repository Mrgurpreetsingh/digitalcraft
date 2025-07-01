import React from 'react';
import '../../App.css';

function Home() {
  return (
    <section style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '32px', color: '#005DAA' }}>
        Créez votre présence digitale
      </h1>
      <p style={{ fontFamily: 'Inter', fontSize: '16px', color: '#1A1A1A' }}>
        Sites web, apps, marketing - tout sous un même toit
      </p>
      <button style={{ backgroundColor: '#005DAA', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '6px' }}>
        Demander un devis
      </button>
    </section>
  );
}

export default Home;
