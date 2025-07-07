import React from 'react';
import styled from 'styled-components';

const StyledLien = styled.a`
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #535bf2;
  }
`;

function Lien({ href, enfants, classeNom = '' }) {
  return <StyledLien href={href} className={classeNom}>{enfants}</StyledLien>;
}

export default Lien;