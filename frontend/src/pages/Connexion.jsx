import React, { useState } from 'react';
import { User, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

// Styles CSS natifs
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#f3f4f6'
  },
  leftSide: {
    flex: 1,
    backgroundColor: '#1e40af',
    color: '#ffffff',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#e5e7eb',
    minHeight: '100vh'
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '2rem',
    width: '100%',
    maxWidth: '28rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#ffffff'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#93c5fd',
    marginBottom: '2rem'
  },
  description: {
    fontSize: '1rem',
    color: '#dbeafe',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  advantagesTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#ffffff'
  },
  advantagesList: {
    marginBottom: '1rem'
  },
  advantageItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  advantageIndicator: {
    backgroundColor: '#10b981',
    borderRadius: '50%',
    padding: '0.25rem',
    marginTop: '0.25rem',
    minWidth: '1.5rem',
    height: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  advantagePoint: {
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '50%'
  },
  advantageText: {
    fontWeight: '500',
    color: '#ffffff',
    fontSize: '0.875rem'
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  iconContainer: {
    backgroundColor: '#2563eb',
    borderRadius: '0.5rem',
    width: '4rem',
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  formSubtitle: {
    fontSize: '1rem',
    color: '#6b7280'
  },
  fieldContainer: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  required: {
    color: '#ef4444'
  },
  inputContainer: {
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    paddingLeft: '3rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box'
  },
  inputFocus: {
    outline: 'none',
    boxShadow: '0 0 0 2px #2563eb',
    borderColor: 'transparent'
  },
  inputIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '0.75rem',
    height: '1.25rem',
    width: '1.25rem',
    color: '#6b7280'
  },
  togglePassword: {
    position: 'absolute',
    right: '0.75rem',
    top: '0.75rem',
    height: '1.25rem',
    width: '1.25rem',
    color: '#6b7280',
    cursor: 'pointer',
    background: 'none',
    border: 'none'
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  checkbox: {
    height: '1rem',
    width: '1rem',
    color: '#2563eb'
  },
  checkboxLabel: {
    fontSize: '0.875rem',
    color: '#374151'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  linkHover: {
    color: '#1d4ed8'
  },
  button: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background-color 200ms'
  },
  buttonHover: {
    backgroundColor: '#1d4ed8'
  },
  divider: {
    marginTop: '1.5rem',
    textAlign: 'center'
  },
  dividerText: {
    fontSize: '1rem',
    color: '#6b7280'
  },
  signupText: {
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '0.5rem'
  }
};

const ConnexionPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    seSouvenirDeMoi: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      motDePasse: formData.motDePasse
    };
    try {
      const res = await fetch('/api/utilisateurs/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        alert('Connexion réussie !');
        // Rediriger ou mettre à jour le contexte utilisateur ici
      } else {
        alert(data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  const advantages = [
    "Suivi en temps réel de vos projets",
    "Accès à votre historique de commandes",
    "Support client prioritaire"
  ];

  return (
    <div style={styles.container}>
      {/* Côté gauche */}
      <div style={styles.leftSide}>
        <h1 style={styles.title}>Connexion</h1>
        <p style={styles.subtitle}>Accédez à votre compte</p>
        <p style={styles.description}>
          Gérez vos projets, suivez l'avancement de vos commandes et 
          accédez à votre espace client personnalisé.
        </p>
        <div>
          <h3 style={styles.advantagesTitle}>Avantages de votre compte :</h3>
          <div style={styles.advantagesList}>
            {advantages.map((advantage, index) => (
              <div key={index} style={styles.advantageItem}>
                <div style={styles.advantageIndicator}>
                  <div style={styles.advantagePoint} />
                </div>
                <div style={styles.advantageText}>{advantage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Côté droit */}
      <div style={styles.rightSide}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <div style={styles.iconContainer}>
              <User style={{ height: '2rem', width: '2rem', color: '#ffffff' }} />
            </div>
            <h2 style={styles.formTitle}>Connectez-vous</h2>
            <p style={styles.formSubtitle}>Entrez vos identifiants pour accéder à votre compte</p>
          </div>

          <div>
            {/* Champ Email */}
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

            {/* Champ Mot de passe */}
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Mot de passe <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <Lock style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  style={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Checkbox et lien */}
            <div style={styles.checkboxContainer}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="seSouvenirDeMoi"
                  checked={formData.seSouvenirDeMoi}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Se souvenir de moi</label>
              </div>
              <a href="#" style={styles.link}>
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de connexion */}
            <button 
              type="submit" 
              style={styles.button}
              onClick={handleSubmit}
              onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
            >
              <LogIn size={20} />
              <span>Se connecter</span>
            </button>

            {/* Divider et lien inscription */}
            <div style={styles.divider}>
              <p style={styles.dividerText}>ou</p>
              <p style={styles.signupText}>
                Pas encore inscrit ? <a href="/inscription" style={styles.link}>Inscrivez-vous</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnexionPage;