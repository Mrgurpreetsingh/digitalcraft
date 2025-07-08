import React, { useState } from 'react';

// Styles inline pour éviter les dépendances externes
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: '#f8f9fa'
  },
  headerSection: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#1E40AF',
    color: 'white',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: '2.5em',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '8px',
    opacity: 0.9
  },
  description: {
    fontSize: '16px',
    opacity: 0.8,
    maxWidth: '600px',
    margin: '0 auto'
  },
  contactContainer: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  formIntro: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '500'
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '20px'
  },
  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },
  inputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '5px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#1E40AF'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '20px'
  },
  checkbox: {
    marginTop: '2px'
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.4'
  },
  recaptcha: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  recaptchaCheckbox: {
    width: '20px',
    height: '20px'
  },
  recaptchaText: {
    fontSize: '14px',
    color: '#555'
  },
  submitButton: {
    backgroundColor: '#1E40AF',
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  submitButtonHover: {
    backgroundColor: '#1E3A8A'
  }
};

function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeProjet: '',
    message: '',
    conditions: false,
    recaptcha: false
  });

  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Logic de soumission du formulaire
    alert('Message envoyé avec succès !');
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Nous Contacter</h1>
        <p style={styles.subtitle}>Prêt à démarrer votre projet ?</p>
        <p style={styles.description}>
          Discutons de vos besoins et créons ensemble votre solution digitale sur mesure
        </p>
      </div>

      <div style={styles.contactContainer}>
        <h2 style={styles.formIntro}>Envoyez-nous un message</h2>
        <p style={styles.formSubtitle}>
          Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
        </p>

        <div style={styles.formContainer}>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                onFocus={() => handleFocus('nom')}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  borderColor: focusedField === 'nom' ? '#1E40AF' : '#ddd'
                }}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Prénom</label>
              <input
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
                onFocus={() => handleFocus('prenom')}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  borderColor: focusedField === 'prenom' ? '#1E40AF' : '#ddd'
                }}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                borderColor: focusedField === 'email' ? '#1E40AF' : '#ddd'
              }}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              placeholder="+33 1 23 45 67 89"
              value={formData.telephone}
              onChange={handleChange}
              onFocus={() => handleFocus('telephone')}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                borderColor: focusedField === 'telephone' ? '#1E40AF' : '#ddd'
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Type de projet</label>
            <select
              name="typeProjet"
              value={formData.typeProjet}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="web">Site Web</option>
              <option value="mobile">Application Mobile</option>
              <option value="marketing">Marketing Digital</option>
              <option value="consulting">Consulting</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Message *</label>
            <textarea
              name="message"
              placeholder="Décrivez votre projet en détail..."
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus('message')}
              onBlur={handleBlur}
              style={{
                ...styles.textarea,
                borderColor: focusedField === 'message' ? '#1E40AF' : '#ddd'
              }}
              required
            />
          </div>

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="conditions"
              id="conditions"
              checked={formData.conditions}
              onChange={handleChange}
              style={styles.checkbox}
              required
            />
            <label htmlFor="conditions" style={styles.checkboxLabel}>
              J'accepte les conditions d'utilisation et la politique de confidentialité
            </label>
          </div>

          <div style={styles.recaptcha}>
            <input
              type="checkbox"
              name="recaptcha"
              id="recaptcha"
              checked={formData.recaptcha}
              onChange={handleChange}
              style={styles.recaptchaCheckbox}
              required
            />
            <span style={styles.recaptchaText}>Je ne suis pas un robot (reCAPTCHA)</span>
          </div>

          <button
            type="submit"
            style={styles.submitButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.submitButton.backgroundColor}
            onClick={handleSubmit}
          >
            ✉️ Envoyer le message
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;