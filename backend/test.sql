CREATE TABLE Utilisateur (
    idUtilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nomComplet VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL,
    role ENUM('Visiteur', 'Employé', 'Administrateur') NOT NULL DEFAULT 'Visiteur',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Service (
    idService INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tarifBase DECIMAL(10,2) NOT NULL,
    exemples TEXT,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Projet (
    idProjet INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    images TEXT,
    typeServiceId INT NOT NULL,
    testimonyId INT NULL,
    employeId INT NULL,
    statut ENUM('En cours', 'Terminé', 'Annulé') NOT NULL DEFAULT 'En cours',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService),
    FOREIGN KEY (testimonyId) REFERENCES Avis(idAvis),
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

CREATE TABLE Devis (
    idDevis INT PRIMARY KEY AUTO_INCREMENT,
    utilisateurId INT NOT NULL,
    typeServiceId INT NOT NULL,
    budgetEstime VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    statut ENUM('En attente', 'Validé', 'Rejeté', 'En traitement') NOT NULL DEFAULT 'En attente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reponseEmail TEXT,
    employeId INT NULL,
    FOREIGN KEY (utilisateurId) REFERENCES Utilisateur(idUtilisateur),
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService),
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

CREATE TABLE Avis (
    idAvis INT PRIMARY KEY AUTO_INCREMENT,
    contenu TEXT NOT NULL,
    utilisateurId INT NOT NULL,
    projetId INT NULL,
    statut ENUM('En attente', 'Validé', 'Rejeté') NOT NULL DEFAULT 'En attente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateurId) REFERENCES Utilisateur(idUtilisateur),
    FOREIGN KEY (projetId) REFERENCES Projet(idProjet)
);

CREATE TABLE Contact (
    idContact INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reponseEmail TEXT,
    employeId INT NULL,
    FOREIGN KEY (employeId) REFERENCES Utilisateur(idUtilisateur)
);

CREATE TABLE Statistique (
    idStatistique INT PRIMARY KEY AUTO_INCREMENT,
    typeServiceId INT NOT NULL,
    nbProjets INT NOT NULL,
    tauxConversion DECIMAL(5,2) NOT NULL,
    nbDemandes INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (typeServiceId) REFERENCES Service(idService)
);