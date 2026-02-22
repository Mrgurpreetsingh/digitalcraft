// ======================================
// 📝 TESTS SIMPLES POUR ServiceCard
// ======================================
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceCard from '../components/ServiceCard';

describe('ServiceCard - Tests Simples', () => {

  // ============================
  // TEST 1 : Affichage du titre
  // ============================
  test('Affiche le titre du service', () => {
    const service = {
      titre: 'Création de sites web',
      description: 'Des sites modernes',
      tarifBase: 2500
    };

    render(<ServiceCard service={service} />);

    const titre = screen.getByText('Création de sites web');
    expect(titre).toBeDefined();
  });

  // ============================
  // TEST 2 : Affichage de la description
  // ============================
  test('Affiche la description du service', () => {
    const service = {
      titre: 'Applications mobiles',
      description: 'Apps iOS et Android',
      tarifBase: 5000
    };

    render(<ServiceCard service={service} />);

    const description = screen.getByText('Apps iOS et Android');
    expect(description).toBeDefined();
  });

  // ============================
  // TEST 3 : Affichage du tarif
  // ============================
  test('Affiche le tarif du service', () => {
    const service = {
      titre: 'Marketing digital',
      description: 'SEO et SEA',
      tarifBase: 1500
    };

    render(<ServiceCard service={service} />);

    // Vérifie que le tarif est présent
    const tarif = screen.getByText(/1500/);
    expect(tarif).toBeDefined();
  });
});
