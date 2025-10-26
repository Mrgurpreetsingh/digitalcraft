import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModalEditionAvis.css';


const ModalEditionAvis = ({ isOpen, onClose, review, onUpdated }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    rating: 5,
    message: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen && review) {
      setFormData({
        clientName: review.clientName || '',
        clientRole: review.clientRole || '',
        rating: review.rating || 5,
        message: review.message || '',
        status: review.status || 'pending'
      });
    }
  }, [isOpen, review]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      setLoading(true);
      const token = localStorage.getItem('token');


      await axios.put(`http://localhost:5000/api/avis/firebase/${review.id}`, {
        ...formData,
        rating: parseInt(formData.rating)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      if (onUpdated) {
        onUpdated(review.id);
      }


      alert('Avis modifié avec succès !');
      onClose();
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      alert('Erreur lors de la modification de l\'avis');
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier l'Avis</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>


        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientName">Nom du client *</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>


              <div className="form-group">
                <label htmlFor="clientRole">Fonction</label>
                <input
                  type="text"
                  id="clientRole"
                  name="clientRole"
                  value={formData.clientRole}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: CEO, Manager..."
                />
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rating">Note (1-5) *</label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="1">⭐ 1 - Très mauvais</option>
                  <option value="2">⭐⭐ 2 - Mauvais</option>
                  <option value="3">⭐⭐⭐ 3 - Moyen</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Bon</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                </select>
              </div>


              <div className="form-group">
                <label htmlFor="status">Statut *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
            </div>


            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="form-textarea"
                placeholder="Commentaire du client..."
              />
            </div>


            <div className="modal-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Enregistrement...' : '✓ Enregistrer'}
              </button>
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default ModalEditionAvis;




