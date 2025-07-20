-- Script de création de la table Avis avec liaison Firebase
-- Ce script crée une table de liaison pour gérer les avis Firebase depuis MySQL

-- Supprimer la table si elle existe
DROP TABLE IF EXISTS Avis;

-- Créer la table Avis
CREATE TABLE Avis (
    idAvis INT PRIMARY KEY AUTO_INCREMENT,
    firebaseId VARCHAR(255) UNIQUE, -- ID Firebase pour liaison
    clientName VARCHAR(255) NOT NULL,
    clientRole VARCHAR(100),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    projetId INT,
    clientId INT,
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateModification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Contraintes de clés étrangères
    FOREIGN KEY (projetId) REFERENCES Projet(idProjet) ON DELETE SET NULL,
    FOREIGN KEY (clientId) REFERENCES Utilisateur(idUtilisateur) ON DELETE SET NULL,
    
    -- Index pour optimiser les requêtes
    INDEX idx_status (status),
    INDEX idx_projet (projetId),
    INDEX idx_client (clientId),
    INDEX idx_date_creation (dateCreation),
    INDEX idx_firebase_id (firebaseId)
);

-- Insérer des données de test
INSERT INTO Avis (clientName, clientRole, rating, message, status, projetId) VALUES
('Marie Dubois', 'Directrice Marketing', 5, 'Excellente collaboration avec l\'équipe DigitalCraft. Notre nouveau site web dépasse toutes nos attentes !', 'approved', 1),
('Thomas Martin', 'CEO', 4, 'Service professionnel et résultats au rendez-vous. Je recommande vivement.', 'approved', 2),
('Sophie Bernard', 'Fondatrice', 5, 'Une équipe à l\'écoute qui a su comprendre nos besoins. Projet livré dans les délais.', 'approved', 3),
('Pierre Moreau', 'Directeur Technique', 4, 'Compétences techniques solides et communication fluide tout au long du projet.', 'pending', 4),
('Julie Leroy', 'Responsable Communication', 5, 'Créativité et professionnalisme. Notre identité visuelle est parfaite !', 'approved', 5);

-- Afficher la structure de la table
DESCRIBE Avis;

-- Afficher les données insérées
SELECT * FROM Avis; 