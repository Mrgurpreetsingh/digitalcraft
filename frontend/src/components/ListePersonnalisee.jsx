import React from 'react';
import styled from 'styled-components';

const ConteneurListe = styled.div`
  margin-bottom: 1rem;

  & > div:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

const ElementListe = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const Indicateur = styled.div`
  background-color: var(--secondary-color);
  border-radius: 9999px;
  padding: 0.25rem;
  margin-top: 0.25rem;
`;

const Point = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--white);
  border-radius: 9999px;
`;

const NumeroEtape = styled.div`
  background-color: var(--secondary-color);
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-weight: bold;
  font-size: 0.875rem;
`;

const Titre = styled.h4`
  font-weight: 500;
  color: var(--white);
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: var(--blue-100);
  margin-top: 0.25rem;
`;

const TexteEtape = styled.span`
  color: var(--blue-100);
`;

function ListePersonnalisee({ elements, type = "avantages" }) {
  return (
    <ConteneurListe>
      {elements.map((item, index) => (
        <ElementListe key={index}>
          {type === "avantages" ? (
            <>
              <Indicateur>
                <Point />
              </Indicateur>
              <div>
                <Titre>{item.titre || item}</Titre>
                {item.description && <Description>{item.description}</Description>}
              </div>
            </>
          ) : (
            <>
              <NumeroEtape>{index + 1}</NumeroEtape>
              <TexteEtape>{item}</TexteEtape>
            </>
          )}
        </ElementListe>
      ))}
    </ConteneurListe>
  );
}

export default ListePersonnalisee;