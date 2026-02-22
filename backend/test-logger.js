// Script de test du système de logging NoSQL
require('dotenv').config();
const { createLog, getLogs, deleteOldLogs } = require('./src/services/firebaseService');

async function testLogger() {
  console.log('\n🧪 ========== TEST DU LOGGER NOSQL ==========\n');

  // Test 1 : Vérification de la connexion
  console.log('📋 Test 1 : Vérification de la connexion Firebase...');
  try {
    const { initializeFirebase } = require('./src/services/firebaseService');
    const db = initializeFirebase();
    if (db) {
      console.log('✅ Connexion Firebase réussie\n');
    } else {
      console.log('❌ Échec de la connexion Firebase\n');
      return;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return;
  }

  // Test 2 : Création d'un log
  console.log('📋 Test 2 : Création d\'un log de test...');
  try {
    const logId = await createLog({
      action: 'TEST_LOGGER',
      user: {
        idUtilisateur: 999,
        email: 'test@digitalcraft.com',
        role: 'Administrateur'
      },
      payload: {
        message: 'Ceci est un test du système de logging',
        timestamp: new Date().toISOString()
      },
      ip: '127.0.0.1',
      userAgent: 'Test Script Node.js'
    });

    if (logId) {
      console.log(`✅ Log créé avec succès ! ID: ${logId}\n`);
    } else {
      console.log('⚠️ Log créé mais ID non retourné (peut-être en mode mock)\n');
    }
  } catch (error) {
    console.error('❌ Erreur création log:', error.message, '\n');
  }

  // Test 3 : Récupération des logs
  console.log('📋 Test 3 : Récupération des logs récents...');
  try {
    const logs = await getLogs({}, 5);
    console.log(`✅ ${logs.length} logs récupérés`);

    if (logs.length > 0) {
      console.log('\n📝 Dernier log :');
      const lastLog = logs[0];
      console.log(`   - Action: ${lastLog.action}`);
      console.log(`   - Utilisateur: ${lastLog.user?.email || 'Anonyme'}`);
      console.log(`   - Date: ${lastLog.timestamp}`);
      console.log(`   - IP: ${lastLog.ip || 'N/A'}`);
    }
    console.log('');
  } catch (error) {
    console.error('❌ Erreur récupération logs:', error.message, '\n');
  }

  // Test 4 : Test des filtres
  console.log('📋 Test 4 : Test des filtres (recherche par action)...');
  try {
    const testLogs = await getLogs({ action: 'TEST_LOGGER' }, 10);
    console.log(`✅ ${testLogs.length} logs trouvés avec l'action "TEST_LOGGER"\n`);
  } catch (error) {
    console.error('❌ Erreur filtrage logs:', error.message, '\n');
  }

  // Résumé
  console.log('🎯 ========== RÉSUMÉ ==========');
  console.log('✅ Tous les tests sont terminés !');
  console.log('');
  console.log('🔍 Vérifiez maintenant dans Firebase Console :');
  console.log('   1. Allez sur https://console.firebase.google.com');
  console.log('   2. Sélectionnez votre projet "digitalcraft-9b517"');
  console.log('   3. Menu "Firestore Database" → "Données"');
  console.log('   4. Collection "logs" → Vous devriez voir vos logs de test');
  console.log('');
  console.log('📚 Documentation complète : backend/LOGGER_NOSQL.md');
  console.log('📚 Guide d\'installation : backend/INSTALLATION_LOGGER.md');
  console.log('');

  process.exit(0);
}

// Gérer les erreurs non catchées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error.message);
  process.exit(1);
});

// Lancer les tests
testLogger();
