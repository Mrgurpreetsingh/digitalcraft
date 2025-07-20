import React, { useState, useCallback } from 'react';
import { X, FileText, DollarSign, Image, Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DOMPurify from 'dompurify';
import axios from 'axios';
import '../styles/Modal.css';

const ServiceSchema = Yup.object().shape({
  titre: Yup.string()
    .min(3, 'Titre trop court (minimum 3 caractères)')
    .max(100, 'Titre trop long (maximum 100 caractères)')
    .required('Titre requis'),
  description: Yup.string()
    .min(10, 'Description trop courte (minimum 10 caractères)')
    .max(2000, 'Description trop longue (maximum 2000 caractères)')
    .required('Description requise'),
  exemples: Yup.string()
    .min(5, 'Exemples trop courts (minimum 5 caractères)')
    .max(1000, 'Exemples trop longs (maximum 1000 caractères)')
    .required('Exemples requis'),
  tarifBase: Yup.number()
    .positive('Tarif doit être positif')
    .required('Tarif requis'),
  statut: Yup.string()
    .oneOf(['actif', 'inactif'], 'Statut invalide')
    .required('Statut requis'),
});

const ServiceModal = ({ isOpen, onClose, onServiceAdded, onServiceUpdated, service = null, isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const initialValues = {
    titre: service?.titre || '',
    description: service?.description || '',
    exemples: service?.exemples || '',
    tarifBase: service?.tarifBase || '',
    statut: service?.statut || 'actif',
    image: null
  };

  const handleSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setError('');

    try {
      // Sanitiser les données
      const sanitizedData = {
        titre: DOMPurify.sanitize(values.titre.trim()),
        description: DOMPurify.sanitize(values.description.trim()),
        exemples: DOMPurify.sanitize(values.exemples.trim()),
        tarifBase: parseFloat(values.tarifBase),
        statut: DOMPurify.sanitize(values.statut)
      };

      let response;
      if (isEdit) {
        // Modification
        response = await axios.put(`http://localhost:5000/api/services/${service.id}`, sanitizedData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        onServiceUpdated(response.data.data);
      } else {
        // Création
        response = await axios.post('http://localhost:5000/api/services', sanitizedData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        onServiceAdded(response.data.data);
      }

      if (response.data.success) {
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Erreur lors de l\'opération');
      }
    } catch (err) {
      console.error('Erreur service:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }, [isEdit, service?.id, onServiceAdded, onServiceUpdated, onClose]);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('image', file);
      
      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content service-modal">
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} />
            <h2>{isEdit ? 'Modifier le Service' : 'Ajouter un Service'}</h2>
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
          validationSchema={ServiceSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue, touched, errors }) => (
            <Form className="modal-form">
              <div className="form-group">
                <label htmlFor="titre">
                  <FileText size={16} />
                  Titre du service *
                </label>
                <Field
                  type="text"
                  id="titre"
                  name="titre"
                  placeholder="Ex: Création de Sites Web"
                  className={touched.titre && errors.titre ? 'form-input error' : 'form-input'}
                  disabled={loading}
                  autoComplete="off"
                />
                <ErrorMessage name="titre" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  <FileText size={16} />
                  Description détaillée *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Décrivez en détail ce service, ses avantages, sa valeur ajoutée..."
                  className={touched.description && errors.description ? 'form-input error' : 'form-input'}
                  disabled={loading}
                  rows="4"
                />
                <ErrorMessage name="description" component="div" className="error-message" />
                <small className="form-help">
                  {values.description.length}/2000 caractères
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="exemples">
                  <FileText size={16} />
                  Exemples de réalisations *
                </label>
                <Field
                  as="textarea"
                  id="exemples"
                  name="exemples"
                  placeholder="Listez des exemples de projets ou réalisations types..."
                  className={touched.exemples && errors.exemples ? 'form-input error' : 'form-input'}
                  disabled={loading}
                  rows="3"
                />
                <ErrorMessage name="exemples" component="div" className="error-message" />
                <small className="form-help">
                  {values.exemples.length}/1000 caractères
                </small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tarifBase">
                    <DollarSign size={16} />
                    Tarif de base (€) *
                  </label>
                  <Field
                    type="number"
                    id="tarifBase"
                    name="tarifBase"
                    placeholder="1500"
                    min="0"
                    step="50"
                    className={touched.tarifBase && errors.tarifBase ? 'form-input error' : 'form-input'}
                    disabled={loading}
                  />
                  <ErrorMessage name="tarifBase" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="statut">
                    <FileText size={16} />
                    Statut *
                  </label>
                  <Field
                    as="select"
                    id="statut"
                    name="statut"
                    className={touched.statut && errors.statut ? 'form-input error' : 'form-input'}
                    disabled={loading}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </Field>
                  <ErrorMessage name="statut" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">
                  <Image size={16} />
                  Image illustrative (optionnel)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  className="form-input file-input"
                  disabled={loading}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Aperçu" />
                  </div>
                )}
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
                      {isEdit ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <FileText size={16} />
                      {isEdit ? 'Modifier le service' : 'Créer le service'}
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

export default ServiceModal; 