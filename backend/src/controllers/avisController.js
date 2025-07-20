// src/controllers/avisController.js
const { executeQuery } = require('../config/database');
const { db } = require('../config/firebase');

// Fonction helper pour vérifier si Firebase est disponible
const isFirebaseAvailable = () => {
  return db && typeof db.collection === 'function';
}; // Import Firebase

class AvisController {
  // Récupérer tous les avis (depuis MySQL avec liaison Firebase)
  static async getAll(req, res) {
    try {
      const query = `
        SELECT a.*, p.titre as projetTitre, u.nom as clientNom, u.prenom as clientPrenom
        FROM Avis a
        LEFT JOIN Projet p ON a.projetId = p.idProjet
        LEFT JOIN Utilisateur u ON a.clientId = u.idUtilisateur
        ORDER BY a.dateCreation DESC
      `;
      const results = await executeQuery(query);
      
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Récupérer un avis par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT a.*, p.titre as projetTitre, u.nom as clientNom, u.prenom as clientPrenom
        FROM Avis a
        LEFT JOIN Projet p ON a.projetId = p.idProjet
        LEFT JOIN Utilisateur u ON a.clientId = u.idUtilisateur
        WHERE a.idAvis = ?
      `;
      const results = await executeQuery(query, [id]);
      
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
      }
      
      res.json({
        success: true,
        data: results[0]
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Créer un nouvel avis (MySQL + Firebase)
  static async create(req, res) {
    try {
      const { 
        clientName, 
        clientRole, 
        rating, 
        message, 
        projectId, 
        clientId,
        status = 'pending'
      } = req.body;

      // Validation des champs obligatoires
      if (!clientName || !rating || !message) {
        return res.status(400).json({
          success: false,
          message: 'Nom du client, note et message sont obligatoires'
        });
      }

      // Validation de la note (1-5)
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'La note doit être comprise entre 1 et 5'
        });
      }

      // Générer un numéro d'avis unique
      const numeroAvis = await this.generateNumeroAvis();

      // Créer l'avis dans Firebase (structure exacte de vos données)
      let firebaseId = null;
      if (isFirebaseAvailable()) {
        try {
          const firebaseData = {
            clientName,
            clientRole: clientRole || null,
            rating,
            message,
            projectId: projectId || null,
            status,
            createdAt: new Date()
          };

          const firebaseRef = await db.collection('avis').add(firebaseData);
          firebaseId = firebaseRef.id;
        } catch (firebaseError) {
          console.error('Erreur Firebase:', firebaseError);
          // Continuer sans Firebase si erreur
        }
      }

      // Créer l'avis dans MySQL (adapté à votre structure MPD)
      const query = `
        INSERT INTO Avis (firebaseId, numeroAvis, nomClient, clientRole, note, contenu, projetId, clientId, statut) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        firebaseId,
        numeroAvis,
        clientName,
        clientRole || null,
        rating,
        message,
        projectId || null,
        clientId || null,
        status
      ];

      const result = await executeQuery(query, values);
      
      res.status(201).json({
        success: true,
        message: 'Avis créé avec succès',
        data: { 
          id: result.insertId,
          firebaseId: firebaseId,
          numeroAvis: numeroAvis
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Modifier un avis (MySQL + Firebase)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { 
        clientName, 
        clientRole, 
        rating, 
        message, 
        projectId, 
        clientId,
        status 
      } = req.body;

      // Vérifier que l'avis existe
      const existingAvis = await executeQuery('SELECT * FROM Avis WHERE idAvis = ?', [id]);
      if (existingAvis.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
      }

      // Validation de la note si fournie
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'La note doit être comprise entre 1 et 5'
        });
      }

      // Mettre à jour dans Firebase si firebaseId existe et Firebase disponible
      if (existingAvis[0].firebaseId && isFirebaseAvailable()) {
        try {
          const updateData = {
            ...(clientName && { clientName }),
            ...(clientRole !== undefined && { clientRole }),
            ...(rating && { rating }),
            ...(message && { message }),
            ...(projectId !== undefined && { projectId }),
            ...(status && { status })
          };

          await db.collection('avis').doc(existingAvis[0].firebaseId).update(updateData);
        } catch (firebaseError) {
          console.error('Erreur mise à jour Firebase:', firebaseError);
          // Continuer sans Firebase si erreur
        }
      }

      // Mettre à jour dans MySQL
      const query = `
        UPDATE Avis 
        SET nomClient = ?, clientRole = ?, note = ?, contenu = ?, 
            projetId = ?, clientId = ?, statut = ?
        WHERE idAvis = ?
      `;
      
      const values = [
        clientName || existingAvis[0].nomClient,
        clientRole !== undefined ? clientRole : existingAvis[0].clientRole,
        rating || existingAvis[0].note,
        message || existingAvis[0].contenu,
        projectId !== undefined ? projectId : existingAvis[0].projetId,
        clientId !== undefined ? clientId : existingAvis[0].clientId,
        status || existingAvis[0].statut,
        id
      ];

      await executeQuery(query, values);
      
      res.json({
        success: true,
        message: 'Avis modifié avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la modification de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Supprimer un avis (MySQL + Firebase)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Vérifier que l'avis existe
      const existingAvis = await executeQuery('SELECT * FROM Avis WHERE idAvis = ?', [id]);
      if (existingAvis.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
      }

      // Supprimer de Firebase si firebaseId existe
      if (existingAvis[0].firebaseId) {
        try {
          await db.collection('avis').doc(existingAvis[0].firebaseId).delete();
        } catch (firebaseError) {
          console.error('Erreur suppression Firebase:', firebaseError);
          // Continuer sans Firebase si erreur
        }
      }

      // Supprimer de MySQL
      await executeQuery('DELETE FROM Avis WHERE idAvis = ?', [id]);
      
      res.json({
        success: true,
        message: 'Avis supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Valider un avis (changer le statut) - MySQL + Firebase
  static async validate(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide. Doit être pending, approved ou rejected'
        });
      }

      // Vérifier que l'avis existe
      const existingAvis = await executeQuery('SELECT * FROM Avis WHERE idAvis = ?', [id]);
      if (existingAvis.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
      }

      // Mettre à jour dans Firebase si firebaseId existe
      if (existingAvis[0].firebaseId) {
        try {
          await db.collection('avis').doc(existingAvis[0].firebaseId).update({
            status
          });
        } catch (firebaseError) {
          console.error('Erreur validation Firebase:', firebaseError);
          // Continuer sans Firebase si erreur
        }
      }

      // Mettre à jour dans MySQL
      await executeQuery('UPDATE Avis SET statut = ? WHERE idAvis = ?', [status, id]);
      
      res.json({
        success: true,
        message: `Avis ${status === 'approved' ? 'approuvé' : status === 'rejected' ? 'rejeté' : 'en attente'}`
      });
    } catch (error) {
      console.error('Erreur lors de la validation de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Récupérer les avis par statut
  static async getByStatus(req, res) {
    try {
      const { status } = req.params;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide'
        });
      }

      const query = `
        SELECT a.*, p.titre as projetTitre, u.nom as clientNom, u.prenom as clientPrenom
        FROM Avis a
        LEFT JOIN Projet p ON a.projetId = p.idProjet
        LEFT JOIN Utilisateur u ON a.clientId = u.idUtilisateur
        WHERE a.statut = ?
        ORDER BY a.dateCreation DESC
      `;
      
      const results = await executeQuery(query, [status]);
      
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des avis par statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Récupérer les statistiques des avis
  static async getStats(req, res) {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN statut = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN statut = 'approved' THEN 1 END) as approved,
          COUNT(CASE WHEN statut = 'rejected' THEN 1 END) as rejected,
          AVG(note) as averageRating
        FROM Avis
      `;
      
      const stats = await executeQuery(statsQuery);
      
      res.json({
        success: true,
        data: stats[0]
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Créer des avis de test dans MySQL (pour debug)
  static async createTestAvis(req, res) {
    try {
      console.log('🧪 Création d\'avis de test...');
      
      const testAvis = [
        {
          firebaseId: 'mock-avis-1',
          numeroAvis: 'AVIS202501001',
          nomClient: 'Jean Dupont',
          clientRole: 'Directeur Marketing',
          note: 5,
          contenu: 'Excellent travail ! L\'équipe a été très professionnelle et le résultat dépasse nos attentes.',
          projetId: null,
          statut: 'pending'
        },
        {
          firebaseId: 'mock-avis-2',
          numeroAvis: 'AVIS202501002',
          nomClient: 'Marie Martin',
          clientRole: 'Fondatrice Startup',
          note: 4,
          contenu: 'Très satisfaite du résultat. Le site est moderne et performant. Je recommande !',
          projetId: null,
          statut: 'approved'
        }
      ];

      let createdCount = 0;
      
      for (const avis of testAvis) {
        try {
          // Vérifier si l'avis existe déjà
          const existing = await executeQuery(
            'SELECT idAvis FROM Avis WHERE firebaseId = ?', 
            [avis.firebaseId]
          );

          if (existing.length === 0) {
            await executeQuery(`
              INSERT INTO Avis (firebaseId, numeroAvis, nomClient, clientRole, note, contenu, projetId, statut)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              avis.firebaseId,
              avis.numeroAvis,
              avis.nomClient,
              avis.clientRole,
              avis.note,
              avis.contenu,
              avis.projetId,
              avis.statut
            ]);
            
            console.log(`✅ Avis ${avis.firebaseId} créé avec succès`);
            createdCount++;
          } else {
            console.log(`⏭️ Avis ${avis.firebaseId} existe déjà`);
          }
        } catch (error) {
          console.error(`❌ Erreur création avis ${avis.firebaseId}:`, error.message);
        }
      }

      res.json({
        success: true,
        message: `${createdCount} avis de test créés avec succès`
      });
    } catch (error) {
      console.error('❌ Erreur création avis de test:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur: ' + error.message
      });
    }
  }

  // Récupérer les avis Firebase uniquement (pour debug)
  static async getFirebaseAvis(req, res) {
    try {
      console.log('🔍 Tentative de récupération des avis Firebase...');
      
      if (!isFirebaseAvailable()) {
        console.log('❌ Firebase non disponible');
        return res.status(500).json({
          success: false,
          message: 'Firebase non disponible'
        });
      }

      console.log('✅ Firebase disponible, récupération des avis...');
      const firebaseSnapshot = await db.collection('avis').get();
      const firebaseAvis = [];
      
      firebaseSnapshot.forEach(doc => {
        firebaseAvis.push({
          firebaseId: doc.id,
          ...doc.data()
        });
      });

      console.log(`✅ ${firebaseAvis.length} avis trouvés dans Firebase`);
      res.json({
        success: true,
        message: `${firebaseAvis.length} avis trouvés dans Firebase`,
        data: firebaseAvis
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération Firebase:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur: ' + error.message
      });
    }
  }

  // Synchroniser les avis Firebase avec MySQL
  static async syncFromFirebase(req, res) {
    try {
      console.log('🔄 Début de la synchronisation Firebase → MySQL...');
      
      // Récupérer tous les avis de Firebase
      const firebaseSnapshot = await db.collection('avis').get();
      const firebaseAvis = [];
      
      firebaseSnapshot.forEach(doc => {
        firebaseAvis.push({
          firebaseId: doc.id,
          ...doc.data()
        });
      });

      console.log(`📊 ${firebaseAvis.length} avis trouvés dans Firebase`);
      console.log('📋 Avis Firebase:', firebaseAvis);

      let syncedCount = 0;
      let errorCount = 0;

      // Pour chaque avis Firebase, vérifier s'il existe dans MySQL
      for (const avis of firebaseAvis) {
        try {
          console.log(`🔍 Traitement de l'avis ${avis.firebaseId}...`);
          
          const existingAvis = await executeQuery(
            'SELECT idAvis FROM Avis WHERE firebaseId = ?', 
            [avis.firebaseId]
          );

          console.log(`📋 Avis existant dans MySQL:`, existingAvis);

          if (existingAvis.length === 0) {
            console.log(`➕ Avis ${avis.firebaseId} n'existe pas dans MySQL, insertion...`);
            
            // Générer un numéro d'avis unique
            const numeroAvis = await this.generateNumeroAvis();
            console.log(`🔢 Numéro d'avis généré: ${numeroAvis}`);
            
            // Préparer les données pour l'insertion
            const insertData = [
              avis.firebaseId,
              numeroAvis,
              avis.clientName,
              avis.clientRole || null,
              avis.rating,
              avis.message,
              avis.projectId || null,
              avis.status || 'pending'
            ];
            
            console.log(`📝 Données à insérer:`, insertData);
            
            // Insérer dans MySQL (adapté à votre structure)
            const result = await executeQuery(`
              INSERT INTO Avis (firebaseId, numeroAvis, nomClient, clientRole, note, contenu, projetId, statut)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, insertData);
            
            console.log(`✅ Avis ${avis.firebaseId} inséré avec succès, ID MySQL: ${result.insertId}`);
            syncedCount++;
          } else {
            console.log(`⏭️ Avis ${avis.firebaseId} existe déjà dans MySQL, ignoré`);
          }
        } catch (error) {
          console.error(`❌ Erreur synchronisation avis ${avis.firebaseId}:`, error);
          console.error(`📋 Détails de l'erreur:`, error.message);
          errorCount++;
        }
      }

      console.log(`🎯 Synchronisation terminée: ${syncedCount} synchronisés, ${errorCount} erreurs`);
      
      res.json({
        success: true,
        message: `Synchronisation terminée. ${syncedCount} avis synchronisés, ${errorCount} erreurs.`
      });
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur: ' + error.message
      });
    }
  }

  // Générer un numéro d'avis unique
  static async generateNumeroAvis() {
    const prefix = 'AVIS';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const query = `
      SELECT COUNT(*) as count
      FROM Avis
      WHERE numeroAvis LIKE ?
    `;
    
    const pattern = `${prefix}${year}${month}%`;
    const result = await executeQuery(query, [pattern]);
    const count = result[0].count + 1;
    
    return `${prefix}${year}${month}${String(count).padStart(3, '0')}`;
  }

  // Générer un token de validation pour client (après projet terminé)
  static async generateClientToken(req, res) {
    try {
      const { projectId, clientEmail } = req.body;

      if (!projectId || !clientEmail) {
        return res.status(400).json({
          success: false,
          message: 'ID du projet et email du client requis'
        });
      }

      // Vérifier que le projet existe et est terminé
      const projectQuery = `
        SELECT p.*, u.email as clientEmail, u.nom as clientNom, u.prenom as clientPrenom
        FROM Projet p
        LEFT JOIN Utilisateur u ON p.clientId = u.idUtilisateur
        WHERE p.idProjet = ? AND p.statut = 'Terminé'
      `;
      
      const project = await executeQuery(projectQuery, [projectId]);
      if (project.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé ou non terminé'
        });
      }

      // Générer un token unique
      const token = require('crypto').randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

      // Stocker le token dans Firebase
      if (isFirebaseAvailable()) {
        try {
          await db.collection('testimonial_tokens').doc(token).set({
            projectId,
            clientEmail,
            clientName: `${project[0].clientNom} ${project[0].clientPrenom}`,
            projectTitle: project[0].titre,
            createdAt: new Date(),
            expiresAt,
            used: false
          });
        } catch (firebaseError) {
          console.error('Erreur Firebase token:', firebaseError);
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du token'
          });
        }
      }

      res.json({
        success: true,
        message: 'Token généré avec succès',
        data: {
          token,
          projectTitle: project[0].titre,
          clientName: `${project[0].clientNom} ${project[0].clientPrenom}`,
          expiresAt
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération du token:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Valider un token et créer un avis (pour clients réels)
  static async submitWithToken(req, res) {
    try {
      const { token, rating, message } = req.body;

      if (!token || !rating || !message) {
        return res.status(400).json({
          success: false,
          message: 'Token, note et message requis'
        });
      }

      // Vérifier le token dans Firebase
      if (!isFirebaseAvailable()) {
        return res.status(500).json({
          success: false,
          message: 'Service temporairement indisponible'
        });
      }

      const tokenDoc = await db.collection('testimonial_tokens').doc(token).get();
      if (!tokenDoc.exists) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide'
        });
      }

      const tokenData = tokenDoc.data();
      
      // Vérifier si le token a expiré
      if (new Date() > tokenData.expiresAt.toDate()) {
        return res.status(400).json({
          success: false,
          message: 'Token expiré'
        });
      }

      // Vérifier si le token a déjà été utilisé
      if (tokenData.used) {
        return res.status(400).json({
          success: false,
          message: 'Token déjà utilisé'
        });
      }

      // Créer l'avis avec les données du token
      const avisData = {
        clientName: tokenData.clientName,
        clientEmail: tokenData.clientEmail,
        rating,
        message,
        projectId: tokenData.projectId,
        status: 'pending',
        source: 'client_token',
        submittedViaToken: true
      };

      // Appeler la méthode create existante
      const result = await this.createInternal(avisData);

      // Marquer le token comme utilisé
      await db.collection('testimonial_tokens').doc(token).update({
        used: true,
        usedAt: new Date(),
        avisId: result.id
      });

      res.status(201).json({
        success: true,
        message: 'Témoignage soumis avec succès et en attente de validation',
        data: result
      });
    } catch (error) {
      console.error('Erreur lors de la soumission avec token:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  // Valider un avis Firebase (pour dashboard admin)
  static async validateFirebaseAvis(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide. Doit être pending, approved ou rejected'
        });
      }

      if (!isFirebaseAvailable()) {
        return res.status(500).json({
          success: false,
          message: 'Firebase non disponible'
        });
      }

      // Mettre à jour le statut dans Firebase
      await db.collection('avis').doc(id).update({
        status,
        validatedAt: new Date()
      });

      res.json({
        success: true,
        message: `Avis ${status === 'approved' ? 'approuvé' : status === 'rejected' ? 'rejeté' : 'en attente'}`
      });
    } catch (error) {
      console.error('Erreur lors de la validation Firebase:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur: ' + error.message
      });
    }
  }

  // Modifier un avis Firebase (pour dashboard admin)
  static async updateFirebaseAvis(req, res) {
    try {
      const { id } = req.params;
      const { clientName, clientRole, rating, message, status } = req.body;

      if (!isFirebaseAvailable()) {
        return res.status(500).json({
          success: false,
          message: 'Firebase non disponible'
        });
      }

      // Vérifier que l'avis existe
      const avisDoc = await db.collection('avis').doc(id).get();
      if (!avisDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
      }

      // Mettre à jour dans Firebase
      const updateData = {};
      if (clientName) updateData.clientName = clientName;
      if (clientRole) updateData.clientRole = clientRole;
      if (rating) updateData.rating = rating;
      if (message) updateData.message = message;
      if (status) updateData.status = status;
      
      updateData.updatedAt = new Date();

      await db.collection('avis').doc(id).update(updateData);

      res.json({
        success: true,
        message: 'Avis modifié avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la modification Firebase:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur: ' + error.message
      });
    }
  }

  // Supprimer un avis Firebase (pour dashboard admin)
  static async deleteFirebaseAvis(req, res) {
    try {
      const { id } = req.params;

      if (!isFirebaseAvailable()) {
        return res.status(500).json({
          success: false,
          message: 'Firebase non disponible'
        });
      }

      // Supprimer de Firebase
      await db.collection('avis').doc(id).delete();

      res.json({
        success: true,
        message: 'Avis supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression Firebase:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur: ' + error.message
      });
    }
  }

  // Méthode interne pour créer un avis (utilisée par submitWithToken)
  static async createInternal(avisData) {
    const { 
      clientName, 
      clientEmail,
      rating, 
      message, 
      projectId,
      status = 'pending',
      source = 'admin_created',
      submittedViaToken = false
    } = avisData;

    // Générer un numéro d'avis unique
    const numeroAvis = await this.generateNumeroAvis();

    // Créer l'avis dans Firebase
    let firebaseId = null;
    if (isFirebaseAvailable()) {
      try {
        const firebaseData = {
          clientName,
          clientEmail,
          rating,
          message,
          projectId: projectId || null,
          status,
          source,
          submittedViaToken,
          createdAt: new Date()
        };

        const firebaseRef = await db.collection('avis').add(firebaseData);
        firebaseId = firebaseRef.id;
      } catch (firebaseError) {
        console.error('Erreur Firebase:', firebaseError);
      }
    }

    // Créer l'avis dans MySQL
    const query = `
      INSERT INTO Avis (firebaseId, numeroAvis, nomClient, note, contenu, projetId, statut) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      firebaseId,
      numeroAvis,
      clientName,
      rating,
      message,
      projectId || null,
      status
    ];

    const result = await executeQuery(query, values);
    
    return { 
      id: result.insertId,
      firebaseId: firebaseId,
      numeroAvis: numeroAvis
    };
  }
}

module.exports = AvisController;
