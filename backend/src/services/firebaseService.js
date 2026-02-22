const admin = require('firebase-admin');

// Initialiser Firebase Admin (une seule fois)
let db = null;

const initializeFirebase = () => {
  if (!db) {
    try {
      // Vérifier si Firebase est déjà initialisé
      if (!admin.apps.length) {
        // Créer les credentials depuis les variables d'environnement
        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
      }
      db = admin.firestore();
      console.log('✅ Firebase Firestore initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation Firebase:', error.message);
      console.warn('⚠️ Les logs ne seront pas enregistrés dans Firestore');
    }
  }
  return db;
};

/**
 * Créer un log dans Firestore
 * @param {Object} logData - Données du log
 * @returns {Promise<string>} - ID du log créé
 */
const createLog = async (logData) => {
  try {
    const firestore = initializeFirebase();
    if (!firestore) {
      console.warn('⚠️ Firestore non disponible, log ignoré');
      return null;
    }

    const logRef = await firestore.collection('logs').add({
      ...logData,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`📝 Log créé: ${logData.action} par ${logData.user?.email || 'Anonyme'}`);
    return logRef.id;
  } catch (error) {
    console.error('❌ Erreur création log:', error.message);
    return null;
  }
};

/**
 * Récupérer les logs avec filtres
 * @param {Object} filters - Filtres (action, userId, dateDebut, dateFin)
 * @param {number} limit - Nombre max de résultats
 * @returns {Promise<Array>} - Liste des logs
 */
const getLogs = async (filters = {}, limit = 100) => {
  try {
    const firestore = initializeFirebase();
    if (!firestore) return [];

    let query = firestore.collection('logs').orderBy('timestamp', 'desc').limit(limit);

    // Filtres
    if (filters.action) {
      query = query.where('action', '==', filters.action);
    }
    if (filters.userId) {
      query = query.where('user.idUtilisateur', '==', parseInt(filters.userId));
    }
    if (filters.dateDebut) {
      query = query.where('timestamp', '>=', admin.firestore.Timestamp.fromDate(new Date(filters.dateDebut)));
    }
    if (filters.dateFin) {
      query = query.where('timestamp', '<=', admin.firestore.Timestamp.fromDate(new Date(filters.dateFin)));
    }

    const snapshot = await query.get();
    const logs = [];

    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString()
      });
    });

    return logs;
  } catch (error) {
    console.error('❌ Erreur récupération logs:', error.message);
    return [];
  }
};

/**
 * Supprimer les logs de plus de X jours (RGPD)
 * @param {number} days - Nombre de jours
 * @returns {Promise<number>} - Nombre de logs supprimés
 */
const deleteOldLogs = async (days = 90) => {
  try {
    const firestore = initializeFirebase();
    if (!firestore) return 0;

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const snapshot = await firestore.collection('logs')
      .where('timestamp', '<', admin.firestore.Timestamp.fromDate(dateLimit))
      .get();

    const batch = firestore.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
    console.log(`🗑️ ${snapshot.size} logs supprimés (> ${days} jours)`);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Erreur suppression logs:', error.message);
    return 0;
  }
};

module.exports = {
  initializeFirebase,
  createLog,
  getLogs,
  deleteOldLogs
};
