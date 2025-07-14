import React from 'react';
import { Edit, ExternalLink } from 'lucide-react';

const ProjectsGrid = ({ projects, onEditProject, /*onDeleteProject */}) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'En cours': 'en-cours',
      'En attente': 'en-attente',
      'Terminé': 'termine'
    };
    return statusMap[status] || 'en-attente';
  };

  return (
    <div>
      <h2 className="section-title">Projets en Cours</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <div className="project-icon">
                {project.icon}
              </div>
              <div className="project-status">
                <span className={`status-badge ${getStatusClass(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            <div className="project-content">
              <h3 className="project-title">{project.name}</h3>
              <p className="project-description">{project.description}</p>
            </div>
            <div className="project-actions">
              <button 
                className="project-action-button modify"
                onClick={() => onEditProject(project.id)}
                title="Modifier"
              >
                <Edit size={16} />
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;