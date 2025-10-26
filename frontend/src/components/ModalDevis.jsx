import React from 'react';
import axios from 'axios';
import '../styles/ModalDevis.css';


const ModalDevis = ({ devis, onClose, onStatusChange }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/devis/${devis.idDevis}`, {
        statut: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      onStatusChange(devis.idDevis, newStatus);
      onClose();
      alert('Statut du devis mis à jour avec succès !');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du devis:', err);
      alert('Erreur lors de la mise à jour du devis');
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Répondre au Devis #{devis.numeroDevis}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="quote-details">
            <p><strong>Demandeur :</strong> {devis.nomDemandeur} {devis.prenomDemandeur}</p>
            <p><strong>Email :</strong> {devis.emailDemandeur}</p>
            <p><strong>Service :</strong> {devis.serviceNom}</p>
            <p><strong>Budget estimé :</strong> {devis.budgetEstime}€</p>
            <p><strong>Description :</strong> {devis.description}</p>
            <p>
              <strong>Statut actuel :</strong>{' '}
              <span className={`status-badge status-${devis.statut.toLowerCase().replace(' ', '-')}`}>
                {devis.statut}
              </span>
            </p>
          </div>
          <div className="status-actions">
            <h3>Changer le statut :</h3>
            <div className="status-buttons">
              <button
                className="status-btn btn-accepte"
                onClick={() => handleStatusChange('Accepté')}
                disabled={devis.statut === 'Accepté'}
              >
                ✓ Accepter
              </button>
              <button
                className="status-btn btn-refuse"
                onClick={() => handleStatusChange('Refusé')}
                disabled={devis.statut === 'Refusé'}
              >
                ✗ Refuser
              </button>
              <button
                className="status-btn btn-enattente"
                onClick={() => handleStatusChange('En attente')}
                disabled={devis.statut === 'En attente'}
              >
                ⏱ En attente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ModalDevis;




