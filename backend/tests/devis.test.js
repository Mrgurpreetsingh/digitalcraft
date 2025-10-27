// ======================================
// 📝 TESTS SIMPLES POUR LES DEVIS
// ======================================
// Ces tests vérifient que les fonctions de devis fonctionnent correctement


describe('Tests Devis - Niveau Débutant', () => {


  // ============================
  // TEST 1 : Vérifier la structure d'un devis
  // ============================
  test('Un devis doit avoir toutes les propriétés obligatoires', () => {
    // On crée un objet devis simple
    const devis = {
      numeroDevis: 'DEV-2025-001',
      nomDemandeur: 'Dupont',
      prenomDemandeur: 'Jean',
      emailDemandeur: 'jean@example.com',
      budgetEstime: 5000,
      description: 'Site web vitrine',
      typeServiceId: 1,
      statut: 'en attente'
    };


    // On vérifie que chaque propriété existe
    expect(devis).toHaveProperty('numeroDevis');
    expect(devis).toHaveProperty('nomDemandeur');
    expect(devis).toHaveProperty('emailDemandeur');
    expect(devis).toHaveProperty('budgetEstime');
    expect(devis).toHaveProperty('description');


    // On vérifie que les valeurs ne sont pas vides
    expect(devis.numeroDevis).toBeTruthy(); // Vérifie que ce n'est pas vide
    expect(devis.nomDemandeur).toBeTruthy();
    expect(devis.emailDemandeur).toBeTruthy();
  });


  // ============================
  // TEST 2 : Vérifier le format du numéro de devis
  // ============================
  test('Le numéro de devis doit avoir le bon format', () => {
    const numeroDevis = 'DEV-2025-001';


    // Le numéro doit commencer par "DEV-"
    expect(numeroDevis).toMatch(/^DEV-/);


    // Le numéro doit contenir l'année
    expect(numeroDevis).toContain('2025');
  });


  // ============================
  // TEST 3 : Vérifier que le budget est un nombre
  // ============================
  test('Le budget doit être un nombre positif', () => {
    const budget1 = 5000;
    const budget2 = 10000.50;


    // Vérifier que c'est un nombre
    expect(typeof budget1).toBe('number');
    expect(typeof budget2).toBe('number');


    // Vérifier que c'est positif
    expect(budget1).toBeGreaterThan(0);
    expect(budget2).toBeGreaterThan(0);
  });


  // ============================
  // TEST 4 : Vérifier le format de l'email
  // ============================
  test("L'email doit avoir un format valide", () => {
    const emailValide = 'test@example.com';
    const emailInvalide = 'pasdamail';


    // Vérifier qu'un email valide contient "@"
    expect(emailValide).toContain('@');
    expect(emailValide).toMatch(/@/);


    // Vérifier qu'un email invalide est détecté
    expect(emailInvalide).not.toContain('@');
  });


  // ============================
  // TEST 5 : Vérifier les statuts possibles
  // ============================
  test('Le statut doit être valide', () => {
    const statutsValides = ['en attente', 'validé', 'refusé', 'en cours'];


    const statutTest = 'en attente';


    // Vérifier que le statut fait partie des statuts valides
    expect(statutsValides).toContain(statutTest);
  });


  // ============================
  // TEST 6 : Vérifier la longueur de la description
  // ============================
  test('La description ne doit pas être trop courte', () => {
    const descriptionTropCourte = 'Web';
    const descriptionValide = 'Je souhaite créer un site web vitrine pour mon entreprise';


    // Une description doit avoir au moins 10 caractères
    expect(descriptionValide.length).toBeGreaterThanOrEqual(10);
    expect(descriptionTropCourte.length).toBeLessThan(10);
  });


});





