import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styled from 'styled-components';

const HeaderSection = styled.section`
  padding: 40px 20px;
  text-align: center;
  background-color: var(--primary-color); /* Bleu #1E40AF */
  color: var(--white);
`;

const ContactContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  color: var(--text-dark);
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 2.5em;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: var(--text-light);
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  gap: 10px;

  & > * {
    flex: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid var(--text-light);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid var(--text-light);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid var(--text-light);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  height: 100px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  background-color: var(--secondary-color); /* #34C759 */
  color: var(--white);
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;

  &:hover {
    background-color: #059669;
  }
`;

function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeProjet: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here (to be handled by backend)
  };

  return (
    <div>
      <HeaderSection>
        <Title>Nous Contacter</Title>
        <Paragraph>Prêt à démarrer votre projet ?</Paragraph>
        <Paragraph>Discutons de vos besoins et créons ensemble votre solution digitale sur mesure</Paragraph>
      </HeaderSection>
      <ContactContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="text"
              name="nom"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="prenom"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="tel"
              name="telephone"
              placeholder="+33 1 23 45 67 89"
              value={formData.telephone}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Select
              name="typeProjet"
              value={formData.typeProjet}
              onChange={handleChange}
            >
              <option value="">Sélectionnez un type</option>
              <option value="web">Site Web</option>
              <option value="mobile">Application Mobile</option>
              <option value="marketing">Marketing Digital</option>
              <option value="consulting">Consulting</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Textarea
              name="message"
              placeholder="Décrivez votre projet en détail..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <input
                type="checkbox"
                name="conditions"
                required
              />
              J'accepte les conditions d'utilisation et la politique de confidentialité
            </Label>
          </FormGroup>
          <Button type="submit">Envoyer le message</Button>
        </Form>
      </ContactContainer>
      <Footer />
    </div>
  );
}

export default ContactPage;