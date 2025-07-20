#!/bin/bash

# Script de déploiement DigitalCraft
# Usage: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}

echo "🚀 Déploiement DigitalCraft - Environnement: $ENVIRONMENT"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Arrêter les conteneurs existants
print_status "Arrêt des conteneurs existants..."
cd backend
docker-compose down

if [ "$ENVIRONMENT" = "prod" ]; then
    print_status "Déploiement en PRODUCTION..."
    
    # Vérifier les variables d'environnement
    if [ ! -f .env ]; then
        print_error "Fichier .env manquant pour la production"
        exit 1
    fi
    
    # Build et démarrage en production
    docker-compose -f docker-compose.prod.yml up -d --build
    
    print_status "Services de production démarrés:"
    echo "  - Backend API: http://localhost:5000"
    echo "  - MySQL: localhost:3306"
    echo "  - Nginx: http://localhost:80"
    
else
    print_status "Déploiement en DÉVELOPPEMENT..."
    
    # Build et démarrage en développement
    docker-compose up -d --build
    
    print_status "Services de développement démarrés:"
    echo "  - Backend API: http://localhost:5000"
    echo "  - MySQL: localhost:3306"
    echo "  - phpMyAdmin: http://localhost:8081"
    echo "  - Apache: http://localhost:8080"
fi

# Vérifier que les conteneurs sont démarrés
print_status "Vérification des conteneurs..."
sleep 5
docker ps

# Test de santé de l'API
print_status "Test de santé de l'API..."
sleep 10
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "✅ API backend opérationnelle"
else
    print_warning "⚠️  API backend non accessible, vérifiez les logs:"
    docker-compose logs backend
fi

print_status "🎉 Déploiement terminé avec succès!"
print_status "Pour voir les logs: docker-compose logs -f"
print_status "Pour arrêter: docker-compose down" 