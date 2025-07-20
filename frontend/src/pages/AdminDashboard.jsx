import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Users, FolderOpen, Plus, Edit, Trash2, User, FileText, MessageSquare, BarChart3, Star, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import ServiceModal from '../components/ServiceModal';
import ProjectModal from '../components/ProjectModal';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [reviews, setReviews] = useState([]); // Nouveau : avis Firebase
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalServices: 0,
    totalQuotes: 0,
    totalReviews: 0 // Nouveau
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditService, setIsEditService] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [clients, setClients] = useState([]);
  const [employes, setEmployes] = useState([]);

  // Configuration axios avec token
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Utiliser useCallback pour éviter les dépendances manquantes
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer toutes les données en parallèle
      const [usersRes, projectsRes, servicesRes, quotesRes, reviewsRes] = await Promise.all([
        api.get('/utilisateurs/employees-and-admins'),
        api.get('/projets'),
        api.get('/services'),
        api.get('/devis'),
        api.get('/avis/debug/firebase') // Lire les VRAIS avis Firebase
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
        dateCreation: service.dateCreation,
        statut: service.statut // Ajout du champ statut pour filtrage
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

      // Nouveau : traiter les avis Firebase
      setReviews(reviewsRes.data.data.map(review => ({
        id: review.firebaseId, // Utiliser l'ID Firebase
        clientName: review.clientName, // Structure Firebase
        clientRole: review.clientRole,
        rating: review.rating, // Structure Firebase
        message: review.message, // Structure Firebase
        status: review.status, // Structure Firebase
        projetId: review.projectId,
        projetTitre: review.projectTitle || 'Projet non spécifié',
        dateCreation: review.createdAt
      })));

      // Calculer les statistiques
      setStats({
        totalUsers: usersRes.data.data.length,
        totalProjects: projectsRes.data.data.length,
        totalServices: servicesRes.data.data.length,
        totalQuotes: quotesRes.data.data.length,
        totalReviews: reviewsRes.data.data.length // Nouveau
      });

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []); // Suppression de la dépendance api pour éviter la boucle infinie

  useEffect(() => {
    // Vérifier l'authentification et les permissions
    if (!isAuthenticated) {
      navigate('/connexion');
      return;
    }
    
    if (user?.role !== 'Administrateur') {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [isAuthenticated, user, navigate]); // Dépendances ajoutées

  // Récupérer clients et employés pour les dropdowns
  useEffect(() => {
    // Récupère tous les utilisateurs pour les listes déroulantes
    api.get('/utilisateurs/employees-and-admins')
      .then(res => {
        setClients(res.data.data.filter(u => u.role === 'Client'));
        setEmployes(res.data.data.filter(u => u.role === 'Employé'));
      })
      .catch(() => {
        setClients([]);
        setEmployes([]);
      });
  }, []);

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
    const user = users.find(u => u.id === userId);
    if (user) {
      // Séparer le nom complet en nom et prénom
      const nameParts = user.name.split(' ');
      const nom = nameParts.slice(0, -1).join(' '); // Tout sauf le dernier élément
      const prenom = nameParts[nameParts.length - 1]; // Dernier élément
      
      setSelectedUser({
        id: user.id,
        email: user.email,
        nom: nom,
        prenom: prenom,
        role: user.role
      });
      setShowEditUserModal(true);
    }
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

  // Modification projet
  const handleEditProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject({
        ...project,
        typeServiceId: project.serviceId || '',
        clientId: project.clientId || '',
        employeId: project.employeId || ''
      });
      setShowProjectModal(true);
    }
  };

  // Sauvegarde (ajout ou modif)
  const handleProjectSave = async (form) => {
    try {
      if (selectedProject) {
        // Modification
        await api.put(`/projets/${selectedProject.id}`, form);
      } else {
        // Ajout
        await api.post('/projets', form);
      }
      setShowProjectModal(false);
      setSelectedProject(null);
      fetchData(); // Rafraîchir la liste
    } catch (err) {
      setError('Erreur lors de la sauvegarde du projet: ' + (err.response?.data?.message || err.message));
    }
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
    // TODO: Implémenter modal de modification de devis
    alert(`Fonctionnalité de modification de devis ${quoteId} à implémenter`);
  };

  // NOUVEAU : Actions CRUD pour les avis Firebase
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      try {
        // Pour Firebase, on utilise une route spéciale
        await api.delete(`/avis/firebase/${reviewId}`);
        setReviews(reviews.filter(review => review.id !== reviewId));
        setStats(prev => ({ ...prev, totalReviews: prev.totalReviews - 1 }));
      } catch (err) {
        setError('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEditReview = async (reviewId) => {
    // TODO: Implémenter la modification d'avis avec modal
    console.log('Éditer avis:', reviewId);
    // Pour l'instant, on peut juste changer le statut
    const newStatus = prompt('Nouveau statut (pending/approved/rejected):');
    if (newStatus && ['pending', 'approved', 'rejected'].includes(newStatus)) {
      try {
        await api.put(`/avis/firebase/${reviewId}`, { status: newStatus });
        fetchData(); // Recharger les données
      } catch (err) {
        setError('Erreur lors de la modification: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleValidateReview = async (reviewId, status) => {
    try {
      // Pour Firebase, on utilise une route spéciale
      await api.patch(`/avis/firebase/${reviewId}/validate`, { status });
      // Recharger les données
      fetchData();
    } catch (err) {
      setError('Erreur lors de la validation: ' + (err.response?.data?.message || err.message));
    }
  };

  // Actions d'ajout
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleUserAdded = (newUser) => {
    // Ajouter le nouvel utilisateur à la liste
    const userToAdd = {
      id: newUser.id,
      name: `${newUser.nom} ${newUser.prenom}`,
      email: newUser.email,
      role: newUser.role,
      status: 'Actif',
      avatar: `${newUser.nom[0]}${newUser.prenom[0]}`.toUpperCase(),
      dateCreation: new Date().toISOString()
    };
    setUsers(prev => [userToAdd, ...prev]);
    setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
  };

  const handleUserUpdated = (updatedUser) => {
    // Mettre à jour l'utilisateur dans la liste
    const userToUpdate = {
      id: updatedUser.idUtilisateur,
      name: `${updatedUser.nom} ${updatedUser.prenom}`,
      email: updatedUser.email,
      role: updatedUser.role,
      status: 'Actif',
      avatar: `${updatedUser.nom[0]}${updatedUser.prenom[0]}`.toUpperCase(),
      dateCreation: updatedUser.dateCreation
    };
    setUsers(prev => prev.map(user => user.id === userToUpdate.id ? userToUpdate : user));
  };
  
  const handleAddService = () => {
    setSelectedService(null);
    setIsEditService(false);
    setShowServiceModal(true);
  };

  const handleEditService = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setIsEditService(true);
      setShowServiceModal(true);
    }
  };

  const handleServiceAdded = (newService) => {
    // Ajouter le nouveau service à la liste
    const serviceToAdd = {
      id: newService.idService,
      name: newService.titre,
      description: newService.description,
      tarifBase: newService.tarifBase,
      exemples: newService.exemples,
      statut: newService.statut,
      dateCreation: newService.dateCreation
    };
    setServices(prev => [serviceToAdd, ...prev]);
    setStats(prev => ({ ...prev, totalServices: prev.totalServices + 1 }));
  };

  const handleServiceUpdated = (updatedService) => {
    // Mettre à jour le service dans la liste
    const serviceToUpdate = {
      id: updatedService.idService,
      name: updatedService.titre,
      description: updatedService.description,
      tarifBase: updatedService.tarifBase,
      exemples: updatedService.exemples,
      statut: updatedService.statut,
      dateCreation: updatedService.dateCreation
    };
    setServices(prev => prev.map(service => service.id === serviceToUpdate.id ? serviceToUpdate : service));
  };

  // NOUVEAU : Synchroniser Firebase
  const handleSyncFirebase = async () => {
    try {
      const response = await api.post('/avis/sync/firebase');
      alert(response.data.message);
      fetchData(); // Recharger les données
    } catch (err) {
      setError('Erreur synchronisation: ' + (err.response?.data?.message || err.message));
    }
  };

  // Ajout projet
  const handleAddProject = () => {
    setSelectedProject(null);
    setShowProjectModal(true);
  };

  const getStatusClass = (status) => {
    const statusMap = { 
      'Actif': 'actif', 
      'En cours': 'en-cours', 
      'Inactif': 'inactif', 
      'En attente': 'en-attente', 
      'Terminé': 'termine',
      'Accepté': 'accepte',
      'Refusé': 'refuse',
      'pending': 'en-attente',
      'approved': 'accepte',
      'rejected': 'refuse'
    };
    return statusMap[status] || 'inactif';
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Vérifier l'authentification
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-error-container">
          <p className="admin-error-message">Vous devez être connecté pour accéder à cette page</p>
          <button onClick={() => navigate('/connexion')} className="admin-retry-button">Se connecter</button>
        </div>
      </div>
    );
  }

  // Vérifier les permissions
  if (user?.role !== 'Administrateur') {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-error-container">
          <p className="admin-error-message">Vous n'avez pas les permissions pour accéder à cette page</p>
          <button onClick={() => navigate('/')} className="admin-retry-button">Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="admin-dashboard-container">
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>Chargement des données...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="admin-dashboard-container">
      <div className="admin-error-container">
        <p className="admin-error-message">{error}</p>
        <button onClick={fetchData} className="admin-retry-button">Réessayer</button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <h1 className="admin-title">Administration</h1>
            <p className="admin-subtitle">Gérez les utilisateurs, services, projets, devis et avis</p>
          </div>
          <Settings size={24} color="#007bff" />
        </div>
      </div>

      <div className="admin-main-content">
        {/* Statistiques */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={24} color="#2563eb" />
            </div>
            <div className="admin-stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Utilisateurs</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FolderOpen size={24} color="#2563eb" />
            </div>
            <div className="admin-stat-content">
              <h3>{stats.totalProjects}</h3>
              <p>Projets</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FileText size={24} color="#2563eb" />
            </div>
            <div className="admin-stat-content">
              <h3>{stats.totalServices}</h3>
              <p>Services</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <MessageSquare size={24} color="#2563eb" />
            </div>
            <div className="admin-stat-content">
              <h3>{stats.totalQuotes}</h3>
              <p>Devis</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Star size={24} color="#2563eb" />
            </div>
            <div className="admin-stat-content">
              <h3>{stats.totalReviews}</h3>
              <p>Avis</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="admin-action-card">
          <div className="admin-action-buttons">
            <button className="admin-action-button" onClick={handleAddUser}>
              <User size={16} /> Ajouter un Utilisateur
            </button>
            <button className="admin-action-button" onClick={handleAddService}>
              <FileText size={16} /> Ajouter un Service
            </button>
            <button className="admin-action-button" onClick={handleAddProject}>
              <Plus size={16} /> Ajouter un Projet
            </button>
            {/* Supprimé : L'admin ne crée pas d'avis selon le cahier des charges */}
            <button className="admin-action-button" onClick={handleSyncFirebase}>
              <MessageCircle size={16} /> Synchroniser Firebase
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="admin-content-card">
          <div className="admin-tab-container">
            <nav className="admin-tab-nav">
              <button 
                className={`admin-tab-button ${activeTab === 'users' ? 'active' : ''}`} 
                onClick={() => setActiveTab('users')}
              >
                <Users size={16} /> Utilisateurs ({users.length})
              </button>
              <button 
                className={`admin-tab-button ${activeTab === 'services' ? 'active' : ''}`} 
                onClick={() => setActiveTab('services')}
              >
                <FileText size={16} /> Services ({services.length})
              </button>
              <button 
                className={`admin-tab-button ${activeTab === 'projects' ? 'active' : ''}`} 
                onClick={() => setActiveTab('projects')}
              >
                <FolderOpen size={16} /> Projets ({projects.length})
              </button>
              <button 
                className={`admin-tab-button ${activeTab === 'quotes' ? 'active' : ''}`} 
                onClick={() => setActiveTab('quotes')}
              >
                <MessageSquare size={16} /> Devis ({quotes.length})
              </button>
              <button 
                className={`admin-tab-button ${activeTab === 'reviews' ? 'active' : ''}`} 
                onClick={() => setActiveTab('reviews')}
              >
                <Star size={16} /> Avis ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="admin-tab-content">
            {/* Onglet Utilisateurs */}
            {activeTab === 'users' && (
              <div>
                <h2 className="admin-section-title">Liste des Utilisateurs</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead className="admin-table-header">
                      <tr className="admin-table-row">
                        <th className="admin-table-header-cell">Nom</th>
                        <th className="admin-table-header-cell">Email</th>
                        <th className="admin-table-header-cell">Rôle</th>
                        <th className="admin-table-header-cell">Statut</th>
                        <th className="admin-table-header-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="admin-table-row">
                          <td className="admin-table-cell">
                            <div className="admin-user-info">
                              <div className="admin-avatar">
                                <span className="admin-avatar-text">{user.avatar}</span>
                              </div>
                              <div className="admin-user-name">{user.name}</div>
                            </div>
                          </td>
                          <td className="admin-table-cell">{user.email}</td>
                          <td className="admin-table-cell">
                            <span className={`admin-role-badge ${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="admin-table-cell">
                            <span className={`admin-status-badge ${getStatusClass(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="admin-table-cell">
                            <div className="admin-action-buttons-table">
                              <button 
                                className="admin-icon-button edit" 
                                onClick={() => handleEditUser(user.id)} 
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="admin-icon-button delete" 
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
                <h2 className="admin-section-title">Liste des Services</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead className="admin-table-header">
                      <tr className="admin-table-row">
                        <th className="admin-table-header-cell">Titre</th>
                        <th className="admin-table-header-cell">Description</th>
                        <th className="admin-table-header-cell">Tarif</th>
                        <th className="admin-table-header-cell">Statut</th>
                        <th className="admin-table-header-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id} className="admin-table-row">
                          <td className="admin-table-cell">
                            <div className="admin-service-info">
                              <div className="admin-service-icon-small">
                                <FileText size={16} color="#2563eb" />
                              </div>
                              <div className="admin-service-name">{service.name}</div>
                            </div>
                          </td>
                          <td className="admin-table-cell">
                            <div className="admin-service-description-cell">
                              {service.description.length > 100 
                                ? `${service.description.substring(0, 100)}...` 
                                : service.description}
                            </div>
                          </td>
                          <td className="admin-table-cell">
                            <span className="admin-service-price">{service.tarifBase}€</span>
                          </td>
                          <td className="admin-table-cell">
                            <span className={`admin-status-badge ${getStatusClass(service.statut)}`}>
                              {service.statut === 'actif' ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="admin-table-cell">
                            <div className="admin-action-buttons-table">
                              <button 
                                className="admin-icon-button edit" 
                                onClick={() => handleEditService(service.id)} 
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="admin-icon-button delete" 
                                onClick={() => handleDeleteService(service.id)} 
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

            {/* Onglet Projets */}
            {activeTab === 'projects' && (
              <div>
                <h2 className="admin-section-title">Liste des Projets</h2>
                <div className="admin-projects-grid">
                  {projects.map((project) => (
                    <div key={project.id} className="admin-project-card">
                      <div className="admin-project-header">
                        <div className="admin-project-icon">
                          <FolderOpen size={24} color="#2563eb" />
                        </div>
                        <span className={`admin-status-badge ${getStatusClass(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="admin-project-content">
                        <h3 className="admin-project-title">{project.name}</h3>
                        <p className="admin-project-description">{project.description}</p>
                        <div className="admin-project-details">
                          <p><strong>Service:</strong> {project.service || 'Non assigné'}</p>
                          <p><strong>Client:</strong> {project.client}</p>
                          <p><strong>Employé:</strong> {project.employe}</p>
                        </div>
                      </div>
                      <div className="admin-project-actions">
                        <button 
                          className="admin-project-action-button modify"
                          onClick={() => handleEditProject(project.id)}
                        >
                          <Edit size={16} /> Modifier
                        </button>
                        <button 
                          className="admin-project-action-button delete"
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
                <h2 className="admin-section-title">Liste des Devis</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead className="admin-table-header">
                      <tr className="admin-table-row">
                        <th className="admin-table-header-cell">Numéro</th>
                        <th className="admin-table-header-cell">Demandeur</th>
                        <th className="admin-table-header-cell">Email</th>
                        <th className="admin-table-header-cell">Service</th>
                        <th className="admin-table-header-cell">Budget</th>
                        <th className="admin-table-header-cell">Statut</th>
                        <th className="admin-table-header-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => (
                        <tr key={quote.id} className="admin-table-row">
                          <td className="admin-table-cell">{quote.numero}</td>
                          <td className="admin-table-cell">{quote.demandeur}</td>
                          <td className="admin-table-cell">{quote.email}</td>
                          <td className="admin-table-cell">{quote.service || 'Non spécifié'}</td>
                          <td className="admin-table-cell">{quote.budget}</td>
                          <td className="admin-table-cell">
                            <span className={`admin-status-badge ${getStatusClass(quote.status)}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="admin-table-cell">
                            <div className="admin-action-buttons-table">
                              <button 
                                className="admin-icon-button edit" 
                                onClick={() => handleEditQuote(quote.id)} 
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="admin-icon-button delete" 
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

            {/* NOUVEAU : Onglet Avis */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="admin-section-title">Liste des Avis Clients</h2>
                <div className="admin-reviews-grid">
                  {reviews.map((review) => (
                    <div key={review.id} className="admin-review-card">
                      <div className="admin-review-header">
                        <div className="admin-review-icon">
                          <Star size={24} color="#2563eb" />
                        </div>
                        <span className={`admin-status-badge ${getStatusClass(review.status)}`}>
                          {review.status === 'pending' ? 'En attente' : 
                           review.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </span>
                      </div>
                      <div className="admin-review-content">
                        <h3 className="admin-review-title">{review.clientName}</h3>
                        {review.clientRole && (
                          <p className="admin-review-role">{review.clientRole}</p>
                        )}
                        <div className="admin-review-rating">
                          <span className="admin-stars">{renderStars(review.rating)}</span>
                          <span className="admin-rating-text">({review.rating}/5)</span>
                        </div>
                        <p className="admin-review-message">"{review.message}"</p>
                        {review.projetTitre && (
                          <p className="admin-review-project">
                            <strong>Projet:</strong> {review.projetTitre}
                          </p>
                        )}
                      </div>
                      <div className="admin-review-actions">
                        {review.status === 'pending' && (
                          <>
                            <button 
                              className="admin-review-action-button approve"
                              onClick={() => handleValidateReview(review.id, 'approved')}
                            >
                              <Star size={16} /> Approuver
                            </button>
                            <button 
                              className="admin-review-action-button reject"
                              onClick={() => handleValidateReview(review.id, 'rejected')}
                            >
                              <Trash2 size={16} /> Rejeter
                            </button>
                          </>
                        )}
                        <button 
                          className="admin-review-action-button modify"
                          onClick={() => handleEditReview(review.id)}
                        >
                          <Edit size={16} /> Modifier
                        </button>
                        <button 
                          className="admin-review-action-button delete"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 size={16} /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'utilisateur */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={handleUserAdded}
      />

      {/* Modal de modification d'utilisateur */}
      <EditUserModal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setSelectedUser(null);
        }}
        onUserUpdated={handleUserUpdated}
        user={selectedUser}
      />

      {/* Modal de service */}
      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setSelectedService(null);
          setIsEditService(false);
        }}
        onServiceAdded={handleServiceAdded}
        onServiceUpdated={handleServiceUpdated}
        service={selectedService}
        isEdit={isEditService}
      />

      {/* Modal de projet */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => { setShowProjectModal(false); setSelectedProject(null); }}
        onSave={handleProjectSave}
        services={services.filter(s => s.statut === 'actif')}
        clients={clients}
        employes={employes}
        project={selectedProject}
      />
    </div>
  );
};

export default AdminDashboard;