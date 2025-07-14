import React, { useState } from 'react';
import { Settings, Users, FolderOpen, Plus, Edit, Trash2, User } from 'lucide-react';
import ProjectsGrid from '../components/ProjectsGrid';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Jean Dupont', 
      email: 'jean.dupont@email.com', 
      status: 'Actif',
      avatar: 'JD'
    },
    { 
      id: 2, 
      name: 'Marie Martin', 
      email: 'marie.martin@email.com', 
      status: 'Actif',
      avatar: 'MM'
    },
    { 
      id: 3, 
      name: 'Pierre Durand', 
      email: 'pierre.durand@email.com', 
      status: 'Inactif',
      avatar: 'PD'
    }
  ]);

  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'Site E-commerce', 
      description: 'Boutique en ligne pour vêtements', 
      status: 'En cours',
      icon: '🛍️'
    },
    { 
      id: 2, 
      name: 'App Mobile', 
      description: 'Application de livraison', 
      status: 'En attente',
      icon: '📱'
    },
    { 
      id: 3, 
      name: 'Campagne SEO', 
      description: 'Optimisation référencement', 
      status: 'Terminé',
      icon: '🔍'
    },
    { 
      id: 4, 
      name: 'Réseaux Sociaux', 
      description: 'Gestion community management', 
      status: 'En cours',
      icon: '📱'
    }
  ]);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setProjects(projects.filter(project => project.id !== projectId));
    }
  };

  const handleEditUser = (userId) => {
    console.log('Éditer utilisateur:', userId);
  };

  const handleEditProject = (projectId) => {
    console.log('Éditer projet:', projectId);
  };

  const handleAddUser = () => {
    console.log('Ajouter utilisateur');
  };

  const handleAddProject = () => {
    console.log('Ajouter projet');
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Actif': 'actif',
      'En cours': 'en-cours',
      'Inactif': 'inactif',
      'En attente': 'en-attente',
      'Terminé': 'termine'
    };
    return statusMap[status] || 'inactif';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <h1 className="title">Administration</h1>
            <p className="subtitle">Gérez les utilisateurs et les projets</p>
          </div>
          <Settings size={24} color="#007bff" />
        </div>
      </div>

      <div className="main-content">
        {/* Action Buttons */}
        <div className="action-card">
          <div className="action-buttons">
            <button className="action-button" onClick={handleAddUser}>
              <User size={16} />
              Ajouter un Utilisateur
            </button>
            <button className="action-button" onClick={handleAddProject}>
              <Plus size={16} />
              Ajouter un Projet
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="content-card">
          {/* Tabs */}
          <div className="tab-container">
            <nav className="tab-nav">
              <button 
                className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={16} />
                Utilisateurs
              </button>
              <button 
                className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <FolderOpen size={16} />
                Projets
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'users' && (
              <div>
                <h2 className="section-title">Liste des Utilisateurs</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead className="table-header">
                      <tr className="table-row">
                        <th className="table-header-cell">Nom</th>
                        <th className="table-header-cell">Email</th>
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

            {activeTab === 'projects' && (
              <ProjectsGrid 
                projects={projects}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;