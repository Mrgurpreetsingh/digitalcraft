import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import axios from 'axios';
import '../styles/ServiceCRUD.css';

const ServiceCRUD = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // État du formulaire
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    tarifBase: '',
    exemples: '',
    actif: true
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Récupérer tous les services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      setError('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Ouvrir modal pour ajouter
  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      titre: '',
      description: '',
      tarifBase: '',
      exemples: '',
      actif: true
    });
    setShowModal(true);
  };

  // Ouvrir modal pour modifier
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      titre: service.titre,
      description: service.description,
      tarifBase: service.tarifBase,
      exemples: service.exemples || '',
      actif: service.actif !== 0
    });
    setShowModal(true);
  };

  // Sauvegarder (créer ou modifier)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingService) {
        // Modifier
        await axios.put(`${API_URL}/api/services/${editingService.idService}`, formData, config);
      } else {
        // Créer
        await axios.post(`${API_URL}/api/services`, formData, config);
      }

      setShowModal(false);
      fetchServices();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde');
    }
  };

  // Supprimer un service
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression');
    }
  };

  // Filtrer et rechercher
  const filteredServices = services.filter(service => {
    const matchesSearch = service.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && service.actif !== 0) ||
                         (filterStatus === 'inactive' && service.actif === 0);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="service-crud-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des services...</p>
      </div>
    );
  }

  return (
    <div className="service-crud-container">
      {/* Header avec actions */}
      <div className="service-crud-header">
        <h2>Gestion des Services</h2>
        <button className="btn-add" onClick={handleAdd}>
          <Plus size={20} />
          Ajouter un service
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="service-crud-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={20} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous les services</option>
            <option value="active">Services actifs</option>
            <option value="inactive">Services inactifs</option>
          </select>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Liste des services */}
      <div className="service-crud-list">
        {filteredServices.length === 0 ? (
          <div className="no-services">
            <p>Aucun service trouvé</p>
          </div>
        ) : (
          filteredServices.map(service => (
            <div key={service.idService} className="service-card">
              <div className="service-info">
                <div className="service-header">
                  <h3>{service.titre}</h3>
                  <span className={`status-badge ${service.actif !== 0 ? 'active' : 'inactive'}`}>
                    {service.actif !== 0 ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-details">
                  <span className="service-price">{service.tarifBase}€</span>
                  {service.exemples && (
                    <span className="service-examples">{service.exemples}</span>
                  )}
                </div>
              </div>
              <div className="service-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEdit(service)}
                  title="Modifier"
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(service.idService)}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal pour ajouter/modifier */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingService ? 'Modifier le service' : 'Ajouter un service'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave} className="service-form">
              <div className="form-group">
                <label htmlFor="titre">Titre *</label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tarifBase">Tarif de base (€) *</label>
                <input
                  type="number"
                  id="tarifBase"
                  name="tarifBase"
                  value={formData.tarifBase}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="exemples">Exemples (optionnel)</label>
                <textarea
                  id="exemples"
                  name="exemples"
                  value={formData.exemples}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Exemples de projets réalisés..."
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="actif"
                    checked={formData.actif}
                    onChange={handleInputChange}
                  />
                  Service actif
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Annuler
                </button>
                <button type="submit" className="btn-save">
                  {editingService ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCRUD; 