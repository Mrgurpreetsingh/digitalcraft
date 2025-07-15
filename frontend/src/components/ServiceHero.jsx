import React from 'react';
import './ServiceHero.css';
import Button from './Button';

function ServiceHero({ title, subtitle, description, buttonText }) {
  return (
    <section className="service-hero">
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {description && <p className="hero-description">{description}</p>}
        <Button>{buttonText}</Button>
      </div>
    </section>
  );
}

export default ServiceHero;