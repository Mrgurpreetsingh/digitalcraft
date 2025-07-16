import React, { useState, useEffect } from 'react';
import { Settings, Users, FolderOpen, Plus, Edit, Trash2, User } from 'lucide-react';
import ProjectsGrid from '../components/ProjectsGrid';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState({ type: null, id: null, data: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token manquant, veuillez vous connecter');
        const [usersResponse, projectsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/utilisateurs/employees-and-admins', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/projets', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersResponse.data.data.map(user => ({
          id: user.idUtilisateur,
          name: `${user.nom} ${user.prenom}`,
          email: user.email,
          status: user.status || 'Actif',
          avatar: `${user.nom[0]}${user.prenom[0]}`.toUpperCase()
        })));
        setProjects(projectsResponse.data.data.map(project => ({
          id: project.idProjet,
          name: project.titre,
          description: project.description,
          status: project.statut,
          icon: '📄'
        })));
      } catch (err) {
        setError('Erreur lors du chargement des données: ' + (err.response?.data?.message || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce ${type === 'users' ? 'utilisateur' : 'projet'}?`)) {
      try {
        const token = localStorage.getItem('token');
        const url = `http://localhost:5000/api/${type === 'users' ? 'utilisateurs' : 'projets'}/${id}`;
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
        if (type === 'users') setUsers(users.filter(u => u.id !== id));
        else if (type === 'projects') setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        setError(`Erreur lors de la suppression du ${type}`);
        console.error(err);
      }
    }
  };

  const handleEdit = (type, id, data = {}) => setShowModal({ type, id, data });
  const handleAdd = (type) => setShowModal({ type, id: null, data: {} });

  const closeModal = () => setShowModal({ type: null, id: null, data: {} });

  const handleSave = async (type, data) => {
    try {
      const token = localStorage.getItem('token');
      let url, method;
      if (showModal.id) {
        url = `http://localhost:5000/api/${type === 'users' ? 'utilisateurs' : 'projets'}/${showModal.id}`;
        method = 'put';
      } else {
        url = `http://localhost:5000/api/${type === 'users' ? 'utilisateurs/register' : 'projets'}`;
        method = 'post';
      }
      const response = await axios[method](url, { ...showModal.data, ...data }, { headers: { Authorization: `Bearer ${token}` } });
      const item = response.data.data;
      if (type === 'users') setUsers(showModal.id ? users.map(u => u.id === item.idUtilisateur ? { ...u, ...item } : u) : [...users, item]);
      else if (type === 'projects') setProjects(showModal.id ? projects.map(p => p.id === item.idProjet ? { ...p, ...item } : p) : [...projects, item]);
      closeModal();
    } catch (err) {
      setError(`Erreur lors de l'enregistrement du ${type}`);
      console.error(err);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = { 'Actif': 'actif', 'En cours': 'en-cours', 'Inactif': 'inactif', 'En attente': 'en-attente', 'Terminé': 'termine' };
    return statusMap[status] || 'inactif';
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
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
        <div className="action-card">
          <div className="action-buttons">
            <button className="action-button" onClick={() => handleAdd('users')}><User size={16} /> Ajouter Utilisateur</button>
            <button className="action-button" onClick={() => handleAdd('projects')}><Plus size={16} /> Ajouter Projet</button>
          </div>
        </div>
        <div className="content-card">
          <div className="tab-container">
            <nav className="tab-nav">
              <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                <Users size={16} /> Utilisateurs
              </button>
              <button className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                <FolderOpen size={16} /> Projets
              </button>
            </nav>
          </div>
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
                              <div className="avatar"><span className="avatar-text">{user.avatar}</span></div>
                              <div className="user-name">{user.name}</div>
                            </div>
                          </td>
                          <td className="table-cell">{user.email}</td>
                          <td className="table-cell"><span className={`status-badge ${getStatusClass(user.status)}`}>{user.status}</span></td>
                          <td className="table-cell">
                            <div className="action-buttons-table">
                              <button className="icon-button edit" onClick={() => handleEdit('users', user.id, { name: user.name, email: user.email, status: user.status })} title="Modifier"><Edit size={16} /></button>
                              <button className="icon-button delete" onClick={() => handleDelete('users', user.id)} title="Supprimer"><Trash2 size={16} /></button>
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
              <ProjectsGrid projects={projects} onEdit={id => handleEdit('projects', id, projects.find(p => p.id === id))} onDelete={id => handleDelete('projects', id)} />
            )}
          </div>
        </div>
      </div>
      {showModal.type && (
        <div className="modal">
          <div className="modal-content">
            <h3>{showModal.id ? 'Modifier' : 'Ajouter'} {showModal.type}</h3>
            <input
              value={showModal.data.name || ''}
              onChange={(e) => setShowModal({ ...showModal, data: { ...showModal.data, name: e.target.value } })}
              placeholder={showModal.type === 'users' ? 'Nom' : 'Titre'}
              className="modal-input"
            />
            {showModal.type === 'projects' && (
              <input
                value={showModal.data.description || ''}
                onChange={(e) => setShowModal({ ...showModal, data: { ...showModal.data, description: e.target.value } })}
                placeholder="Description"
                className="modal-input"
              />
            )}
            {showModal.type === 'users' && (
              <input
                value={showModal.data.email || ''}
                onChange={(e) => setShowModal({ ...showModal, data: { ...showModal.data, email: e.target.value } })}
                placeholder="Email"
                className="modal-input"
              />
            )}
            <button onClick={closeModal} className="modal-button cancel">Annuler</button>
            <button onClick={() => handleSave(showModal.type, showModal.data)} className="modal-button save">Sauvegarder</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;