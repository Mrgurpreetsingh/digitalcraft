# DigitalCraft - Plateforme de Services Numériques

## 🚀 Vue d'ensemble

DigitalCraft est une plateforme complète de services numériques développée avec une architecture moderne :
- **Frontend** : React.js avec Vite (déployé sur Netlify)
- **Backend** : Node.js/Express avec API REST
- **Base de données** : MySQL 8.0
- **Authentification** : JWT + Firebase Admin SDK
- **Containerisation** : Docker pour le backend et la base de données

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Base de       │
│   (Netlify)     │◄──►│   (Docker)      │◄──►│   Données       │
│   React/Vite    │    │   Node/Express  │    │   MySQL         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prérequis

- Docker et Docker Compose
- Node.js 18+ (pour le développement local)
- Git

## 🐳 Démarrage Rapide avec Docker

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd digitalcraft
```

### 2. Lancer la stack complète
```bash
cd backend
docker-compose up -d
```

### 3. Vérifier les services
```bash
docker ps
```

Les services suivants seront disponibles :
- **Backend API** : http://localhost:5000
- **MySQL** : localhost:3306
- **phpMyAdmin** : http://localhost:8081
- **Apache** : http://localhost:8080

### 4. Initialiser la base de données
```bash
# Accéder au conteneur MySQL
docker exec -it digitalcraft_mysql mysql -u root -p

# Ou utiliser phpMyAdmin via http://localhost:8081
```

## 🛠️ Développement Local

### Backend (avec Docker)
```bash
cd backend
docker-compose up -d
```

### Frontend (développement local)
```bash
cd frontend
npm install
npm run dev
```

Le frontend sera disponible sur http://localhost:5173

## 🌐 Déploiement Production

### Frontend - Netlify

1. **Build du projet**
```bash
cd frontend
npm run build
```

2. **Déploiement sur Netlify**
- Connectez votre repository GitHub à Netlify
- Configurez les paramètres de build :
  - **Build command** : `npm run build`
  - **Publish directory** : `dist`
  - **Node version** : `18`

3. **Variables d'environnement Netlify**
```
VITE_API_URL=https://votre-backend.com
```

### Backend - Serveur avec Docker

1. **Build de l'image**
```bash
cd backend
docker build -t digitalcraft-backend .
```

2. **Déploiement**
```bash
# Production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Structure du Projet

```
digitalcraft/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   └── styles/         # Fichiers CSS
│   ├── public/             # Assets statiques
│   └── package.json
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/    # Contrôleurs API
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middleware Express
│   │   └── config/         # Configuration
│   ├── docker-compose.yml  # Configuration Docker
│   ├── Dockerfile          # Image Docker backend
│   └── package.json
└── docs/                   # Documentation
```

## 🔧 Configuration

### Variables d'environnement Backend

Créez un fichier `.env` dans le dossier `backend/` :

```env
NODE_ENV=development
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=digitalcraft
JWT_SECRET=votre-secret-jwt
FIREBASE_PROJECT_ID=votre-projet-firebase
```

### Configuration Frontend

Le frontend utilise Vite avec un proxy vers le backend :

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

## 🚀 Commandes Utiles

### Docker
```bash
# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter les services
docker-compose down

# Rebuild l'image backend
docker-compose build backend

# Nettoyer les volumes
docker-compose down -v
```

### Développement
```bash
# Backend (si pas en Docker)
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📊 Fonctionnalités

### Dashboard Administrateur
- Gestion des utilisateurs
- Gestion des projets
- Gestion des services
- Gestion des devis
- Gestion des avis clients
- Statistiques en temps réel

### Dashboard Employé
- Projets assignés
- Devis à traiter
- Mise à jour des statuts

### Interface Client
- Demande de devis
- Consultation du portfolio
- Témoignages clients

## 🔒 Sécurité

- Authentification JWT
- Middleware de validation
- Protection CORS
- Rate limiting
- Validation des données
- Gestion des rôles (Admin/Employé/Client)

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 API Documentation

L'API est documentée avec les endpoints suivants :

- `GET /api/health` - Health check
- `POST /api/auth/login` - Connexion
- `GET /api/projets` - Liste des projets
- `POST /api/devis` - Créer un devis
- `GET /api/avis` - Liste des avis

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 👥 Auteurs

- **Votre Nom** - *Développement initial* - [VotreGitHub](https://github.com/votre-username)

## 🙏 Remerciements

- React.js et la communauté React
- Node.js et Express.js
- MySQL et la communauté open source
- Netlify pour l'hébergement frontend

---

## Description
Ce projet est une application web développée avec React pour créer un site professionnel. Il inclut des pages comme la page d'accueil (US1) et la page Services (US2), avec une approche modulaire utilisant des composants React et styled-components pour les styles.

## Structure du Projet
- `src/`
 - `components/`: Contient les composants réutilisables (ex. : `Button`, `ServiceCard`).
 - `pages/`: Contient les pages principales (ex. : `Home.jsx`, `Services.jsx`).
 - `styles/`: Contient les fichiers CSS globaux (ex. : `global.css`) et spécifiques aux pages.
 - `App.jsx`: Point d'entrée des routes avec React Router.
 - `main.jsx`: Point d'entrée de l'application React.
- `public/`: Contient les assets statiques (ex. : images).

## Fonctionnalités
- **Page d'accueil (US1)**: Inclut une section hero avec image, des services, et des témoignages, avec CSS natif.
- **Page Services (US2)**: Présente des expertises digitales avec des cartes de services, un bouton CTA, et une structure optimisée avec composants.
- **Stylisation**: Utilisation de styled-components pour les composants et un fichier global.css pour les variables (couleurs, polices).

## Installation
1. Clone le dépôt :
     ```bash
     git clone https://github.com/Mrgurpreetsingh/digitalcraft.git
        ```
2. Installe les dépendances :
        ```bash
        npm install
        ```
3. Lance l'application :
        ```bash
        npm run dev
        ```

## Historique des commits
- Début avec `feat(1)` pour la structure initiale.
- Progression jusqu'à `feat(27)` pour la réorganisation de `Services.jsx` avec `Button` et `ServiceCard`.
- Corrections avec `fix(20)` pour les chemins d'import.
- `feat(58)`: Ajout configuration Docker et déploiement Netlify

## Prochaines étapes
- Séparer `frontend` et `backend` dans des dossiers distincts.
- Ajouter d'autres pages (ex. : Portfolio, Contact).
- Intégrer une API backend (peu d'éléments statiques prévus).

## Configuration MySQL et variables d'environnement backend

Par défaut, la base de données MySQL dans Docker utilise un utilisateur applicatif dédié :

- **DB_USER=app_user**
- **DB_PASSWORD=app_password**
- **DB_NAME=digitalcraft**
- **DB_HOST=mysql** (nom du service Docker Compose)
- **DB_PORT=3306**

Assurez-vous que ces valeurs sont bien utilisées dans votre fichier `.env` du backend et dans les variables d'environnement du service backend dans `docker-compose.yml` et `docker-compose.prod.yml`.

> ⚠️ **Ne pas utiliser root/root pour l'application** :
> - L'utilisateur `root` est réservé à l'administration.
> - L'utilisateur `app_user` est créé automatiquement par Docker Compose pour l'application.
> - Pour phpMyAdmin, connectez-vous avec `app_user`/`app_password` pour voir les données de l'application.

**Exemple de configuration dans `.env` :**
```env
DB_HOST=mysql
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=digitalcraft
DB_PORT=3306
```

Pour un usage local sans Docker, adaptez `DB_HOST=localhost` et le port si besoin.

---


