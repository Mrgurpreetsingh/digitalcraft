import React, { useState, useEffect } from 'react';
import { User, Mail, FileText, Send } from 'lucide-react';
import '../styles/Devis.css';


const DevisPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    typeServiceId: '',
    budgetEstime: '',
    description: '',
    rgpd: false
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Menu budget plus réaliste
  const budgetOptions = [
    { value: '0-1000', label: '0€ - 1 000€' },
    { value: '1000-3000', label: '1 000€ - 3 000€' },
    { value: '3000-6000', label: '3 000€ - 6 000€' },
    { value: '6000-10000', label: '6 000€ - 10 000€' },
    { value: '10000+', label: '10 000€ et plus' }
  ];


  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/services/public/actifs')
      .then(res => {
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setServices(data.data || []);
        if (!data.data) console.warn('Aucune donnée "data" dans la réponse:', data);
      })
      .catch(err => {
        console.error('Erreur lors du fetch des services:', err);
        setError('Impossible de charger les services. Veuillez réessayer plus tard.');
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rgpd) {
      alert('Veuillez accepter la politique de confidentialité et la RGPD.');
      return;
    }
    if (!formData.nom || !formData.prenom) {
      alert('Veuillez saisir un prénom et un nom.');
      return;
    }
    if (!formData.typeServiceId) {
      alert('Veuillez sélectionner un service.');
      return;
    }
    setLoading(true);
    const payload = {
      nomDemandeur: formData.nom,
      prenomDemandeur: formData.prenom,
      emailDemandeur: formData.email,
      budgetEstime: formData.budgetEstime,
      description: formData.description,
      typeServiceId: formData.typeServiceId
    };
    try {
      const res = await fetch('http://localhost:5000/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Votre demande de devis a bien été envoyée !');
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          typeServiceId: '',
          budgetEstime: '',
          description: '',
          rgpd: false
        });
      } else {
        alert(data.message || 'Erreur lors de la demande de devis');
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };


  const processSteps = [
    "Analyse de votre demande",
    "Proposition personnalisée",
    "Réponse sous 24h"
  ];


  return (
    <div className="devis-container">
      <div className="devis-left-side">
        <h1 className="devis-title">Demander un Devis</h1>
        <p className="devis-subtitle">Personnalisez votre projet avec nous</p>
        <p className="devis-description">
          Décrivez-nous votre projet et obtenez un devis personnalisé adapté à
          vos besoins et votre budget.
        </p>
        <div>
          <h3 className="devis-steps-title">Notre processus :</h3>
          <div className="devis-steps-list">
            {processSteps.map((step, index) => (
              <div key={index} className="devis-step-item">
                <div className="devis-step-number">{index + 1}</div>
                <div className="devis-step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="devis-right-side">
        <div className="devis-form-container">
          <div className="devis-form-header">
            <div className="devis-icon-container">
              <FileText style={{ height: '2rem', width: '2rem', color: '#ffffff' }} />
            </div>
            <h2 className="devis-form-title">Votre Projet</h2>
            <p className="devis-form-subtitle">Remplissez le formulaire pour recevoir votre devis</p>
          </div>
          <div>
            {error && <p className="devis-error">{error}</p>}
            {loading && <p className="devis-loading">Chargement des services...</p>}
            <div className="devis-field-container">
              <label className="devis-label">
                Prénom <span className="devis-required">*</span>
              </label>
              <div className="devis-input-container">
                <User className="devis-input-icon" />
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  className="devis-input"
                  required
                />
              </div>
            </div>
            <div className="devis-field-container">
              <label className="devis-label">
                Nom <span className="devis-required">*</span>
              </label>
              <div className="devis-input-container">
                <User className="devis-input-icon" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  className="devis-input"
                  required
                />
              </div>
            </div>
            <div className="devis-field-container">
              <label className="devis-label">
                Email <span className="devis-required">*</span>
              </label>
              <div className="devis-input-container">
                <Mail className="devis-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="devis-input"
                  required
                />
              </div>
            </div>
            <div className="devis-field-container">
              <label className="devis-label">
                Type de service <span className="devis-required">*</span>
              </label>
              <div className="devis-input-container">
                <select
                  name="typeServiceId"
                  value={formData.typeServiceId}
                  onChange={handleInputChange}
                  className="devis-select"
                  required
                >
                  <option value="">Sélectionnez un service</option>
                  {services.map((service) => (
                    <option key={service.idService} value={service.idService}>
                      {service.titre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="devis-field-container">
              <label className="devis-label">
                Budget estimé <span className="devis-required">*</span>
              </label>
              <div className="devis-input-container">
                <select
                  name="budgetEstime"
                  value={formData.budgetEstime}
                  onChange={handleInputChange}
                  className="devis-select"
                  required
                >
                  <option value="">Sélectionnez un budget</option>
                  {budgetOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="devis-field-container">
              <label className="devis-label">
                Description du projet <span className="devis-required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez votre projet, vos objectifs et vos besoins spécifiques..."
                className="devis-textarea"
                required
              />
            </div>
            <div className="devis-field-container">
              <div className="devis-checkbox-container">
                <input
                  type="checkbox"
                  name="rgpd"
                  checked={formData.rgpd}
                  onChange={handleInputChange}
                  className="devis-checkbox"
                  required
                />
                <label className="devis-checkbox-label">
                  J'accepte que mes données soient utilisées pour traiter ma demande, conformément à la <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer">politique de confidentialité</a> et à la réglementation sur la protection des données personnelles (RGPD).
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="devis-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Send size={20} />
              <span>{loading ? 'Envoi...' : 'Soumettre ma demande'}</span>
            </button>
            <div className="devis-footer-note">
              <span>🔒</span>
              <span>Vos informations sont sécurisées et confidentielles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DevisPage;




