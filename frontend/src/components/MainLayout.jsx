import React from 'react';
import styled from 'styled-components';

const Conteneur = styled.div`
  min-height: 100vh;
  display: flex;
`;

const CoteGauche = styled.div`
  flex: 1;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CoteDroit = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--gray-light);
`;

const ConteneurFormulaire = styled.div`
  background-color: var(--white);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
`;

function DispositionPrincipale({ enfants, contenuGauche }) {
  return (
    <Conteneur>
      <CoteGauche>{contenuGauche}</CoteGauche>
      <CoteDroit>
        <ConteneurFormulaire>{enfants}</ConteneurFormulaire>
      </CoteDroit>
    </Conteneur>
  );
}

export default DispositionPrincipale;