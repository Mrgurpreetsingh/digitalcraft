// ======================================
// 📝 TESTS SIMPLES POUR FORMULAIRE DEVIS
// ======================================
import { describe, test, expect } from 'vitest';
import * as Yup from 'yup';

// Schéma de validation du formulaire Devis
const DevisSchema = Yup.object().shape({
  nom: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ' -]+$/, 'Nom invalide')
    .min(2, 'Nom trop court')
    .required('Nom requis'),
  prenom: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ' -]+$/, 'Prénom invalide')
    .min(2, 'Prénom trop court')
    .required('Prénom requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  description: Yup.string()
    .min(10, 'Description trop courte')
    .required('Description requise'),
  rgpd: Yup.boolean()
    .oneOf([true], 'Vous devez accepter la politique')
});

describe('Formulaire Devis - Tests de validation', () => {

  // ============================
  // TEST 1 : Formulaire valide
  // ============================
  test('Formulaire valide avec toutes les données correctes', async () => {
    const formData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      typeServiceId: '1',
      budgetEstime: '1000-3000',
      description: 'Je souhaite créer un site web vitrine pour mon entreprise',
      rgpd: true
    };

    const isValid = await DevisSchema.isValid(formData);
    expect(isValid).toBe(true);
  });

  // ============================
  // TEST 2 : Email invalide
  // ============================
  test('Email invalide rejette le formulaire', async () => {
    const formData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'email-invalide',
      typeServiceId: '1',
      budgetEstime: '1000-3000',
      description: 'Je souhaite créer un site web',
      rgpd: true
    };

    const isValid = await DevisSchema.isValid(formData);
    expect(isValid).toBe(false);
  });

  // ============================
  // TEST 3 : Nom trop court
  // ============================
  test('Nom avec 1 caractère est invalide', async () => {
    const formData = {
      nom: 'D',
      prenom: 'Jean',
      email: 'jean@example.com',
      description: 'Description valide de plus de 10 caractères',
      rgpd: true
    };

    const isValid = await DevisSchema.isValid(formData);
    expect(isValid).toBe(false);
  });

  // ============================
  // TEST 4 : Description trop courte
  // ============================
  test('Description avec moins de 10 caractères est invalide', async () => {
    const formData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      description: 'Court',
      rgpd: true
    };

    const isValid = await DevisSchema.isValid(formData);
    expect(isValid).toBe(false);
  });

  // ============================
  // TEST 5 : RGPD non accepté
  // ============================
  test('RGPD non accepté rend le formulaire invalide', async () => {
    const formData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      description: 'Je souhaite créer un site web',
      rgpd: false
    };

    const isValid = await DevisSchema.isValid(formData);
    expect(isValid).toBe(false);
  });

  // ============================
  // TEST 6 : Nom avec chiffres invalide
  // ============================
  test('Nom avec chiffres est invalide', async () => {
    const formData = {
      nom: 'Dupont123',
      prenom: 'Jean',
      email: 'jean@example.com',
      description: 'Description valide',
      rgpd: true
    };

    const isValid = await DevisSchema.isValid(formData);
    expect(isValid).toBe(false);
  });
});
