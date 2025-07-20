import React, { useState, useCallback } from 'react';
import { X, User, Mail, Lock, UserCheck, Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DOMPurify from 'dompurify';
import axios from 'axios';
import '../styles/Modal.css';

const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  nom: Yup.string()
    .min(2, 'Nom trop court (minimum 2 caractères)')
    .max(50, 'Nom trop long (maximum 50 caractères)')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nom invalide (lettres, espaces, tirets et apostrophes uniquement)')
    .required('Nom requis'),
  prenom: Yup.string()
    .min(2, 'Prénom trop court (minimum 2 caractères)')
    .max(50, 'Prénom trop long (maximum 50 caractères)')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Prénom invalide (lettres, espaces, tirets et apostrophes uniquement)')
    .required('Prénom requis'),
  motDePasse: Yup.string()
    .min(12, 'Mot de passe trop court (minimum 12 caractères)')
    .matches(/^(?=.*[a-z])/, 'Au moins une minuscule requise')
    .matches(/^(?=.*[A-Z])/, 'Au moins une majuscule requise')
    .matches(/^(?=.*\d)/, 'Au moins un chiffre requis')
    .matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Au moins un caractère spécial requis (!@#$%^&*()_+-=[]{}|;:,.<>?)')
    .required('Mot de passe requis'),
  confirmationMotDePasse: Yup.string()
    .oneOf([Yup.ref('motDePasse'), null], 'Les mots de passe doivent être identiques')
    .required('Confirmation du mot de passe requise'),
  role: Yup.string()
    .oneOf(['Employé', 'Administrateur'], 'Rôle invalide')
    .required('Rôle requis'),
});

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    nom: '',
    prenom: '',
    motDePasse: '',
    confirmationMotDePasse: '',
    role: 'Employé'
  };

  const handleSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setError('');

    try {
      // Sanitiser les données
      const sanitizedData = {
        email: DOMPurify.sanitize(values.email.trim()),
        nom: DOMPurify.sanitize(values.nom.trim()),
        prenom: DOMPurify.sanitize(values.prenom.trim()),
        motDePasse: values.motDePasse,
        confirmationMotDePasse: values.confirmationMotDePasse,
        role: DOMPurify.sanitize(values.role)
      };

      const response = await axios.post('http://localhost:5000/api/utilisateurs/admin/create', sanitizedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUserAdded(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Erreur lors de la création de l\'utilisateur');
      }
    } catch (err) {
      console.error('Erreur création utilisateur:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }, [onUserAdded, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <User size={20} />
            <h2>Ajouter un Utilisateur</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={UserSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, handleChange, handleBlur, touched, errors }) => (
            <Form className="modal-form">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email *
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="utilisateur@digitalcraft.com"
                  className={touched.email && errors.email ? 'form-input error' : 'form-input'}
                  disabled={loading}
                  autoComplete="email"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">
                    <User size={16} />
                    Nom *
                  </label>
                  <Field
                    type="text"
                    id="nom"
                    name="nom"
                    placeholder="Dupont"
                    className={touched.nom && errors.nom ? 'form-input error' : 'form-input'}
                    disabled={loading}
                    autoComplete="family-name"
                  />
                  <ErrorMessage name="nom" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="prenom">
                    <User size={16} />
                    Prénom *
                  </label>
                  <Field
                    type="text"
                    id="prenom"
                    name="prenom"
                    placeholder="Jean"
                    className={touched.prenom && errors.prenom ? 'form-input error' : 'form-input'}
                    disabled={loading}
                    autoComplete="given-name"
                  />
                  <ErrorMessage name="prenom" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="motDePasse">
                  <Lock size={16} />
                  Mot de passe *
                </label>
                <div className="password-input-container">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    id="motDePasse"
                    name="motDePasse"
                    placeholder="••••••••••••"
                    className={touched.motDePasse && errors.motDePasse ? 'form-input error' : 'form-input'}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={useCallback(() => setShowPassword(prev => !prev), [])}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ErrorMessage name="motDePasse" component="div" className="error-message" />
                <small className="password-requirements">
                  Minimum 12 caractères avec majuscule, minuscule, chiffre et caractère spécial (!@#$%^&*()_+-=[]{}|;:,.) 
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmationMotDePasse">
                  <Lock size={16} />
                  Confirmer le mot de passe *
                </label>
                <div className="password-input-container">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    id="confirmationMotDePasse"
                    name="confirmationMotDePasse"
                    placeholder="••••••••••••"
                    className={touched.confirmationMotDePasse && errors.confirmationMotDePasse ? 'form-input error' : 'form-input'}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={useCallback(() => setShowPassword(prev => !prev), [])}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ErrorMessage name="confirmationMotDePasse" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  <UserCheck size={16} />
                  Rôle *
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className={touched.role && errors.role ? 'form-input error' : 'form-input'}
                  disabled={loading}
                >
                  <option value="Employé">Employé</option>
                  <option value="Administrateur">Administrateur</option>
                </Field>
                <ErrorMessage name="role" component="div" className="error-message" />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={loading || isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || isSubmitting}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <User size={16} />
                      Créer l'utilisateur
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUserModal; 