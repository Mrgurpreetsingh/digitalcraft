// src/config/firebase.js
const admin = require('firebase-admin');

// Configuration Firebase avec vos vraies clés
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "FIREBASE_API_KEY_REMOVED",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "digitalcraft-9b517.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "digitalcraft-9b517",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "digitalcraft-9b517.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "482838114462",
  appId: process.env.FIREBASE_APP_ID || "1:482838114462:web:134818a1fd7a985d07cb8f",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-YG6K84J7R6"
};

// Initialiser Firebase Admin SDK
let serviceAccount;

try {
  // Essayer de charger depuis le fichier JSON (recommandé)
  serviceAccount = require('../../firebase-service-account.json');
  console.log('✅ Fichier firebase-service-account.json trouvé');
} catch (error) {
  console.log('⚠️ Fichier firebase-service-account.json non trouvé');
  console.log('📝 Tentative avec les variables d\'environnement...');
  
  // Essayer avec les variables d'environnement
  if (process.env.FIREBASE_PRIVATE_KEY) {
    console.log('✅ Variables d\'environnement Firebase trouvées');
    serviceAccount = {
      type: "service_account",
      project_id: firebaseConfig.projectId,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "env_key_id",
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL || `firebase-adminsdk-env@${firebaseConfig.projectId}.iam.gserviceaccount.com`,
      client_id: process.env.FIREBASE_CLIENT_ID || "env_client_id",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-env%40${firebaseConfig.projectId}.iam.gserviceaccount.com`
    };
  } else {
    console.log('❌ Aucune configuration Firebase trouvée');
    console.log('📝 Utilisation du mode mock pour développement');
    
    // Configuration temporaire avec les clés frontend
    // Note: Cette approche a des limitations pour les opérations admin
    serviceAccount = {
      type: "service_account",
      project_id: firebaseConfig.projectId,
      private_key_id: "temp_key_id",
      private_key: "-----BEGIN PRIVATE KEY-----\nTEMP_KEY\n-----END PRIVATE KEY-----\n",
      client_email: `firebase-adminsdk-temp@${firebaseConfig.projectId}.iam.gserviceaccount.com`,
      client_id: "temp_client_id",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-temp%40${firebaseConfig.projectId}.iam.gserviceaccount.com`
    };
  }
}

// Initialiser l'app Firebase Admin
let db = null;

if (!admin.apps.length) {
  try {
    // Essayer d'initialiser avec les clés de service
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin SDK initialisé avec clés de service');
    db = admin.firestore();
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase Admin:', error.message);
    console.log('⚠️ Utilisation du mode mock pour développement');
    
    // Créer un objet mock plus robuste
    db = {
      collection: (collectionName) => ({
        doc: (docId) => ({
          get: async () => ({ 
            exists: false, 
            data: () => null,
            id: docId 
          }),
          set: async (data) => ({ 
            id: docId || 'mock-id',
            ...data 
          }),
          update: async (data) => ({ 
            id: docId,
            ...data 
          }),
          delete: async () => ({ 
            success: true 
          })
        }),
        add: async (data) => ({ 
          id: 'mock-id-' + Date.now(),
          ...data 
        }),
        get: async () => ({ 
          docs: [],
          forEach: (callback) => {
            // Mock data pour test
            const mockDocs = [
              {
                id: 'mock-avis-1',
                data: () => ({
                  clientName: 'Jean Dupont',
                  rating: 5,
                  message: 'Excellent travail !',
                  status: 'pending',
                  createdAt: new Date()
                })
              },
              {
                id: 'mock-avis-2',
                data: () => ({
                  clientName: 'Marie Martin',
                  rating: 4,
                  message: 'Très satisfaite du résultat',
                  status: 'approved',
                  createdAt: new Date()
                })
              }
            ];
            mockDocs.forEach(callback);
          }
        })
      })
    };
  }
}

// Exporter Firestore (peut être null si Firebase n'est pas configuré)

module.exports = { admin, db }; 