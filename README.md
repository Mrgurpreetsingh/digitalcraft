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


