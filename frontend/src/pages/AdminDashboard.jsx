import React, { useState, useEffect } from 'react';
import { Settings, Users, FolderOpen, Plus, Edit, Trash2, User, FileText, MessageSquare, BarChart3 } from 'lucide-react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalServices: 0,
    totalQuotes: 0
  });

  // Configuration axios avec token
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer toutes les données en parallèle
      const [usersRes, projectsRes, servicesRes, quotesRes] = await Promise.all([
        api.get('/utilisateurs/employees-and-admins'),
        api.get('/projets'),
        api.get('/services'),
        api.get('/devis')
      ]);

      setUsers(usersRes.data.data.map(user => ({
        id: user.idUtilisateur,
        name: `${user.nom} ${user.prenom}`,
        email: user.email,
        role: user.role,
        status: 'Actif',
        avatar: `${user.nom[0]}${user.prenom[0]}`.toUpperCase(),
        dateCreation: user.dateCreation
      })));

      setProjects(projectsRes.data.data.map(project => ({
        id: project.idProjet,
        name: project.titre,
        description: project.description,
        status: project.statut,
        service: project.serviceTitre,
        client: project.clientNom ? `${project.clientNom} ${project.clientPrenom}` : 'Non assigné',
        employe: project.employeNom ? `${project.employeNom} ${project.employePrenom}` : 'Non assigné',
        dateCreation: project.dateCreation
      })));

      setServices(servicesRes.data.data.map(service => ({
        id: service.idService,
        name: service.titre,
        description: service.description,
        tarifBase: service.tarifBase,
        exemples: service.exemples,
        dateCreation: service.dateCreation
      })));

      setQuotes(quotesRes.data.data.map(quote => ({
        id: quote.idDevis,
        numero: quote.numeroDevis,
        demandeur: `${quote.nomDemandeur} ${quote.prenomDemandeur}`,
        email: quote.emailDemandeur,
        service: quote.serviceNom,
        budget: quote.budgetEstime,
        status: quote.statut,
        dateCreation: quote.dateCreation
      })));

      // Calculer les statistiques
      setStats({
        totalUsers: usersRes.data.data.length,
        totalProjects: projectsRes.data.data.length,
        totalServices: servicesRes.data.data.length,
        totalQuotes: quotesRes.data.data.length
      });

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Actions CRUD pour les utilisateurs
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.delete(`/utilisateurs/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEditUser = (userId) => {
    // TODO: Implémenter la modification d'utilisateur
    console.log('Éditer utilisateur:', userId);
  };

  // Actions CRUD pour les projets
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await api.delete(`/projets/${projectId}`);
        setProjects(projects.filter(project => project.id !== projectId));
        setStats(prev => ({ ...prev, totalProjects: prev.totalProjects - 1 }));
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEditProject = (projectId) => {
    // TODO: Implémenter la modification de projet
    console.log('Éditer projet:', projectId);
  };

  // Actions CRUD pour les services
  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        setServices(services.filter(service => service.id !== serviceId));
        setStats(prev => ({ ...prev, totalServices: prev.totalServices - 1 }));
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEditService = (serviceId) => {
    // TODO: Implémenter la modification de service
    console.log('Éditer service:', serviceId);
  };

  // Actions CRUD pour les devis
  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        await api.delete(`/devis/${quoteId}`);
        setQuotes(quotes.filter(quote => quote.id !== quoteId));
        setStats(prev => ({ ...prev, totalQuotes: prev.totalQuotes - 1 }));
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEditQuote = (quoteId) => {
    // TODO: Implémenter la modification de devis
    console.log('Éditer devis:', quoteId);
  };

  // Actions d'ajout
  const handleAddUser = () => console.log('Ajouter utilisateur');
  const handleAddProject = () => console.log('Ajouter projet');
  const handleAddService = () => console.log('Ajouter service');

  const getStatusClass = (status) => {
    const statusMap = { 
      'Actif': 'actif', 
      'En cours': 'en-cours', 
      'Inactif': 'inactif', 
      'En attente': 'en-attente', 
      'Terminé': 'termine',
      'Accepté': 'accepte',
      'Refusé': 'refuse'
    };
    return statusMap[status] || 'inactif';
  };

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des données...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard-container">
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchData} className="retry-button">Réessayer</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <h1 className="title">Administration</h1>
            <p className="subtitle">Gérez les utilisateurs, services, projets et devis</p>
          </div>
          <Settings size={24} color="#007bff" />
        </div>
      </div>

      <div className="main-content">
        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Utilisateurs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon projects">
              <FolderOpen size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProjects}</h3>
              <p>Projets</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon services">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalServices}</h3>
              <p>Services</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon quotes">
              <MessageSquare size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalQuotes}</h3>
              <p>Devis</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="action-card">
          <div className="action-buttons">
            <button className="action-button" onClick={handleAddUser}>
              <User size={16} /> Ajouter un Utilisateur
            </button>
            <button className="action-button" onClick={handleAddService}>
              <FileText size={16} /> Ajouter un Service
            </button>
            <button className="action-button" onClick={handleAddProject}>
              <Plus size={16} /> Ajouter un Projet
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="content-card">
          <div className="tab-container">
            <nav className="tab-nav">
              <button 
                className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} 
                onClick={() => setActiveTab('users')}
              >
                <Users size={16} /> Utilisateurs ({users.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'services' ? 'active' : ''}`} 
                onClick={() => setActiveTab('services')}
              >
                <FileText size={16} /> Services ({services.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`} 
                onClick={() => setActiveTab('projects')}
              >
                <FolderOpen size={16} /> Projets ({projects.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'quotes' ? 'active' : ''}`} 
                onClick={() => setActiveTab('quotes')}
              >
                <MessageSquare size={16} /> Devis ({quotes.length})
              </button>
            </nav>
          </div>

          <div className="tab-content">
            {/* Onglet Utilisateurs */}
            {activeTab === 'users' && (
              <div>
                <h2 className="section-title">Liste des Utilisateurs</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead className="table-header">
                      <tr className="table-row">
                        <th className="table-header-cell">Nom</th>
                        <th className="table-header-cell">Email</th>
                        <th className="table-header-cell">Rôle</th>
                        <th className="table-header-cell">Statut</th>
                        <th className="table-header-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="table-row">
                          <td className="table-cell">
                            <div className="user-info">
                              <div className="avatar">
                                <span className="avatar-text">{user.avatar}</span>
                              </div>
                              <div className="user-name">{user.name}</div>
                            </div>
                          </td>
                          <td className="table-cell">{user.email}</td>
                          <td className="table-cell">
                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="table-cell">
                            <span className={`status-badge ${getStatusClass(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="table-cell">
                            <div className="action-buttons-table">
                              <button 
                                className="icon-button edit" 
                                onClick={() => handleEditUser(user.id)} 
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="icon-button delete" 
                                onClick={() => handleDeleteUser(user.id)} 
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
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

            {/* Onglet Services */}
            {activeTab === 'services' && (
              <div>
                <h2 className="section-title">Liste des Services</h2>
                <div className="services-grid">
                  {services.map((service) => (
                    <div key={service.id} className="service-card">
                      <div className="service-header">
                        <div className="service-icon">
                          <FileText size={24} />
                        </div>
                        <div className="service-actions">
                          <button 
                            className="icon-button edit" 
                            onClick={() => handleEditService(service.id)}
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="icon-button delete" 
                            onClick={() => handleDeleteService(service.id)}
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="service-content">
                        <h3 className="service-title">{service.name}</h3>
                        <p className="service-description">{service.description}</p>
                        <div className="service-details">
                          <span className="service-price">Tarif: {service.tarifBase}€</span>
                          {service.exemples && (
                            <span className="service-examples">Exemples: {service.exemples}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Projets */}
            {activeTab === 'projects' && (
              <div>
                <h2 className="section-title">Liste des Projets</h2>
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project.id} className="project-card">
                      <div className="project-header">
                        <div className="project-icon">
                          <FolderOpen size={24} />
                        </div>
                        <span className={`status-badge ${getStatusClass(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="project-content">
                        <h3 className="project-title">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                        <div className="project-details">
                          <p><strong>Service:</strong> {project.service || 'Non assigné'}</p>
                          <p><strong>Client:</strong> {project.client}</p>
                          <p><strong>Employé:</strong> {project.employe}</p>
                        </div>
                      </div>
                      <div className="project-actions">
                        <button 
                          className="project-action-button modify"
                          onClick={() => handleEditProject(project.id)}
                        >
                          <Edit size={16} /> Modifier
                        </button>
                        <button 
                          className="project-action-button delete"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 size={16} /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Devis */}
            {activeTab === 'quotes' && (
              <div>
                <h2 className="section-title">Liste des Devis</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead className="table-header">
                      <tr className="table-row">
                        <th className="table-header-cell">Numéro</th>
                        <th className="table-header-cell">Demandeur</th>
                        <th className="table-header-cell">Email</th>
                        <th className="table-header-cell">Service</th>
                        <th className="table-header-cell">Budget</th>
                        <th className="table-header-cell">Statut</th>
                        <th className="table-header-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => (
                        <tr key={quote.id} className="table-row">
                          <td className="table-cell">{quote.numero}</td>
                          <td className="table-cell">{quote.demandeur}</td>
                          <td className="table-cell">{quote.email}</td>
                          <td className="table-cell">{quote.service || 'Non spécifié'}</td>
                          <td className="table-cell">{quote.budget}</td>
                          <td className="table-cell">
                            <span className={`status-badge ${getStatusClass(quote.status)}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="table-cell">
                            <div className="action-buttons-table">
                              <button 
                                className="icon-button edit" 
                                onClick={() => handleEditQuote(quote.id)} 
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="icon-button delete" 
                                onClick={() => handleDeleteQuote(quote.id)} 
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;