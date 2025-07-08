CREATE TABLE Utilisateur (
    idUtilisateur INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    role ENUM('Visiteur', 'Employé', 'Administrateur') NOT NULL DEFAULT 'Visiteur',
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Service (
    idService INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    tarifBase DECIMAL(10,2) NOT NULL,
    exemples TEXT NULL,
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Projet (
    idProjet INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    images TEXT NULL,
    statut ENUM('En cours', 'Terminé', 'Annulé') NOT NULL DEFAULT 'En cours',
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    typeServiceId INT NOT NULL,
    clientId INT NULL,
    employeId INT NULL,
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService),
    FOREIGN KEY (clientId) REFERENCES Utilisateur(idUtilisateur),
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

CREATE TABLE Devis (
    idDevis INT PRIMARY KEY AUTO_INCREMENT,
    numeroDevis VARCHAR(50) NOT NULL UNIQUE,
    nomDemandeur VARCHAR(100) NOT NULL,
    prenomDemandeur VARCHAR(100) NOT NULL,
    emailDemandeur VARCHAR(255) NOT NULL,
    telephoneDemandeur VARCHAR(20) NULL,
    budgetEstime VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    statut ENUM('En attente', 'Validé', 'Rejeté', 'En traitement') NOT NULL DEFAULT 'En attente',
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reponseEmail TEXT NULL,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    employeId INT NULL,
    typeServiceId INT NOT NULL,
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur),
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService)
);

CREATE TABLE Avis (
    idAvis INT PRIMARY KEY AUTO_INCREMENT,
    numeroAvis VARCHAR(50) NOT NULL UNIQUE,
    contenu TEXT NOT NULL,
    nomClient VARCHAR(100) NOT NULL,
    note INT NULL CHECK (note BETWEEN 1 AND 5),
    statut ENUM('En attente', 'Validé', 'Rejeté') NOT NULL DEFAULT 'En attente',
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    projetId INT NULL,
    FOREIGN KEY (projetId) REFERENCES Projet(idProjet)
);

CREATE TABLE Contact (
    idContact INT PRIMARY KEY AUTO_INCREMENT,
    numeroContact VARCHAR(50) NOT NULL UNIQUE,
    nomVisiteur VARCHAR(100) NOT NULL,
    prenomVisiteur VARCHAR(100) NOT NULL,
    emailVisiteur VARCHAR(255) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut ENUM('En attente', 'Traité', 'Fermé') NOT NULL DEFAULT 'En attente',
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reponseEmail TEXT NULL,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    employeId INT NULL,
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

CREATE TABLE Statistique (
    idStatistique INT PRIMARY KEY AUTO_INCREMENT,
    numeroStat VARCHAR(50) NOT NULL UNIQUE,
    nbProjets INT NOT NULL DEFAULT 0,
    tauxConversion DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    nbDemandes INT NOT NULL DEFAULT 0,
    nbDevisValides INT NOT NULL DEFAULT 0,
    dateCalcul TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    typeServiceId INT NOT NULL,
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService)
);

CREATE TABLE ReseauSocial (
    idReseauSocial INT PRIMARY KEY AUTO_INCREMENT,
    numeroPost VARCHAR(50) NOT NULL UNIQUE,
    plateforme ENUM('Facebook', 'Instagram', 'LinkedIn', 'Twitter') NOT NULL,
    contenu TEXT NOT NULL,
    statut ENUM('Brouillon', 'Publié', 'Programmé') NOT NULL DEFAULT 'Brouillon',
    datePublication TIMESTAMP NULL,
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateMaj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    employeId INT NOT NULL,
    projetId INT NULL,
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur),
    FOREIGN KEY (projetId) REFERENCES Projet(idProjet)
);