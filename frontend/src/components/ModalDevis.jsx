import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ModalDevis.css';


const ModalDevis = ({ devis, onClose, onStatusChange }) => {
  const [reponseEmail, setReponseEmail] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmitResponse = async (e) => {
    e.preventDefault();


    if (!reponseEmail.trim()) {
      alert('Veuillez entrer une réponse avant d\'envoyer');
      return;
    }


    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/devis/${devis.idDevis}/response`, {
        reponseEmail: reponseEmail,
        statut: 'Traité'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      onStatusChange(devis.idDevis, 'Traité');
      onClose();
      alert('Réponse envoyée avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la réponse:', err);
      alert('Erreur lors de l\'envoi de la réponse');
    } finally {
      setLoading(false);
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


          <form onSubmit={handleSubmitResponse} className="response-form">
            <h3>Votre réponse au client :</h3>
            <textarea
              className="response-textarea"
              value={reponseEmail}
              onChange={(e) => setReponseEmail(e.target.value)}
              placeholder="Bonjour,&#10;&#10;Nous avons bien reçu votre demande de devis...&#10;&#10;Cordialement,&#10;L'équipe Digital Craft"
              rows="8"
              required
            />


            <div className="modal-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : '📧 Envoyer la réponse'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default ModalDevis;




