import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DOMPurify from 'dompurify';
import { User, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/Connexion.css';

const ConnexionSchema = Yup.object().shape({
  email: Yup.string()
    .email('Format d\'email invalide')
    .required('Email requis'),
  motDePasse: Yup.string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]|;:,.]).{12,}$/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (!@#$%^&*()_+-=[]|;:,.)'
    )
    .required('Mot de passe requis'),
  seSouvenirDeMoi: Yup.boolean(),
  recaptcha: Yup.string().required('Veuillez vérifier le reCAPTCHA')
});

const ConnexionPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState('checking');

  // Vérifier le statut du backend
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        console.error('Backend non accessible:', error);
        setBackendStatus('error');
      }
    };

    checkBackend();
  }, []);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting, setFieldError, setStatus }) => {
    try {
      // Vérifier que le backend est accessible
      if (backendStatus !== 'connected') {
        setStatus('Le serveur backend n\'est pas accessible. Veuillez vérifier qu\'il est démarré.');
        return;
      }

      // Sanitisation des inputs avec DOMPurify
      const sanitizedEmail = DOMPurify.sanitize(values.email);
      const sanitizedPassword = DOMPurify.sanitize(values.motDePasse);

      const payload = {
        email: sanitizedEmail,
        motDePasse: sanitizedPassword,
        token: values.recaptcha,
      };

      console.log('Tentative de connexion avec:', { email: sanitizedEmail, token: values.recaptcha ? 'présent' : 'absent' });

      const res = await authAPI.login(payload);
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
        setStatus(data.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      
      if (error.response) {
        // Erreur de réponse du serveur
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        
        if (error.response.status === 404) {
          setStatus('Route non trouvée. Vérifiez que le backend est démarré et accessible.');
        } else if (error.response.status === 500) {
          setStatus('Erreur serveur interne. Vérifiez les logs du backend.');
        } else if (error.response.data && error.response.data.message) {
          setStatus(error.response.data.message);
        } else {
          setStatus(`Erreur ${error.response.status}: ${error.response.statusText}`);
        }
      } else if (error.request) {
        // Erreur de réseau
        setStatus('Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:5000');
      } else {
        // Autre erreur
        setStatus('Erreur réseau ou serveur: ' + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Afficher un message si le backend n'est pas accessible
  if (backendStatus === 'checking') {
    return (
      <div className="connexion-container">
        <div className="connexion-right-side">
          <div className="connexion-form-container">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🔍</div>
              <p>Vérification de la connexion au serveur...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (backendStatus === 'error') {
    return (
      <div className="connexion-container">
        <div className="connexion-right-side">
          <div className="connexion-form-container">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>⚠️</div>
              <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>Serveur non accessible</h3>
              <p style={{ marginBottom: '1rem' }}>
                Le serveur backend n'est pas accessible sur http://localhost:5000
              </p>
              <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Veuillez démarrer le serveur backend avec :<br />
                <code style={{ background: '#f3f4f6', padding: '0.5rem', borderRadius: '4px' }}>
                  cd backend && npm run dev
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <Formik
            initialValues={{
              email: '',
              motDePasse: '',
              seSouvenirDeMoi: false,
              recaptcha: siteKey ? '' : 'mock-token'
            }}
            validationSchema={ConnexionSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status, setFieldValue, values }) => (
              <Form>
                {status && (
                  <div className="connexion-error-message">
                    {status}
                  </div>
                )}

                <div className="connexion-field-container">
                  <label className="connexion-label">
                    Email <span className="connexion-required">*</span>
                  </label>
                  <div className="connexion-input-container">
                    <Mail className="connexion-input-icon" />
                    <Field
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      className="connexion-input"
                      disabled={isSubmitting}
                      autoComplete="username"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }} />
                </div>

                <div className="connexion-field-container">
                  <label className="connexion-label">
                    Mot de passe <span className="connexion-required">*</span>
                  </label>
                  <div className="connexion-input-container">
                    <Lock className="connexion-input-icon" />
                    <Field
                      type="password"
                      name="motDePasse"
                      placeholder="••••••••"
                      className="connexion-input"
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                  </div>
                  <ErrorMessage name="motDePasse" component="div" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }} />
                </div>

                <div className="connexion-checkbox-container">
                  <div className="connexion-checkbox-group">
                    <Field
                      type="checkbox"
                      name="seSouvenirDeMoi"
                      className="connexion-checkbox"
                      disabled={isSubmitting}
                    />
                    <label className="connexion-checkbox-label">Se souvenir de moi</label>
                  </div>
                  <a href="#" className="connexion-link">
                    Mot de passe oublié ?
                  </a>
                </div>

                {siteKey ? (
                  <div className="connexion-field-container">
                    <div className="connexion-recaptcha-container">
                      <ReCAPTCHA
                        sitekey={siteKey}
                        onChange={(token) => setFieldValue('recaptcha', token)}
                        style={{ width: '100%', height: '78px' }}
                      />
                    </div>
                    <ErrorMessage name="recaptcha" component="div" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }} />
                  </div>
                ) : (
                  <div className="connexion-field-container">
                    <div style={{ 
                      background: '#f3f4f6', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px', 
                      padding: '20px', 
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.875rem'
                    }}>
                      ⚠️ ReCAPTCHA non configuré - Mode développement
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="connexion-button"
                  disabled={isSubmitting || (siteKey && !values.recaptcha)}
                >
                  {isSubmitting ? (
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ConnexionPage;