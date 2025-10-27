// Configuration Jest pour les tests backend
module.exports = {
  // Environnement de test (Node.js)
  testEnvironment: 'node',


  // Où chercher les tests (tous les fichiers .test.js)
  testMatch: ['**/tests/**/*.test.js'],


  // Coverage (rapport de couverture)
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',  // On exclut le serveur
    '!src/config/**'   // On exclut la config
  ],


  // Affichage des résultats
  verbose: true,


  // Timeout par défaut (10 secondes)
  testTimeout: 10000
};



