import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModalEditionDevis.css';


const ModalEditionDevis = ({ isOpen, onClose, quote, onUpdated }) => {
  const [formData, setFormData] = useState({
    nomDemandeur: '',
    prenomDemandeur: '',
    emailDemandeur: '',
    telephoneDemandeur: '',
    budgetEstime: '',
    description: '',
    statut: 'En attente'
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen && quote) {
      // Pré-remplir le formulaire avec les données du devis
      setFormData({
        nomDemandeur: quote.nomDemandeur || '',
        prenomDemandeur: quote.prenomDemandeur || '',
        emailDemandeur: quote.emailDemandeur || quote.email || '',
        telephoneDemandeur: quote.telephoneDemandeur || '',
        budgetEstime: quote.budgetEstime || quote.budget || '',
        description: quote.description || '',
        statut: quote.statut || quote.status || 'En attente'
      });
    }
  }, [isOpen, quote]);


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


      await axios.put(`http://localhost:5000/api/devis/${quote.idDevis || quote.id}`, {
        ...formData,
        budgetEstime: parseFloat(formData.budgetEstime)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      // Informer le parent que la mise à jour a réussi
      if (onUpdated) {
        onUpdated(quote.idDevis || quote.id);
      }


      alert('Devis modifié avec succès !');
      onClose();
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      alert('Erreur lors de la modification du devis');
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier le Devis #{quote?.numeroDevis || quote?.numero}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>


        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nomDemandeur">Nom *</label>
                <input
                  type="text"
                  id="nomDemandeur"
                  name="nomDemandeur"
                  value={formData.nomDemandeur}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>


              <div className="form-group">
                <label htmlFor="prenomDemandeur">Prénom *</label>
                <input
                  type="text"
                  id="prenomDemandeur"
                  name="prenomDemandeur"
                  value={formData.prenomDemandeur}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emailDemandeur">Email *</label>
                <input
                  type="email"
                  id="emailDemandeur"
                  name="emailDemandeur"
                  value={formData.emailDemandeur}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>


              <div className="form-group">
                <label htmlFor="telephoneDemandeur">Téléphone</label>
                <input
                  type="tel"
                  id="telephoneDemandeur"
                  name="telephoneDemandeur"
                  value={formData.telephoneDemandeur}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>


            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budgetEstime">Budget estimé (€) *</label>
                <input
                  type="number"
                  id="budgetEstime"
                  name="budgetEstime"
                  value={formData.budgetEstime}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>


              <div className="form-group">
                <label htmlFor="statut">Statut *</label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="En attente">En attente</option>
                  <option value="Traité">Traité</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Refusé">Refusé</option>
                </select>
              </div>
            </div>


            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="form-textarea"
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


export default ModalEditionDevis;








