# Guide de Déploiement DigitalCraft

## 🌐 Déploiement Frontend - Netlify

### Prérequis
- Compte Netlify
- Repository GitHub connecté
- Variables d'environnement configurées

### Étapes de déploiement

#### 1. Configuration Netlify

1. **Connecter le repository**
   - Allez sur [netlify.com](https://netlify.com)
   - Cliquez sur "New site from Git"
   - Sélectionnez votre repository GitHub
   - Choisissez la branche `main` ou `master`

2. **Configuration du build**
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Base directory** : `frontend` (si votre repo contient frontend/ et backend/)

#### 2. Variables d'environnement

Dans l'interface Netlify, allez dans **Site settings > Environment variables** :

```env
# Production
VITE_API_URL=https://votre-backend-production.com

# Preview (optionnel)
VITE_API_URL=https://votre-backend-staging.com
```

#### 3. Configuration avancée

Le fichier `netlify.toml` dans le dossier `frontend/` configure automatiquement :
- Redirections pour React Router
- Headers de sécurité
- Cache pour les assets
- Variables d'environnement par contexte

#### 4. Déploiement automatique

- Chaque push sur la branche principale déclenche un déploiement
- Les Pull Requests créent des previews automatiques
- Les déploiements sont automatiques après validation

### Vérification du déploiement

1. **Test de l'application**
   - Vérifiez que toutes les pages se chargent
   - Testez la navigation
   - Vérifiez les appels API

2. **Test des fonctionnalités**
   - Connexion/inscription
   - Dashboard admin/employé
   - Formulaires de contact/devis

## 🐳 Déploiement Backend - Docker

### Développement local

```bash
cd backend
docker-compose up -d
```

### Production

#### 1. Préparation

1. **Variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditez .env avec vos vraies valeurs
   ```

2. **Configuration de sécurité**
   - Changez les mots de passe par défaut
   - Configurez un JWT_SECRET sécurisé
   - Configurez Firebase Admin SDK

#### 2. Déploiement avec Docker

```bash
# Build et démarrage
docker-compose -f docker-compose.prod.yml up -d --build

# Vérification
docker ps
docker-compose logs -f backend
```

#### 3. Déploiement sur serveur

1. **Serveur VPS/Cloud**
   ```bash
   # Cloner le projet
   git clone <votre-repo>
   cd digitalcraft/backend
   
   # Configuration
   cp .env.example .env
   # Éditer .env
   
   # Déploiement
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Configuration Nginx (optionnel)**
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Configuration de la base de données

### Initialisation

1. **Accès à MySQL**
   ```bash
   # Via Docker
   docker exec -it digitalcraft_mysql mysql -u root -p
   
   # Via phpMyAdmin
   # http://localhost:8081 (développement)
   ```

2. **Import des données**
   ```sql
   -- Créer la base de données
   CREATE DATABASE IF NOT EXISTS digitalcraft;
   USE digitalcraft;
   
   -- Importer le schéma
   SOURCE /path/to/your/schema.sql;
   
   -- Importer les données de test
   SOURCE /path/to/your/test-data.sql;
   ```

### Migration de données

```bash
# Backup
docker exec digitalcraft_mysql mysqldump -u root -p digitalcraft > backup.sql

# Restore
docker exec -i digitalcraft_mysql mysql -u root -p digitalcraft < backup.sql
```

## 🔒 Sécurité

### Variables d'environnement sensibles

- **JWT_SECRET** : Utilisez un secret fort (32+ caractères)
- **DB_PASSWORD** : Mot de passe complexe pour MySQL
- **Firebase** : Clés privées sécurisées

### Headers de sécurité

Le backend inclut automatiquement :
- Helmet.js pour les headers de sécurité
- CORS configuré
- Rate limiting
- Validation des données

### SSL/HTTPS

- **Netlify** : SSL automatique
- **Backend** : Configurez un reverse proxy (Nginx) avec Let's Encrypt

## 📊 Monitoring

### Logs

```bash
# Logs en temps réel
docker-compose logs -f backend

# Logs spécifiques
docker-compose logs backend | grep ERROR
```

### Health Check

```bash
# Test de santé de l'API
curl http://localhost:5000/api/health
```

### Métriques

- **Uptime** : Surveillez l'endpoint `/api/health`
- **Performance** : Logs de requêtes avec Morgan
- **Erreurs** : Logs d'erreurs dans les conteneurs

## 🚀 Scripts de déploiement

### Script automatique

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Déploiement développement
./deploy.sh dev

# Déploiement production
./deploy.sh prod
```

### Commandes utiles

```bash
# Redémarrage des services
docker-compose restart

# Mise à jour du code
git pull
docker-compose build backend
docker-compose up -d

# Nettoyage
docker-compose down -v
docker system prune -f
```

## 🔄 CI/CD

### GitHub Actions (optionnel)

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          # Script de déploiement sur votre serveur
```

## 📝 Checklist de déploiement

### Frontend (Netlify)
- [ ] Repository connecté
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] Tests fonctionnels passés
- [ ] Domain personnalisé configuré (optionnel)

### Backend (Docker)
- [ ] Variables d'environnement configurées
- [ ] Base de données initialisée
- [ ] Conteneurs démarrés
- [ ] API accessible
- [ ] Logs sans erreur
- [ ] SSL configuré (production)

### Général
- [ ] Documentation mise à jour
- [ ] Sauvegarde de la base de données
- [ ] Tests de régression
- [ ] Monitoring configuré 