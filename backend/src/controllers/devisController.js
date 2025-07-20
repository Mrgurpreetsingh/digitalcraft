// src/controllers/devisController.js
const { executeQuery } = require('../config/database');

class DevisController {
  
  // Créer un nouveau devis
  static async create(req, res) {
    try {
      console.log('📥 Données reçues:', req.body);
      
      const { 
        nomDemandeur, 
        prenomDemandeur, 
        emailDemandeur, 
        budgetEstime, 
        description, 
        typeServiceId,
        employeId
      } = req.body;
      
      // Vérifications basiques
      if (!nomDemandeur || !prenomDemandeur || !emailDemandeur || !budgetEstime || !description || !typeServiceId) {
        console.log('❌ Champs manquants:', { nomDemandeur, prenomDemandeur, emailDemandeur, budgetEstime, description, typeServiceId });
        return res.status(400).json({ 
          success: false, 
          message: 'Tous les champs obligatoires doivent être remplis' 
        });
      }

      console.log('🔄 Génération du numéro de devis...');
      // Générer le numéro de devis unique
      const numeroDevis = await generateNumeroDevis();
      console.log('✅ Numéro de devis généré:', numeroDevis);
      
      const query = `
        INSERT INTO Devis 
        (numeroDevis, nomDemandeur, prenomDemandeur, emailDemandeur, budgetEstime, description, typeServiceId, employeId, statut) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      // Gestion des valeurs nulles/undefined
      const values = [
        numeroDevis, 
        nomDemandeur, 
        prenomDemandeur, 
        emailDemandeur, 
        budgetEstime, 
        description, 
        typeServiceId, 
        employeId || null, // Gérer le cas où employeId est undefined
        'En attente'
      ];
      
      console.log('📝 Requête SQL:', query);
      console.log('📝 Valeurs:', values);
      
      const result = await executeQuery(query, values);
      console.log('✅ Résultat insertion:', result);
      
      res.status(201).json({
        success: true,
        message: 'Devis créé avec succès',
        data: { id: result.insertId, numeroDevis }
      });
    } catch (error) {
      console.log('💥 ERREUR COMPLÈTE:', error);
      console.log('💥 Message d\'erreur:', error.message);
      console.log('💥 Stack trace:', error.stack);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          success: false, 
          message: 'Ce numéro de devis existe déjà' 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur: ' + error.message 
      });
    }
  }

  // Autres méthodes...
  static async getAll(req, res) {
    try {
      const query = `
        SELECT 
          d.*, 
          s.titre as serviceNom,
          u.nom as employeNom, 
          u.prenom as employePrenom
        FROM Devis d
        LEFT JOIN Service s ON d.typeServiceId = s.idService
        LEFT JOIN Utilisateur u ON d.employeId = u.idUtilisateur
        ORDER BY d.dateCreation DESC
      `;
      
      const results = await executeQuery(query);
      res.json({
        success: true,
        data: results
      });
      
    } catch (error) {
      console.log('💥 Erreur getAll:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT 
          d.*, 
          s.titre as serviceNom,
          u.nom as employeNom, 
          u.prenom as employePrenom
        FROM Devis d
        LEFT JOIN Service s ON d.typeServiceId = s.idService
        LEFT JOIN Utilisateur u ON d.employeId = u.idUtilisateur
        WHERE d.idDevis = ?
      `;
      
      const results = await executeQuery(query, [id]);
      
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Devis non trouvé' 
        });
      }
      
      res.json({
        success: true,
        data: results[0]
      });
      
    } catch (error) {
      console.log('💥 Erreur getById:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { statut } = req.body;

      if (!statut) {
        return res.status(400).json({ 
          success: false, 
          message: 'Le statut doit être spécifié' 
        });
      }

      const query = `
        UPDATE Devis SET statut = ? WHERE idDevis = ?
      `;
      const values = [statut, id];

      const result = await executeQuery(query, values);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Devis non trouvé' 
        });
      }
      
      res.json({
        success: true,
        message: 'Devis mis à jour avec succès'
      });
    } catch (error) {
      console.log('💥 Erreur update:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const query = `
        DELETE FROM Devis WHERE idDevis = ?
      `;
      
      const result = await executeQuery(query, [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Devis non trouvé' 
        });
      }
      
      res.json({
        success: true,
        message: 'Devis supprimé avec succès'
      });
    } catch (error) {
      console.log('💥 Erreur delete:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  // Récupérer les devis assignés à l'employé connecté
  static async getAssignedToEmployee(req, res) {
    try {
      const employeId = req.user.idUtilisateur || req.user.id;
      const query = `
        SELECT d.*, s.titre as serviceNom
        FROM Devis d
        LEFT JOIN Service s ON d.typeServiceId = s.idService
        WHERE d.employeId = ?
        ORDER BY d.dateCreation DESC
      `;
      const results = await executeQuery(query, [employeId]);
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

// Fonction pour générer un numéro de devis unique
async function generateNumeroDevis() {
  try {
    const prefix = 'DEV';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const query = `
      SELECT COUNT(*) as count
      FROM Devis
      WHERE numeroDevis LIKE ?
    `;
    
    const pattern = `${prefix}${year}${month}%`;
    console.log('🔍 Pattern recherché:', pattern);
    
    const result = await executeQuery(query, [pattern]);
    console.log('🔍 Résultat count:', result);
    
    const count = result[0].count + 1;
    const numeroDevis = `${prefix}${year}${month}${String(count).padStart(3, '0')}`;
    
    console.log('🎯 Numéro de devis final:', numeroDevis);
    return numeroDevis;
  } catch (error) {
    console.log('💥 Erreur generateNumeroDevis:', error);
    throw error;
  }
}

module.exports = DevisController;