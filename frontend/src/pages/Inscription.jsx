import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';

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
  },
  passwordHint: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '1rem'
  }
};

function splitNomComplet(nomComplet) {
  const parts = nomComplet.trim().split(' ');
  if (parts.length === 1) {
    return { prenom: '', nom: parts[0] };
  }
  const nom = parts.pop();
  const prenom = parts.join(' ');
  return { prenom, nom };
}

const InscriptionPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    accepterConditions: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom) {
      alert("Veuillez saisir votre nom et prénom.");
      return;
    }
    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      motDePasse: formData.motDePasse
    };
    try {
      const res = await fetch('/api/utilisateurs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Inscription réussie !');
      } else {
        alert(data.message || 'Erreur lors de l\'inscription');
      }
    } catch {
      alert('Erreur réseau');
    }
  };

  const advantages = [
    "Devis gratuit et personnalisé",
    "Suivi en temps réel de vos projets",
    "Support client dédié",
    "Accès prioritaire aux nouveautés"
  ];

  return (
    <div style={styles.container}>
      {/* Côté gauche */}
      <div style={styles.leftSide}>
        <h1 style={styles.title}>Inscription</h1>
        <p style={styles.subtitle}>Rejoignez-nous aujourd'hui !</p>
        <p style={styles.description}>
          Créez votre compte pour accéder à tous nos services et bénéficier 
          d'un accompagnement personnalisé.
        </p>
        <div>
          <h3 style={styles.advantagesTitle}>En vous inscrivant, vous bénéficiez de :</h3>
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
            <h2 style={styles.formTitle}>Créer votre compte</h2>
            <p style={styles.formSubtitle}>Remplissez les informations ci-dessous pour commencer</p>
          </div>

          <div>
            {/* Champs Nom et Prénom sur la même ligne */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
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
              <div style={{ flex: 1 }}>
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
            </div>

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
              <p style={styles.passwordHint}>Minimum 8 caractères</p>
            </div>

            {/* Champ Confirmer mot de passe */}
            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Confirmer le mot de passe <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <Lock style={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmerMotDePasse"
                  value={formData.confirmerMotDePasse}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  style={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Checkbox Conditions */}
            <div style={styles.checkboxContainer}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="accepterConditions"
                  checked={formData.accepterConditions}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                  required
                />
                <label style={styles.checkboxLabel}>
                  J'accepte les{' '}
                  <a href="#" style={styles.link}>conditions d'utilisation</a> et la{' '}
                  <a href="#" style={styles.link}>politique de confidentialité</a>
                </label>
              </div>
            </div>

            {/* Bouton Inscription */}
            <button
              type="submit"
              style={styles.button}
              onClick={handleSubmit}
              onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
            >
              <UserPlus size={20} />
              <span>S'inscrire</span>
            </button>

            {/* Divider et lien connexion */}
            <div style={styles.divider}>
              <p style={styles.dividerText}>ou</p>
              <p style={styles.signupText}>
                Déjà inscrit ? <a href="/connexion" style={styles.link}>Connectez-vous</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionPage;