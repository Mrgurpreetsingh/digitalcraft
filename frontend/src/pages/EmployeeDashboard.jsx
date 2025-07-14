import React, { useState, useEffect } from 'react';
import { Users, FileText, Send, Plus, MessageSquare, Twitter, Edit, CheckCircle } from 'lucide-react';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [devis, setDevis] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');

  // Simuler des données (à remplacer par API)
  useEffect(() => {
    setProjects([
      { id: 1, title: 'Site E-commerce Mode', status: 'En cours', service: 'Création de sites web' },
      { id: 2, title: 'App Mobile Restaurant', status: 'En cours', service: 'Applications mobiles' },
    ]);
    setDevis([
      { id: 1, client: 'Jean Dupont', description: 'Devis pour site web' },
    ]);
  }, []);

  const updateProjectStatus = (id, newStatus) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const respondToDevis = (id) => {
    alert(`Réponse envoyée pour le devis ${id}`);
  };

  const publishSocialUpdate = () => {
    const update = prompt('Entrez une mise à jour pour les réseaux sociaux :');
    if (update) alert(`Mise à jour publiée : ${update}`);
  };

  const addProject = () => {
    const title = prompt('Titre du nouveau projet :');
    if (title) {
      const newProject = {
        id: projects.length + 1,
        title,
        status: 'En cours',
        service: 'Nouveau service'
      };
      setProjects([...projects, newProject]);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">Espace Employé</h1>
            <p className="dashboard-subtitle">Gérez vos projets, devis et publications</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Action Buttons */}
        <div className="action-buttons-section">
          <div className="action-buttons">
            <button
              onClick={addProject}
              className="btn-primary"
            >
              <Plus size={20} />
              Ajouter un Projet
            </button>
            <button
              onClick={() => respondToDevis(1)}
              className="btn-primary"
            >
              <MessageSquare size={20} />
              Répondre à un Devis
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <nav className="tabs-nav" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('projects')}
                className={`tab-button ${activeTab === 'projects' ? 'tab-active' : 'tab-inactive'}`}
              >
                <div className="tab-content">
                  <FileText size={20} />
                  Projets
                </div>
              </button>
              <button
                onClick={() => setActiveTab('devis')}
                className={`tab-button ${activeTab === 'devis' ? 'tab-active' : 'tab-inactive'}`}
              >
                <div className="tab-content">
                  <FileText size={20} />
                  Demandes de Devis
                </div>
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`tab-button ${activeTab === 'social' ? 'tab-active' : 'tab-inactive'}`}
              >
                <div className="tab-content">
                  <Twitter size={20} />
                  Réseaux Sociaux
                </div>
              </button>
            </nav>
          </div>

          <div className="tab-content-container">
            {activeTab === 'projects' && (
              <div>
                <h2 className="section-title">Gestion des Projets</h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr className="table-header">
                        <th className="table-th">Titre</th>
                        <th className="table-th">Statut</th>
                        <th className="table-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {projects.map((project) => (
                        <tr key={project.id} className="table-row">
                          <td className="table-td">
                            <div className="project-title">
                              <div className="project-icon">
                                <span className="project-letter">
                                  {project.title.charAt(0)}
                                </span>
                              </div>
                              <span className="project-name">{project.title}</span>
                            </div>
                          </td>
                          <td className="table-td">
                            <select
                              onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                              value={project.status}
                              className="status-select"
                            >
                              <option value="En cours">En cours</option>
                              <option value="Terminé">Terminé</option>
                              <option value="Annulé">Annulé</option>
                            </select>
                          </td>
                          <td className="table-td">
                            <div className="action-buttons-table">
                              <button className="btn-secondary">
                                <Edit size={14} />
                                Modifier
                              </button>
                              <button className="btn-success">
                                <CheckCircle size={14} />
                                Mettre à jour
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'devis' && (
              <div>
                <h2 className="section-title">Gestion des Devis</h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr className="table-header">
                        <th className="table-th">ID</th>
                        <th className="table-th">Client</th>
                        <th className="table-th">Description</th>
                        <th className="table-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {devis.map((devisItem) => (
                        <tr key={devisItem.id} className="table-row">
                          <td className="table-td table-id">{devisItem.id}</td>
                          <td className="table-td">{devisItem.client}</td>
                          <td className="table-td">{devisItem.description}</td>
                          <td className="table-td">
                            <button
                              onClick={() => respondToDevis(devisItem.id)}
                              className="btn-success"
                            >
                              <MessageSquare size={14} />
                              Répondre
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div>
                <h2 className="section-title">Réseaux Sociaux</h2>
                <div className="social-section">
                  <Twitter size={48} className="social-icon" />
                  <p className="social-text">Publiez une mise à jour sur les réseaux sociaux</p>
                  <button
                    onClick={publishSocialUpdate}
                    className="btn-primary btn-large"
                  >
                    <Send size={20} />
                    Publier une Mise à Jour
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;