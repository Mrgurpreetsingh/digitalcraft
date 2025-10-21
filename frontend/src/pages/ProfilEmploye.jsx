import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import '../styles/ProfilEmploye.css';

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Mot de passe actuel requis'),
  newPassword: Yup.string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]|;:,.]).{12,}$/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (!@#$%^&*()_+-=[]|;:,.)'
    )
    .required('Nouveau mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Les mots de passe ne correspondent pas')
    .required('Confirmation requise'),
});

const ProfilEmploye = () => {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = async (values, { setSubmitting, setStatus, resetForm }) => {
    try {
      const response = await authAPI.changePassword({
        ancienMotDePasse: values.currentPassword,
        nouveauMotDePasse: values.newPassword
      });

      if (response.data.success) {
        setSuccessMessage('Mot de passe modifié avec succès !');
        setStatus('');
        resetForm();

        // Masquer le message après 5 secondes
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setStatus(response.data.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.data?.message) {
        setStatus(error.response.data.message);
      } else {
        setStatus('Erreur lors de la modification du mot de passe');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profil-employe-container">
      <div className="profil-employe-header">
        <h1 className="profil-employe-title">Mon Profil</h1>
        <p className="profil-employe-subtitle">Gérez vos informations personnelles</p>
      </div>

      <div className="profil-employe-content">
        {/* Section Informations personnelles */}
        <div className="profil-card">
          <div className="profil-card-header">
            <User className="profil-icon" />
            <h2>Informations personnelles</h2>
          </div>

          <div className="profil-info-grid">
            <div className="profil-info-item">
              <label>Nom</label>
              <p>{user?.nom || 'Non renseigné'}</p>
            </div>

            <div className="profil-info-item">
              <label>Prénom</label>
              <p>{user?.prenom || 'Non renseigné'}</p>
            </div>

            <div className="profil-info-item">
              <label>Email</label>
              <p className="profil-email">
                <Mail size={16} />
                {user?.email || 'Non renseigné'}
              </p>
            </div>

            <div className="profil-info-item">
              <label>Rôle</label>
              <p className="profil-role">{user?.role || 'Non renseigné'}</p>
            </div>
          </div>
        </div>

        {/* Section Changement de mot de passe */}
        <div className="profil-card">
          <div className="profil-card-header">
            <Lock className="profil-icon" />
            <h2>Changer le mot de passe</h2>
          </div>

          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }}
            validationSchema={ChangePasswordSchema}
            onSubmit={handlePasswordChange}
          >
            {({ isSubmitting, status }) => (
              <Form className="password-form">
                {status && (
                  <div className="error-message">
                    {status}
                  </div>
                )}

                {successMessage && (
                  <div className="success-message">
                    {successMessage}
                  </div>
                )}

                {/* Mot de passe actuel */}
                <div className="form-group">
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={20} />
                    <Field
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      className="form-input"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage name="currentPassword" component="div" className="field-error" />
                </div>

                {/* Nouveau mot de passe */}
                <div className="form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={20} />
                    <Field
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      className="form-input"
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage name="newPassword" component="div" className="field-error" />
                </div>

                {/* Confirmation mot de passe */}
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={20} />
                    <Field
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="field-error" />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <Save size={20} />
                  {isSubmitting ? 'Modification en cours...' : 'Modifier le mot de passe'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProfilEmploye;