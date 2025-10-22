import React, { useEffect, useState, useRef} from 'react';
import '../styles/Portfolio.css';
import ProjectGrid from '../components/PortfolioGrid';
import axios from 'axios';
import ProjectDetailModal from '../components/ProjectDetailModal';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState(null);
  const [avisList, setAvisList] = useState([]);

  /*Référencee vers la section des projets pour scroll*/
  const projectsSectionRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projets?statut=Publié')
      .then(res => {
        setProjects(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Récupérer les avis Firebase (status approved)
  useEffect(() => {
    axios.get('http://localhost:5000/api/avis/debug/firebase')
      .then(res => {
        setAvisList(res.data.data.filter(a => a.status === 'approved'));
      })
      .catch(() => setAvisList([]));
  }, []);

  // Récupère la liste unique des services présents dans les projets
  const serviceList = [
    'Tous',
    ...Array.from(new Set(projects.map(p => p.serviceTitre || p.category)))
  ];

  // Filtrage des projets selon le service sélectionné
  const filteredProjects = selectedService === 'Tous'
    ? projects
    : projects.filter(p => (p.serviceTitre || p.category) === selectedService);

  // Trouver l'avis lié au projet sélectionné
  const avisForProject = selectedProject
    ? avisList.find(a => a.projectId === selectedProject.idProjet && a.status === 'approved')
    : null;
   // Fonction pour scroller jusqu’à la section
  const scrollToProjects = () => {
    projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
          {/* bouton qui déclenche le scroll */}
          <button className="cta-button" onClick={scrollToProjects}>
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

      {/* Section grille de projets avec cible ref du scroll */}
      <section className="portfolio-projects" ref={projectsSectionRef}>
        <div className="projects-header">
          <h2>Nos Projets Réalisés</h2>
          <p>Chaque projet raconte une histoire de réussite digitale</p>
        </div>

        {/* Filtre par type de service */}
        <div className="portfolio-filter">
          <label htmlFor="service-filter">Filtrer par service :</label>
          <select
            id="service-filter"
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
          >
            {serviceList.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {loading ? <p>Chargement...</p> :
          <ProjectGrid
            projects={filteredProjects}
            onProjectClick={setSelectedProject}
          />
        }
      </section>

      {/* Modal détail projet + avis */}
      <ProjectDetailModal
        project={selectedProject}
        avis={avisForProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Portfolio;