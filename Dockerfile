# Utiliser une image Node.js compatible avec v18.20.8
FROM node:18-alpine

# Mise à jour rapide des packages système (optionnel)
RUN apk update && apk upgrade --no-cache

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et installer dépendances
COPY package.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port Vite (pas 80 pour éviter conflit avec MAMP/Nginx)
EXPOSE 5173

# Variable d'environnement pour que Vite écoute sur toutes les interfaces
ENV HOST=0.0.0.0

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]