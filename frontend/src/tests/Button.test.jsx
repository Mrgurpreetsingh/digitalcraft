// ======================================
// 📝 TESTS SIMPLES POUR LE BOUTON
// ======================================
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';


describe('Button - Tests Simples', () => {


  // ============================
  // TEST 1 : Le bouton s'affiche
  // ============================
  test('Le bouton affiche son texte', () => {
    // On affiche le bouton avec le texte "Cliquez ici"
    render(<Button>Cliquez ici</Button>);


    // On vérifie que le texte est affiché
    const bouton = screen.getByText('Cliquez ici');
    expect(bouton).toBeDefined();
  });


  // ============================
  // TEST 2 : Le bouton est un vrai bouton HTML
  // ============================
  test('Le bouton est de type button', () => {
    render(<Button>Test</Button>);


    const bouton = screen.getByText('Test');


    // Vérifier que c'est un élément button
    expect(bouton.tagName).toBe('BUTTON');
  });


  // ============================
  // TEST 3 : Le bouton peut avoir différents textes
  // ============================
  test('Le bouton affiche différents textes', () => {
    // Test 1 : "Envoyer"
    const { unmount } = render(<Button>Envoyer</Button>);
    expect(screen.getByText('Envoyer')).toBeDefined();
    unmount();


    // Test 2 : "Valider"
    render(<Button>Valider</Button>);
    expect(screen.getByText('Valider')).toBeDefined();
  });


});




