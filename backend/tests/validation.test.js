// ======================================
// 📝 TESTS SIMPLES POUR LES VALIDATIONS
// ======================================
// Ces tests vérifient les fonctions de validation


// ============================
// FONCTION SIMPLE : Valider un email
// ============================
function validerEmail(email) {
  // Vérifie si l'email contient @ et un point
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


// ============================
// FONCTION SIMPLE : Valider un budget
// ============================
function validerBudget(budget) {
  // Le budget doit être un nombre positif
  return typeof budget === 'number' && budget > 0;
}


// ============================
// FONCTION SIMPLE : Valider un nom
// ============================
function validerNom(nom) {
  // Le nom doit avoir au moins 2 caractères
  return typeof nom === 'string' && nom.length >= 2;
}


// ======================================
// TESTS
// ======================================


describe('Tests de Validation - Niveau Débutant', () => {


  // ============================
  // TESTS EMAIL
  // ============================
  describe('Validation Email', () => {
    test('Email valide : test@example.com', () => {
      const resultat = validerEmail('test@example.com');
      expect(resultat).toBe(true); // Doit être valide
    });


    test('Email valide : jean.dupont@gmail.com', () => {
      const resultat = validerEmail('jean.dupont@gmail.com');
      expect(resultat).toBe(true);
    });


    test('Email invalide : pasdemail', () => {
      const resultat = validerEmail('pasdemail');
      expect(resultat).toBe(false); // Doit être invalide
    });


    test('Email invalide : test@', () => {
      const resultat = validerEmail('test@');
      expect(resultat).toBe(false);
    });


    test('Email invalide : vide', () => {
      const resultat = validerEmail('');
      expect(resultat).toBe(false);
    });
  });


  // ============================
  // TESTS BUDGET
  // ============================
  describe('Validation Budget', () => {
    test('Budget valide : 5000', () => {
      const resultat = validerBudget(5000);
      expect(resultat).toBe(true); // Doit être valide
    });


    test('Budget valide : 10000.50', () => {
      const resultat = validerBudget(10000.50);
      expect(resultat).toBe(true);
    });


    test('Budget invalide : 0', () => {
      const resultat = validerBudget(0);
      expect(resultat).toBe(false); // Doit être invalide
    });


    test('Budget invalide : nombre négatif', () => {
      const resultat = validerBudget(-1000);
      expect(resultat).toBe(false);
    });


    test('Budget invalide : texte au lieu de nombre', () => {
      const resultat = validerBudget('5000');
      expect(resultat).toBe(false);
    });
  });


  // ============================
  // TESTS NOM
  // ============================
  describe('Validation Nom', () => {
    test('Nom valide : Dupont', () => {
      const resultat = validerNom('Dupont');
      expect(resultat).toBe(true); // Doit être valide
    });


    test('Nom valide : Jean', () => {
      const resultat = validerNom('Jean');
      expect(resultat).toBe(true);
    });


    test('Nom invalide : trop court (1 lettre)', () => {
      const resultat = validerNom('A');
      expect(resultat).toBe(false); // Doit être invalide
    });


    test('Nom invalide : vide', () => {
      const resultat = validerNom('');
      expect(resultat).toBe(false);
    });


    test('Nom invalide : pas une chaîne de caractères', () => {
      const resultat = validerNom(123);
      expect(resultat).toBe(false);
    });
  });


  // ============================
  // TEST COMBINÉ
  // ============================
  describe('Validation Complète Devis', () => {
    test('Tous les champs valides', () => {
      const devis = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com',
        budget: 5000
      };


      // Vérifier chaque champ
      expect(validerNom(devis.nom)).toBe(true);
      expect(validerNom(devis.prenom)).toBe(true);
      expect(validerEmail(devis.email)).toBe(true);
      expect(validerBudget(devis.budget)).toBe(true);
    });


    test('Un champ invalide : email incorrect', () => {
      const devis = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'pasdamail', // INVALIDE
        budget: 5000
      };


      // Vérifier que l'email est invalide
      expect(validerEmail(devis.email)).toBe(false);


      // Les autres doivent être valides
      expect(validerNom(devis.nom)).toBe(true);
      expect(validerNom(devis.prenom)).toBe(true);
      expect(validerBudget(devis.budget)).toBe(true);
    });
  });


});





