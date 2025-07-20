# DigitalCraft Project

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


