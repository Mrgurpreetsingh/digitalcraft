// Configuration Vitest pour les tests frontend
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  test: {
    // Utilise jsdom pour simuler un navigateur
    environment: 'jsdom',


    // Fichiers à tester
    include: ['src/tests/**/*.test.{js,jsx}'],


    // Configuration coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/**/*.test.{js,jsx}']
    }
  }
});






