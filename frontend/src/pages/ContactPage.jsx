import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DOMPurify from 'dompurify';

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

const ContactSchema = Yup.object().shape({
  nom: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ' -]+$/, 'Nom invalide')
    .required('Nom requis'),
  prenom: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ' -]+$/, 'Prénom invalide')
    .required('Prénom requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  telephone: Yup.string(),
  typeProjet: Yup.string().required('Type de projet requis'),
  message: Yup.string().min(10, 'Message trop court').required('Message requis'),
  conditions: Yup.boolean().oneOf([true], 'Vous devez accepter les conditions'),
});

function ContactPage() {
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
        <Formik
          initialValues={{
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            typeProjet: '',
            message: '',
            conditions: false,
          }}
          validationSchema={ContactSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const payload = {
              nomVisiteur: values.nom,
              prenomVisiteur: values.prenom,
              emailVisiteur: values.email,
              titre: values.typeProjet,
              description: DOMPurify.sanitize(values.message)
            };
            try {
              const res = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              const data = await res.json();
              if (data.success) {
                alert('Votre message a bien été envoyé !');
                resetForm();
              } else {
                alert(data.message || 'Erreur lors de l\'envoi du message');
              }
            } catch {
              alert('Erreur réseau');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form style={styles.formContainer}>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nom *</label>
                  <Field
                    type="text"
                    name="nom"
                    placeholder="Votre nom"
                    style={styles.input}
                  />
                  <ErrorMessage name="nom" component="div" style={{ color: 'red', fontSize: 13 }} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Prénom *</label>
                  <Field
                    type="text"
                    name="prenom"
                    placeholder="Votre prénom"
                    style={styles.input}
                  />
                  <ErrorMessage name="prenom" component="div" style={{ color: 'red', fontSize: 13 }} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  style={styles.input}
                />
                <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: 13 }} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Téléphone</label>
                <Field
                  type="tel"
                  name="telephone"
                  placeholder="+33 1 23 45 67 89"
                  style={styles.input}
                />
                <ErrorMessage name="telephone" component="div" style={{ color: 'red', fontSize: 13 }} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type de projet *</label>
                <Field as="select" name="typeProjet" style={styles.select}>
                  <option value="">Sélectionnez un type</option>
                  <option value="web">Site Web</option>
                  <option value="mobile">Application Mobile</option>
                  <option value="marketing">Marketing Digital</option>
                  <option value="consulting">Consulting</option>
                </Field>
                <ErrorMessage name="typeProjet" component="div" style={{ color: 'red', fontSize: 13 }} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Message *</label>
                <Field
                  as="textarea"
                  name="message"
                  placeholder="Décrivez votre projet en détail..."
                  style={styles.textarea}
                />
                <ErrorMessage name="message" component="div" style={{ color: 'red', fontSize: 13 }} />
              </div>
              <div style={styles.checkboxContainer}>
                <Field type="checkbox" name="conditions" id="conditions" style={styles.checkbox} />
                <label htmlFor="conditions" style={styles.checkboxLabel}>
                  J'accepte les conditions d'utilisation et la politique de confidentialité
                </label>
              </div>
              <ErrorMessage name="conditions" component="div" style={{ color: 'red', fontSize: 13 }} />
              <button
                type="submit"
                style={styles.submitButton}
                disabled={isSubmitting}
              >
                ✉️ Envoyer le message
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ContactPage;