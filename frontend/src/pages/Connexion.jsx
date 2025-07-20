import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/Connexion.css';

const ConnexionPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    seSouvenirDeMoi: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!captchaToken) {
      setError('Veuillez vérifier le reCAPTCHA.');
      setLoading(false);
      return;
    }

    const payload = {
      email: formData.email,
      motDePasse: formData.motDePasse,
      token: captchaToken,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/utilisateurs/login', payload);
      const data = res.data;

      if (data.success) {
        // Utiliser le contexte pour la connexion
        login(data.data.user, data.data.token);
        
        // Redirection selon le rôle
        if (data.data.user.role === 'Administrateur') {
          navigate('/admin');
        } else if (data.data.user.role === 'Employé') {
          navigate('/employe');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur réseau ou serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

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

          {error && (
            <div className="connexion-error-message">
              {error}
            </div>
          )}

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
                  disabled={loading}
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
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="connexion-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
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
                  disabled={loading}
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

            <button 
              type="submit" 
              className="connexion-button"
              disabled={loading || !captchaToken}
            >
              {loading ? (
                <>
                  <div className="connexion-loading-spinner"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnexionPage;