import React, { useState } from 'react';
import { User, Mail, FileText, Send } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { ChampFormulaire, ChampSelection, ZoneTexte, CaseCoche } from '../components/ComposantsFormulaire';
import ListePersonnalisee from '../components/ListePersonnalisee';
import BoutonPrincipal from '../components/BoutonPrincipal';

const DevisPage = () => {
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    typeService: '',
    budgetEstime: '',
    descriptionProjet: '',
    pasUnRobot: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    console.log('Demande de devis:', formData);
  };

  const servicesOptions = [
    { value: 'web-design', label: 'Création de site web' },
    { value: 'mobile-app', label: 'Application mobile' },
    { value: 'branding', label: 'Identité visuelle' },
    { value: 'marketing', label: 'Marketing digital' },
    { value: 'consulting', label: 'Conseil stratégique' },
    { value: 'autre', label: 'Autre' }
  ];

  const budgetOptions = [
    { value: '0-5000', label: '0€ - 5 000€' },
    { value: '5000-15000', label: '5 000€ - 15 000€' },
    { value: '15000-30000', label: '15 000€ - 30 000€' },
    { value: '30000-50000', label: '30 000€ - 50 000€' },
    { value: '50000+', label: '50 000€+' }
  ];

  const processSteps = [
    "Analyse de votre demande",
    "Proposition personnalisée",
    "Réponse sous 24h"
  ];

  const leftContent = (
    <div>
      <h1 className="text-4xl font-bold mb-6">Demander un Devis</h1>
      <p className="text-xl text-blue-100 mb-8">Personnalisez votre projet avec nous</p>
      <p className="text-blue-100 mb-8">
        Décrivez-nous votre projet et obtenez un devis personnalisé adapté à 
        vos besoins et votre budget.
      </p>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Notre processus :</h3>
        <ListePersonnalisee elements={processSteps} type="etapes" />
      </div>
    </div>
  );

  return (
    <MainLayout leftContent={leftContent}>
      <div className="text-center mb-8">
        <div className="bg-blue-600 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre Projet</h2>
        <p className="text-gray-600">Remplissez le formulaire pour recevoir votre devis</p>
      </div>

      <div>
        <ChampFormulaire
          label="Nom complet"
          type="text"
          placeholder="Votre nom complet"
          icon={User}
          required
          name="nomComplet"
          value={formData.nomComplet}
          onChange={handleInputChange}
        />

        <ChampFormulaire
          label="Email"
          type="email"
          placeholder="votre@email.com"
          icon={Mail}
          required
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <ChampSelection
          label="Type de service"
          options={servicesOptions}
          value={formData.typeService}
          onChange={handleInputChange}
          name="typeService"
          required
        />

        <ChampSelection
          label="Budget estimé"
          options={budgetOptions}
          value={formData.budgetEstime}
          onChange={handleInputChange}
          name="budgetEstime"
          required
        />

        <ZoneTexte
          label="Description du projet"
          placeholder="Décrivez votre projet, vos objectifs et vos besoins spécifiques..."
          value={formData.descriptionProjet}
          onChange={handleInputChange}
          name="descriptionProjet"
          required
        />

        <CaseCoche
          label="Je ne suis pas un robot (reCAPTCHA)"
          name="pasUnRobot"
          checked={formData.pasUnRobot}
          onChange={handleInputChange}
        />

        <BoutonPrincipal onClick={handleSubmit} icon={Send}>
          Soumettre ma demande
        </BoutonPrincipal>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <span>🔒</span>
            <span>Vos informations sont sécurisées et confidentielles</span>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default DevisPage;