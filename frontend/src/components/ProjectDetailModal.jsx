import React from 'react';
import '../styles/ProjectDetailModal.css';

function ProjectDetailModal({ project, avis, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{project.titre}</h2>
        <p>{project.description}</p>
        {/* ...autres infos projet... */}
        {avis ? (
          <div className="project-testimonial">
            <h4>Avis client</h4>
            <p><strong>{avis.clientName}</strong> {avis.clientRole && <span>({avis.clientRole})</span>}</p>
            <p>Note : {avis.rating} / 5</p>
            <blockquote>“{avis.message}”</blockquote>
          </div>
        ) : (
          <p style={{opacity:0.7}}>Aucun témoignage client pour ce projet.</p>
        )}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default ProjectDetailModal; 