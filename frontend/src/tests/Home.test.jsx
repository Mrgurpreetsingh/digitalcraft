// ======================================
// 📝 TESTS SIMPLES POUR PAGE HOME
// ======================================
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

// Helper pour rendre avec Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Page Home - Tests Simples', () => {

  // ============================
  // TEST 1 : La page se charge
  // ============================
  test('La page Home se charge sans erreur', () => {
    const { container } = renderWithRouter(<Home />);
    expect(container).toBeDefined();
  });

  // ============================
  // TEST 2 : Titre principal présent
  // ============================
  test('Affiche le titre principal DigitalCraft', () => {
    renderWithRouter(<Home />);

    // Recherche le mot "DigitalCraft" (peut être dans plusieurs éléments)
    const titre = screen.getByText(/DigitalCraft/i);
    expect(titre).toBeDefined();
  });

  // ============================
  // TEST 3 : Section Services présente
  // ============================
  test('Affiche la section Services', () => {
    renderWithRouter(<Home />);

    // Recherche le mot "Services" ou "service" (insensible à la casse)
    const sectionServices = screen.getByText(/service/i);
    expect(sectionServices).toBeDefined();
  });

  // ============================
  // TEST 4 : Bouton ou lien Devis présent
  // ============================
  test('Affiche un bouton ou lien pour demander un devis', () => {
    renderWithRouter(<Home />);

    // Recherche le mot "Devis" (peut être un bouton ou lien)
    const devisElement = screen.getByText(/devis/i);
    expect(devisElement).toBeDefined();
  });

  // ============================
  // TEST 5 : Page contient du contenu
  // ============================
  test('La page contient du texte', () => {
    const { container } = renderWithRouter(<Home />);

    // Vérifie que le contenu n'est pas vide
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});
