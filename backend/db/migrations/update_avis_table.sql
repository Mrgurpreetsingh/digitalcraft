-- Script de modification de la table Avis existante pour la liaison Firebase
-- Ce script ajoute les champs nécessaires à la table Avis existante SANS perdre les données

-- 1. Ajouter les nouveaux champs pour la liaison Firebase (sans toucher aux données existantes)
ALTER TABLE Avis 
ADD COLUMN firebaseId VARCHAR(255) UNIQUE AFTER idAvis,
ADD COLUMN clientRole VARCHAR(100) AFTER nomClient,
ADD COLUMN clientId INT AFTER projetId,
ADD COLUMN dateModification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER dateCreation;

-- 2. Ajouter les contraintes de clés étrangères
ALTER TABLE Avis 
ADD CONSTRAINT fk_avis_client FOREIGN KEY (clientId) REFERENCES Utilisateur(idUtilisateur) ON DELETE SET NULL;

-- 3. Ajouter les index pour optimiser les requêtes
ALTER TABLE Avis 
ADD INDEX idx_firebase_id (firebaseId),
ADD INDEX idx_client (clientId),
ADD INDEX idx_date_modification (dateModification);

-- 4. Modifier l'énumération du statut pour correspondre à Firebase
-- Sauvegarder les données existantes
CREATE TEMPORARY TABLE temp_avis AS SELECT * FROM Avis;

-- Modifier l'énumération
ALTER TABLE Avis MODIFY COLUMN statut ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending';

-- Mettre à jour les statuts existants
UPDATE Avis SET statut = 'pending' WHERE statut = 'En attente';
UPDATE Avis SET statut = 'approved' WHERE statut = 'Validé';
UPDATE Avis SET statut = 'rejected' WHERE statut = 'Rejeté';

-- 5. Insérer des données de test avec liaison Firebase (optionnel)
-- Décommentez les lignes suivantes si vous voulez des données de test
/*
INSERT INTO Avis (numeroAvis, contenu, nomClient, clientRole, note, statut, projetId) VALUES
('AVIS202412001', 'Excellente collaboration avec l\'équipe DigitalCraft. Notre nouveau site web dépasse toutes nos attentes !', 'Marie Dubois', 'Directrice Marketing', 5, 'approved', 1),
('AVIS202412002', 'Service professionnel et résultats au rendez-vous. Je recommande vivement.', 'Thomas Martin', 'CEO', 4, 'approved', 2),
('AVIS202412003', 'Une équipe à l\'écoute qui a su comprendre nos besoins. Projet livré dans les délais.', 'Sophie Bernard', 'Fondatrice', 5, 'approved', 3),
('AVIS202412004', 'Compétences techniques solides et communication fluide tout au long du projet.', 'Pierre Moreau', 'Directeur Technique', 4, 'pending', 4),
('AVIS202412005', 'Créativité et professionnalisme. Notre identité visuelle est parfaite !', 'Julie Leroy', 'Responsable Communication', 5, 'approved', 5);
*/

-- 6. Afficher la structure finale de la table
DESCRIBE Avis;

-- 7. Afficher les données existantes
SELECT idAvis, numeroAvis, nomClient, note, statut, dateCreation FROM Avis LIMIT 5; 