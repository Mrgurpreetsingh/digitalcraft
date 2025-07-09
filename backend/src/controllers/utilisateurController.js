// src/controllers/utilisateurController.js
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Configuration de la base de données (à adapter selon ta config)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'digitalcraft'
});

class UtilisateurController {
  
  // Récupérer tous les utilisateurs
  static async getAll(req, res) {
    try {
      const query = 'SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur';
      
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

  // Récupérer un utilisateur par ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const query = 'SELECT idUtilisateur, email, nom, prenom, role, dateCreation FROM Utilisateur WHERE idUtilisateur = ?';
      
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
            message: 'Utilisateur non trouvé' 
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

  // Créer un nouvel utilisateur
  static async create(req, res) {
    try {
      const { email, nom, prenom, motDePasse, role } = req.body;
      
      // Vérifications basiques
      if (!email || !nom || !prenom || !motDePasse) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tous les champs sont obligatoires' 
        });
      }
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(motDePasse, 10);
      
      const query = 'INSERT INTO Utilisateur (email, nom, prenom, motDePasse, role) VALUES (?, ?, ?, ?, ?)';
      const values = [email, nom, prenom, hashedPassword, role || 'Visiteur'];
      
      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
              success: false, 
              message: 'Cet email existe déjà' 
            });
          }
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        res.status(201).json({
          success: true,
          message: 'Utilisateur créé avec succès',
          data: { id: results.insertId }
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

  // Connexion utilisateur
  static async login(req, res) {
    try {
      const { email, motDePasse } = req.body;
      
      if (!email || !motDePasse) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email et mot de passe requis' 
        });
      }
      
      const query = 'SELECT * FROM Utilisateur WHERE email = ?';
      
      db.query(query, [email], async (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        if (results.length === 0) {
          return res.status(401).json({ 
            success: false, 
            message: 'Email ou mot de passe incorrect' 
          });
        }
        
        const user = results[0];
        
        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        
        if (!isPasswordValid) {
          return res.status(401).json({ 
            success: false, 
            message: 'Email ou mot de passe incorrect' 
          });
        }
        
        // Créer le token JWT
        const token = jwt.sign(
          { 
            id: user.idUtilisateur, 
            email: user.email, 
            role: user.role 
          },
          process.env.JWT_SECRET || 'secret-key',
          { expiresIn: '24h' }
        );
        
        res.json({
          success: true,
          message: 'Connexion réussie',
          data: {
            token,
            user: {
              id: user.idUtilisateur,
              email: user.email,
              nom: user.nom,
              prenom: user.prenom,
              role: user.role
            }
          }
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

  // Modifier un utilisateur
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { email, nom, prenom, role } = req.body;
      
      const query = 'UPDATE Utilisateur SET email = ?, nom = ?, prenom = ?, role = ? WHERE idUtilisateur = ?';
      const values = [email, nom, prenom, role, id];
      
      db.query(query, values, (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        if (results.affectedRows === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Utilisateur non trouvé' 
          });
        }
        
        res.json({
          success: true,
          message: 'Utilisateur modifié avec succès'
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

  // Supprimer un utilisateur
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'DELETE FROM Utilisateur WHERE idUtilisateur = ?';
      
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log('Erreur SQL:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
          });
        }
        
        if (results.affectedRows === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Utilisateur non trouvé' 
          });
        }
        
        res.json({
          success: true,
          message: 'Utilisateur supprimé avec succès'
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
}

module.exports = UtilisateurController;