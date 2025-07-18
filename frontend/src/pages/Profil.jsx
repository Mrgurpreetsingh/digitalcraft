import React, { useState } from 'react';
import styled from 'styled-components';
import { ChampFormulaire, ChampSelection, ZoneTexte, CaseCoche } from '../components/ComposantsFormulaire';
import { User, Mail, Lock, Image as ImageIcon } from 'lucide-react';

const ProfilContainer = styled.div`
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: #FFFFFF;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ImageSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #005DAA;
`;

const SubmitButton = styled.button`
  background-color: #005DAA;
  color: #FFFFFF;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #004B8D;
  }

  &:active {
    background-color: #003D70;
  }

  &:disabled {
    background-color: #4B5563;
    cursor: not-allowed;
  }
`;

const Profil = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: '',
    bio: '',
    activitesImage: null,
    notifications: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profil mis à jour :', formData);
    // Logique pour envoyer les données au backend (ex. : API call)
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const roleOptions = [
    { valeur: 'Visiteur', libelle: 'Visiteur' },
    { valeur: 'Employé', libelle: 'Employé' },
    { valeur: 'Administrateur', libelle: 'Administrateur' },
  ];

  return (
    <>
      <ProfilContainer>
        <h1 style={{ fontFamily: 'Poppins', fontSize: '32px', color: '#1A1A1A', fontWeight: 'bold' }}>Mon Profil</h1>
        <FormContainer>
          <ImageSection>
            <label htmlFor="activitesImage">
              {imagePreview ? (
                <ImagePreview src={imagePreview} alt="Aperçu de l'image d'activités" />
              ) : (
                <ImageIcon size={150} color="#005DAA" />
              )}
            </label>
            <input
              id="activitesImage"
              type="file"
              name="activitesImage"
              accept="image/*"
              onChange={handleChange}
              style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#4B5563' }}>
              (Optionnel) Ajoutez une image liée à vos activités
            </p>
          </ImageSection>
          <form onSubmit={handleSubmit}>
            <ChampFormulaire
              label="Nom"
              type="text"
              placeholder="Entrez votre nom"
              icone={User}
              name="nom"
              valeur={formData.nom}
              onChange={handleChange}
              requis
            />
            <ChampFormulaire
              label="Prénom"
              type="text"
              placeholder="Entrez votre prénom"
              icone={User}
              name="prenom"
              valeur={formData.prenom}
              onChange={handleChange}
              requis
            />
            <ChampFormulaire
              label="Email"
              type="email"
              placeholder="Entrez votre email"
              icone={Mail}
              name="email"
              valeur={formData.email}
              onChange={handleChange}
              requis
            />
            <ChampFormulaire
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
              icone={Lock}
              name="motDePasse"
              valeur={formData.motDePasse}
              onChange={handleChange}
              montrerMotDePasse={showPassword}
              basculerMotDePasse={togglePassword}
              requis
            />
            <ChampSelection
              label="Rôle"
              options={roleOptions}
              name="role"
              valeur={formData.role}
              onChange={handleChange}
              requis
            />
            <ZoneTexte
              label="Bio"
              placeholder="Décrivez-vous en quelques mots"
              name="bio"
              valeur={formData.bio}
              onChange={handleChange}
            />
            <CaseCoche
              label="Recevoir des notifications"
              coche={formData.notifications}
              name="notifications"
              onChange={handleChange}
            />
            <SubmitButton type="submit">Mettre à jour le profil</SubmitButton>
          </form>
        </FormContainer>
      </ProfilContainer>
    </>
  );
};

export default Profil;