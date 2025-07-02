import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  border-radius: 8px; /* Changement de 4px à 8px */
  cursor: pointer;

  &:hover {
    background-color: #059669; /* Garde l'effet hover, ajuste si besoin */
  }
`;

function Button({ children, onClick }) {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
}

export default Button;