-- Script SQL optimisé pour import Looping
-- Projet : DIGITALCRAFT - Agence Web

CREATE DATABASE IF NOT EXISTS digitalcraft;
USE digitalcraft;

-- Table Utilisateur
CREATE TABLE Utilisateur (
    idUtilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL,
    role ENUM('Visiteur', 'Employe', 'Administrateur') NOT NULL DEFAULT 'Visiteur',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table Service
CREATE TABLE Service (
    idService INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    tarifBase DECIMAL(10,2) NOT NULL,
    exemples TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table Projet
CREATE TABLE Projet (
    idProjet INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    images TEXT,
    typeServiceId INT NOT NULL,
    clientId INT,
    employeId INT,
    statut ENUM('En_cours', 'Termine', 'Annule') NOT NULL DEFAULT 'En_cours',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService),
    FOREIGN KEY (clientId) REFERENCES Utilisateur(idUtilisateur),
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

-- Table Devis
CREATE TABLE Devis (
    idDevis INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    typeServiceId INT NOT NULL,
    budgetEstime VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    statut ENUM('En_attente', 'Valide', 'Rejete', 'En_traitement') NOT NULL DEFAULT 'En_attente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reponseEmail TEXT,
    employeId INT,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService),
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

-- Table Avis
CREATE TABLE Avis (
    idAvis INT PRIMARY KEY AUTO_INCREMENT,
    contenu TEXT NOT NULL,
    nomClient VARCHAR(100) NOT NULL,
    entrepriseClient VARCHAR(255),
    projetId INT,
    statut ENUM('En_attente', 'Valide', 'Rejete') NOT NULL DEFAULT 'En_attente',
    note INT CHECK (note >= 1 AND note <= 5),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projetId) REFERENCES Projet(idProjet)
);

-- Table Contact
CREATE TABLE Contact (
    idContact INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut ENUM('En_attente', 'Traite', 'Ferme') NOT NULL DEFAULT 'En_attente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reponseEmail TEXT,
    employeId INT,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

-- Table Statistique
CREATE TABLE Statistique (
    idStatistique INT PRIMARY KEY AUTO_INCREMENT,
    typeServiceId INT NOT NULL,
    nbProjets INT NOT NULL DEFAULT 0,
    tauxConversion DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    nbDemandes INT NOT NULL DEFAULT 0,
    nbDevisValides INT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService)
);

-- Table ReseauSocial
CREATE TABLE ReseauSocial (
    idReseauSocial INT PRIMARY KEY AUTO_INCREMENT,
    plateforme ENUM('Facebook', 'Instagram', 'LinkedIn', 'Twitter') NOT NULL,
    contenu TEXT NOT NULL,
    projetId INT,
    employeId INT NOT NULL,
    statut ENUM('Brouillon', 'Publie', 'Programme') NOT NULL DEFAULT 'Brouillon',
    datePublication TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projetId) REFERENCES Projet(idProjet),
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

-- Index pour optimisation
CREATE INDEX idx_utilisateur_email ON Utilisateur(email);
CREATE INDEX idx_projet_service ON Projet(typeServiceId);
CREATE INDEX idx_projet_statut ON Projet(statut);
CREATE INDEX idx_devis_service ON Devis(typeServiceId);
CREATE INDEX idx_devis_statut ON Devis(statut);