// ======================================
// 📝 TESTS SIMPLES POUR LES VALIDATIONS
// ======================================
import { describe, test, expect } from 'vitest';


// ============================
// FONCTIONS SIMPLES
// ============================


// Fonction 1 : Vérifier si un texte est vide
function estVide(texte) {
  return !texte || texte.trim() === '';
}


// Fonction 2 : Compter les caractères
function compterCaracteres(texte) {
  return texte ? texte.length : 0;
}


// Fonction 3 : Vérifier si email contient @
function aUnArobase(email) {
  // Retourne true si @ trouvé, sinon false
  return !!(email && email.includes('@'));
}


// ======================================
// TESTS
// ======================================


describe('Validation - Tests Simples', () => {


  // ============================
  // TESTS : Texte vide
  // ============================
  describe('Vérifier si texte vide', () => {
    test('Texte vide : ""', () => {
      expect(estVide('')).toBe(true);
    });


    test('Texte avec espaces : "   "', () => {
      expect(estVide('   ')).toBe(true);
    });


    test('Texte non vide : "Bonjour"', () => {
      expect(estVide('Bonjour')).toBe(false);
    });
  });


  // ============================
  // TESTS : Compter caractères
  // ============================
  describe('Compter les caractères', () => {
    test('Mot simple : "Test" = 4 caractères', () => {
      expect(compterCaracteres('Test')).toBe(4);
    });


    test('Phrase : "Bonjour le monde" = 16 caractères', () => {
      expect(compterCaracteres('Bonjour le monde')).toBe(16);
    });


    test('Texte vide : "" = 0 caractères', () => {
      expect(compterCaracteres('')).toBe(0);
    });


    test('Texte null = 0 caractères', () => {
      expect(compterCaracteres(null)).toBe(0);
    });
  });


  // ============================
  // TESTS : Email avec @
  // ============================
  describe('Vérifier arobase dans email', () => {
    test('Email valide : "test@gmail.com"', () => {
      expect(aUnArobase('test@gmail.com')).toBe(true);
    });


    test('Email valide : "jean.dupont@example.fr"', () => {
      expect(aUnArobase('jean.dupont@example.fr')).toBe(true);
    });


    test('Email invalide : "pasdemail"', () => {
      expect(aUnArobase('pasdemail')).toBe(false);
    });


    test('Email vide : ""', () => {
      expect(aUnArobase('')).toBe(false);
    });
  });


  // ============================
  // TESTS COMBINÉS
  // ============================
  describe('Tests combinés', () => {
    test('Formulaire valide', () => {
      const nom = 'Dupont';
      const email = 'dupont@example.com';


      // Vérifications
      expect(estVide(nom)).toBe(false); // Nom pas vide
      expect(aUnArobase(email)).toBe(true); // Email avec @
      expect(compterCaracteres(nom)).toBeGreaterThan(2); // Nom > 2 lettres
    });


    test('Formulaire invalide : nom vide', () => {
      const nom = '';
      const email = 'dupont@example.com';


      // Le nom est vide (invalide)
      expect(estVide(nom)).toBe(true);


      // L'email est valide
      expect(aUnArobase(email)).toBe(true);
    });
  });


});










