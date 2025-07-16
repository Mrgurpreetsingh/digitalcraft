import React, { useState } from 'react';

const PortfolioGrid = ({ projects }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

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
          key={project.idProjet || project.id}
          className={`project-card ${hoveredCard === project.idProjet ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard(project.idProjet)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="project-image-container">
            <img 
              src={project.images} 
              alt={project.titre}
              className="project-image"
            />
            <div className="project-overlay">
              <div className="project-category" style={{ backgroundColor: getCategoryColor(project.serviceTitre) }}>
                {project.serviceTitre}
              </div>
            </div>
          </div>
          
          <div className="project-content">
            <h3 className="project-title">{project.titre}</h3>
            <p className="project-description">{project.description}</p>
            {/* Ajoute les tags ou témoignages si dispo */}
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

export default PortfolioGrid;