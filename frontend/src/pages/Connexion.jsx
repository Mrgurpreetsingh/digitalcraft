import React, { useState } from 'react';
import { User, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import '../styles/Connexion.css';

const ConnexionPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    seSouvenirDeMoi: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert('Veuillez vérifier le reCAPTCHA.');
      return;
    }
    const payload = {
      email: formData.email,
      motDePasse: formData.motDePasse,
      token: captchaToken,
    };
    try {
      const res = await axios.post('http://localhost:5000/api/utilisateurs/login', payload); // Ajuste l'URL
      const data = res.data;
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('role', data.data.user.role); // Utilise data.data.user.role
        if (data.data.user.role === 'Administrateur') window.location.href = '/admin';
        else if (data.data.user.role === 'Employé') window.location.href = '/employe';
        alert('Connexion réussie !');
      } else {
        alert(data.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur réseau ou serveur');
    }
  };

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LejF4MrAAAAANIX6ENamurC8EBYK9s9X0RJ3N_i';

  return (
    <div className="connexion-container">
      <div className="connexion-left-side">
        <h1 className="connexion-title">Connexion</h1>
        <p className="connexion-subtitle">Accédez à votre compte</p>
        <p className="connexion-description">
          Gérez vos projets, suivez l'avancement de vos commandes et accédez à votre espace.
        </p>
      </div>
      <div className="connexion-right-side">
        <div className="connexion-form-container">
          <div className="connexion-form-header">
            <div className="connexion-icon-container">
              <User style={{ height: '2rem', width: '2rem', color: '#ffffff' }} />
            </div>
            <h2 className="connexion-form-title">Connectez-vous</h2>
            <p className="connexion-form-subtitle">Entrez vos identifiants pour accéder à votre compte</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="connexion-field-container">
              <label className="connexion-label">
                Email <span className="connexion-required">*</span>
              </label>
              <div className="connexion-input-container">
                <Mail className="connexion-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="connexion-input"
                  required
                />
              </div>
            </div>
            <div className="connexion-field-container">
              <label className="connexion-label">
                Mot de passe <span className="connexion-required">*</span>
              </label>
              <div className="connexion-input-container">
                <Lock className="connexion-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="connexion-input"
                  required
                />
                <button
                  type="button"
                  className="connexion-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="connexion-checkbox-container">
              <div className="connexion-checkbox-group">
                <input
                  type="checkbox"
                  name="seSouvenirDeMoi"
                  checked={formData.seSouvenirDeMoi}
                  onChange={handleInputChange}
                  className="connexion-checkbox"
                />
                <label className="connexion-checkbox-label">Se souvenir de moi</label>
              </div>
              <a href="#" className="connexion-link">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="connexion-field-container">
              <div className="connexion-recaptcha-container">
                <ReCAPTCHA
                  sitekey={siteKey}
                  onChange={handleCaptchaChange}
                  style={{ width: '100%', height: '78px' }}
                />
              </div>
            </div>
            <button type="submit" className="connexion-button">
              <LogIn size={20} />
              <span>Se connecter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnexionPage;