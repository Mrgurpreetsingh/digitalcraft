#!/usr/bin/env node

/**
 * Script de vérification de sécurité pour DigitalCraft Backend
 * Usage: node security-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 VÉRIFICATION DE SÉCURITÉ - DIGITALCRAFT BACKEND\n');

// Vérifications de sécurité
const securityChecks = {
  // 1. Variables d'environnement
  environmentVariables: () => {
    console.log('📋 1. Variables d\'environnement:');
    const requiredVars = [
      'JWT_SECRET',
      'DB_HOST',
      'DB_USER',
      'DB_PASSWORD',
      'DB_NAME',
      'NODE_ENV'
    ];
    
    const missing = [];
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
    
    if (missing.length === 0) {
      console.log('   ✅ Toutes les variables d\'environnement requises sont définies');
    } else {
      console.log('   ❌ Variables manquantes:', missing.join(', '));
    }
    console.log('');
  },

  // 2. Dependencies de sécurité
  securityDependencies: () => {
    console.log('📦 2. Dependencies de sécurité:');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const securityPackages = [
      'helmet',
      'express-rate-limit',
      'bcrypt',
      'jsonwebtoken',
      'express-validator',
      'cors'
    ];
    
    const missing = [];
    securityPackages.forEach(pkg => {
      if (!packageJson.dependencies[pkg] && !packageJson.devDependencies[pkg]) {
        missing.push(pkg);
      }
    });
    
    if (missing.length === 0) {
      console.log('   ✅ Toutes les dépendances de sécurité sont installées');
    } else {
      console.log('   ❌ Dependencies manquantes:', missing.join(', '));
    }
    console.log('');
  },

  // 3. Configuration Helmet
  helmetConfig: () => {
    console.log('🛡️ 3. Configuration Helmet:');
    const appFile = fs.readFileSync('src/app.js', 'utf8');
    
    if (appFile.includes('helmet')) {
      console.log('   ✅ Helmet est configuré');
    } else {
      console.log('   ❌ Helmet n\'est pas configuré');
    }
    
    if (appFile.includes('contentSecurityPolicy')) {
      console.log('   ✅ CSP est configuré');
    } else {
      console.log('   ❌ CSP n\'est pas configuré');
    }
    console.log('');
  },

  // 4. Rate Limiting
  rateLimiting: () => {
    console.log('⏱️ 4. Rate Limiting:');
    const appFile = fs.readFileSync('src/app.js', 'utf8');
    
    if (appFile.includes('express-rate-limit')) {
      console.log('   ✅ Rate limiting est configuré');
    } else {
      console.log('   ❌ Rate limiting n\'est pas configuré');
    }
    console.log('');
  },

  // 5. Validation des inputs
  inputValidation: () => {
    console.log('✅ 5. Validation des inputs:');
    const appFile = fs.readFileSync('src/app.js', 'utf8');
    
    if (appFile.includes('express-validator')) {
      console.log('   ✅ Express-validator est utilisé');
    } else {
      console.log('   ❌ Express-validator n\'est pas utilisé');
    }
    console.log('');
  },

  // 6. Gestion des erreurs
  errorHandling: () => {
    console.log('🚨 6. Gestion des erreurs:');
    const appFile = fs.readFileSync('src/app.js', 'utf8');
    
    if (appFile.includes('errorHandler')) {
      console.log('   ✅ Middleware de gestion d\'erreurs est configuré');
    } else {
      console.log('   ❌ Middleware de gestion d\'erreurs manquant');
    }
    console.log('');
  }
};

// Exécuter toutes les vérifications
Object.values(securityChecks).forEach(check => check());

console.log('🎯 RECOMMANDATIONS:');
console.log('1. Assurez-vous que toutes les variables d\'environnement sont définies');
console.log('2. Utilisez HTTPS en production');
console.log('3. Configurez des logs de sécurité');
console.log('4. Effectuez des audits de sécurité réguliers');
console.log('5. Mettez à jour régulièrement les dépendances');
console.log('6. Utilisez des secrets managers en production');
console.log('7. Configurez un WAF (Web Application Firewall)');
console.log('8. Implémentez une politique de mots de passe forts');
console.log('9. Activez l\'authentification à deux facteurs');
console.log('10. Effectuez des tests de pénétration réguliers');

console.log('\n✅ Vérification terminée !'); 