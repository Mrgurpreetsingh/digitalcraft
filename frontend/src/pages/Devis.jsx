import React, { useState, useEffect } from 'react';
import { User, Mail, FileText, Send } from 'lucide-react';

const styles = {
  container: { minHeight: '100vh', display: 'flex', backgroundColor: '#f3f4f6' },
  leftSide: { flex: 1, backgroundColor: '#1e40af', color: '#ffffff', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' },
  rightSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: '#e5e7eb', minHeight: '100vh' },
  formContainer: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '2rem', width: '100%', maxWidth: '28rem' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#ffffff' },
  subtitle: { fontSize: '1.25rem', color: '#93c5fd', marginBottom: '2rem' },
  description: { fontSize: '1rem', color: '#dbeafe', marginBottom: '2rem', lineHeight: '1.6' },
  stepsTitle: { fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff' },
  stepsList: { marginBottom: '1rem' },
  stepItem: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' },
  stepNumber: { backgroundColor: '#10b981', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem' },
  stepText: { color: '#dbeafe', fontSize: '0.875rem' },
  formHeader: { textAlign: 'center', marginBottom: '2rem' },
  iconContainer: { backgroundColor: '#2563eb', borderRadius: '0.5rem', width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' },
  formTitle: { fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' },
  formSubtitle: { fontSize: '1rem', color: '#6b7280' },
  fieldContainer: { marginBottom: '1rem' },
  label: { display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' },
  required: { color: '#ef4444' },
  inputContainer: { position: 'relative' },
  input: { width: '100%', padding: '0.75rem 1rem', paddingLeft: '3rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' },
  inputFocus: { outline: 'none', boxShadow: '0 0 0 2px #2563eb', borderColor: 'transparent' },
  inputIcon: { position: 'absolute', left: '0.75rem', top: '0.75rem', height: '1.25rem', width: '1.25rem', color: '#6b7280' },
  select: { width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', appearance: 'none', background: '#ffffff' },
  textarea: { width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', resize: 'vertical' },
  checkboxContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  checkboxGroup: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  checkbox: { height: '1rem', width: '1rem', color: '#2563eb' },
  checkboxLabel: { fontSize: '0.875rem', color: '#374151' },
  button: { width: '100%', backgroundColor: '#2563eb', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: 'none', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background-color 200ms' },
  buttonHover: { backgroundColor: '#1d4ed8' },
  footerNote: { marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }
};

const DevisPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    typeServiceId: '',
    budgetEstime: '',
    description: '',
    pasUnRobot: false
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/services')
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
    if (!formData.pasUnRobot) {
      alert('Veuillez confirmer que vous n’êtes pas un robot.');
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
          pasUnRobot: false
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

  const budgetOptions = [
    { value: '0-5000', label: '0€ - 5 000€' },
    { value: '5000-15000', label: '5 000€ - 15 000€' },
    { value: '15000-30000', label: '15 000€ - 30 000€' },
    { value: '30000-50000', label: '30 000€ - 50 000€' },
    { value: '50000+', label: '50 000€+' }
  ];

  const processSteps = [
    "Analyse de votre demande",
    "Proposition personnalisée",
    "Réponse sous 24h"
  ];

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>Demander un Devis</h1>
        <p style={styles.subtitle}>Personnalisez votre projet avec nous</p>
        <p style={styles.description}>
          Décrivez-nous votre projet et obtenez un devis personnalisé adapté à 
          vos besoins et votre budget.
        </p>
        <div>
          <h3 style={styles.stepsTitle}>Notre processus :</h3>
          <div style={styles.stepsList}>
            {processSteps.map((step, index) => (
              <div key={index} style={styles.stepItem}>
                <div style={styles.stepNumber}>{index + 1}</div>
                <div style={styles.stepText}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.rightSide}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <div style={styles.iconContainer}>
              <FileText style={{ height: '2rem', width: '2rem', color: '#ffffff' }} />
            </div>
            <h2 style={styles.formTitle}>Votre Projet</h2>
            <p style={styles.formSubtitle}>Remplissez le formulaire pour recevoir votre devis</p>
          </div>
          <div>
            {error && <p style={{ color: '#ef4444' }}>{error}</p>}
            {loading && <p style={{ color: '#6b7280' }}>Chargement des services...</p>}
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Prénom <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <User style={styles.inputIcon} />
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Nom <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <User style={styles.inputIcon} />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Email <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <Mail style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Type de service <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <select
                  name="typeServiceId"
                  value={formData.typeServiceId}
                  onChange={handleInputChange}
                  style={styles.select}
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
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Budget estimé <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <select
                  name="budgetEstime"
                  value={formData.budgetEstime}
                  onChange={handleInputChange}
                  style={styles.select}
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
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Description du projet <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez votre projet, vos objectifs et vos besoins spécifiques..."
                style={styles.textarea}
                required
              />
            </div>
            <div style={styles.checkboxContainer}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="pasUnRobot"
                  checked={formData.pasUnRobot}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Je ne suis pas un robot (reCAPTCHA)</label>
              </div>
            </div>
            <button
              type="submit"
              style={styles.button}
              onClick={handleSubmit}
              onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
              disabled={loading}
            >
              <Send size={20} />
              <span>{loading ? 'Envoi...' : 'Soumettre ma demande'}</span>
            </button>
            <div style={styles.footerNote}>
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