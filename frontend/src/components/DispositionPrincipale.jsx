import React from 'react';
import styled from 'styled-components';

const Conteneur = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: #f3f4f6; /* Fond clair pour débogage */
`;

const CoteGauche = styled.div`
  flex: 1;
  background-color: var(--primary-color, #1e3a8a); /* Fond bleu par défaut */
  color: var(--white, #ffffff); /* Texte blanc */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh; /* Hauteur minimale */
  border: 2px solid #ff0000; /* Bordure rouge pour débogage */
`;

const CoteDroit = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--gray-light, #e5e7eb); /* Fond gris par défaut */
  min-height: 100vh; /* Hauteur minimale */
`;

const ConteneurFormulaire = styled.div`
  background-color: var(--white, #ffffff);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  min-height: 0; /* Permet au contenu de définir la hauteur */
`;

function DispositionPrincipale({ children, contenuGauche }) {
  return (
    <Conteneur>
      <CoteGauche>{contenuGauche}</CoteGauche>
      <CoteDroit>
        <ConteneurFormulaire>{children}</ConteneurFormulaire>
      </CoteDroit>
    </Conteneur>
  );
}

export default DispositionPrincipale;