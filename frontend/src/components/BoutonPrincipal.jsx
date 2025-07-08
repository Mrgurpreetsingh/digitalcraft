import React from 'react';
import styled from 'styled-components';

const StyledBouton = styled.button`
  width: 100%;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.disabled ? 'var(--primary-color)' : '#1e3a8a'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  transition: background-color 200ms;
`;

function BoutonPrincipal({ enfants, onClick, desactive, icone: Icon, ...props }) {
  return (
    <StyledBouton onClick={onClick} disabled={desactive} {...props}>
      {Icon && <Icon size={20} />}
      <span>{enfants}</span>
    </StyledBouton>
  );
}

export default BoutonPrincipal;