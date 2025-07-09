// src/controllers/devisController.js
const mysql = require('mysql2');

// Configuration de la base de données (à adapter selon ta config)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'digitalcraft'
});

class DevisController {
  
  // Récupérer tous les devis
  static async getAll(req, res) {
    try {
      const query = `
        SELECT 
          d.*, 
          s.titre as serviceTitre,
          u.nom as employeNom, 
          u.prenom as employePrenom
        FROM Devis d
        LEFT JOIN Service s ON d.typeServiceId = s.idService
        LEFT JOIN Utilisateur u ON d.employeId = u.idUtilisateur
        ORDER BY d.dateCreation DESC
      `;
      
      db.query(query, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        res.json({
          success: true,
          data: results
        });
      });
      
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  // Récupérer un devis par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT 
          d.*, 
          s.titre as serviceTitre,
          u.nom as employeNom, 
          u.prenom as employePrenom
        FROM Devis d
        LEFT JOIN Service s ON d.typeServiceId = s.idService
        LEFT JOIN Utilisateur u ON d.employeId = u.idUtilisateur
        WHERE d.idDevis = ?
      `;
      
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
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
      });
      
    } catch (error) {
      console.log('Erreur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }
  }

  // Créer un nouveau devis
  static async create(req, res) {
    try {
      const { 
        numeroDevis, 
        nomDemandeur, 
        prenomDemandeur, 
        emailDemandeur, 
        telephoneDemandeur, 
        budgetEstime, 
        description, 
        typeServiceId,
        employeId
      } = req.body;
      
      // Vérifications basiques
      if (!numeroDevis || !nomDemandeur || !prenomDemandeur || !emailDemandeur || !budgetEstime || !description || !typeServiceId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tous les champs obligatoires doivent être remplis' 
        });
      }
      
      const query = `
        INSERT INTO Devis 
        (numeroDevis, nomDemandeur, prenomDemandeur, emailDemandeur, telephoneDemandeur, budgetEstime, description, typeServiceId, employeId, statut) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [numeroDevis, nomDemandeur, prenomDemandeur, emailDemandeur, telephoneDemandeur, budgetEstime, description, typeServiceId, employeId, 'En attente'];
      
      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
              success: false, 
              message: 'Ce numéro de devis existe déjà' 
            });
          }
          return res.status(500).json({ 
            success: false,