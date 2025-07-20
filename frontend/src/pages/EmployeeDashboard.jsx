import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('projets');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/projets/assigned', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(res.data.data);
      } catch (err) {
        setError('Erreur lors du chargement des projets assignés.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeTab === 'devis') {
      const fetchQuotes = async () => {
        setQuotesLoading(true);
        setQuotesError(null);
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:5000/api/devis/assigned', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setQuotes(res.data.data);
        } catch (err) {
          setQuotesError('Erreur lors du chargement des devis assignés.');
        } finally {
          setQuotesLoading(false);
        }
      };
      fetchQuotes();
    }
  }, [activeTab]);

  const handleStatusChange = (projectId, newStatus) => {
    setProjects(projects.map(project =>
      project.idProjet === projectId
        ? { ...project, statut: newStatus }
        : project
    ));
    // TODO: Appel API pour mettre à jour le statut côté backend
  };

  const handleModify = (projectId) => {
    // TODO: Logique de modification à implémenter
  };

  const handleUpdate = (projectId) => {
    // TODO: Logique de mise à jour à implémenter
  };

  const handleAddProject = () => {
    // Désactivé pour l'employé
  };

  const handleRespondQuote = () => {
    // TODO: Logique de réponse aux devis à implémenter
  };

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h1>Espace Employé</h1>
        <p className="dashboard-subtitle">Gérez vos projets, devis et publications</p>
        <div className="action-buttons">
          <button className="btn-primary" onClick={handleAddProject} disabled>
            <span className="btn-icon">+</span>
            Ajouter un Projet
          </button>
          <button className="btn-secondary" onClick={handleRespondQuote}>
            <span className="btn-icon">💬</span>
            Répondre à un Devis
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="tabs-container">
          <div className="tabs">
            <button className={`tab ${activeTab === 'projets' ? 'active' : ''}`} onClick={() => setActiveTab('projets')}>
              <span className="tab-icon">📁</span> Projets
            </button>
            <button className={`tab ${activeTab === 'devis' ? 'active' : ''}`} onClick={() => setActiveTab('devis')}>
              <span className="tab-icon">📋</span> Demandes de Devis
            </button>
            <button className={`tab ${activeTab === 'sociaux' ? 'active' : ''}`} onClick={() => setActiveTab('sociaux')}>
              <span className="tab-icon">📱</span> Réseaux Sociaux
            </button>
          </div>
        </div>
        <div className="tab-content">
          {activeTab === 'projets' && (
            <div className="projects-section">
              <h2>Gestion des Projets</h2>
              <div className="projects-table">
                <div className="table-header">
                  <div className="header-cell">Titre</div>
                  <div className="header-cell">Statut</div>
                  <div className="header-cell">Actions</div>
                </div>
                {loading ? <div>Chargement...</div> : error ? <div>{error}</div> : projects.map(project => (
                  <div key={project.idProjet} className="table-row">
                    <div className="cell title-cell">
                      <span className="project-icon">📁</span>
                      <span className="project-title">{project.titre}</span>
                    </div>
                    <div className="cell status-cell">
                      <select
                        value={project.statut}
                        onChange={e => handleStatusChange(project.idProjet, e.target.value)}
                        className="status-select"
                      >
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="En attente">En attente</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                    </div>
                    <div className="cell actions-cell">
                      <button className="action-btn modify-btn" onClick={() => handleModify(project.idProjet)}>
                        ✏️ Modifier
                      </button>
                      <button className="action-btn update-btn" onClick={() => handleUpdate(project.idProjet)}>
                        🔄 Mettre à Jour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'devis' && (
            <div className="quotes-section">
              <h2>Demandes de Devis</h2>
              {quotesLoading ? (
                <div>Chargement...</div>
              ) : quotesError ? (
                <div>{quotesError}</div>
              ) : quotes.length === 0 ? (
                <p>Aucune demande de devis assignée.</p>
              ) : (
                <div className="quotes-table">
                  <div className="table-header">
                    <div className="header-cell">Numéro</div>
                    <div className="header-cell">Demandeur</div>
                    <div className="header-cell">Service</div>
                    <div className="header-cell">Statut</div>
                  </div>
                  {quotes.map(quote => (
                    <div key={quote.idDevis} className="table-row">
                      <div className="cell">{quote.numeroDevis}</div>
                      <div className="cell">{quote.nomDemandeur} {quote.prenomDemandeur}</div>
                      <div className="cell">{quote.serviceNom}</div>
                      <div className="cell">{quote.statut}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'sociaux' && (
            <div className="social-section">
              <h2>Réseaux Sociaux</h2>
              <p>Gestion des réseaux sociaux à venir.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;