import React from 'react';
import styled from 'styled-components';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const ChampConteneur = styled.div`
  margin-bottom: 1rem;
`;

const LabelChamp = styled.label`
  display: block;
  color: var(--text-dark);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;

  & span.requis {
    color: #ef4444;
  }
`;

const ConteneurRelatif = styled.div`
  position: relative;
`;

const InputChamp = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: ${props => (props['data-avec-icone'] ? '3rem' : '1rem')};
  border: 1px solid var(--text-light);
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-color);
    border-color: transparent;
  }
`;

const SelectChamp = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--text-light);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  appearance: none;
  background: var(--white);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-color);
    border-color: transparent;
  }
`;

const TextareaChamp = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--text-light);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-color);
    border-color: transparent;
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  height: 1.25rem;
  width: 1.25rem;
  color: var(--text-light);
  cursor: pointer;

  &:hover {
    color: var(--text-dark);
  }
`;

const CheckboxInput = styled.input`
  margin-top: 0.25rem;
  height: 1rem;
  width: 1rem;
  color: var(--primary-color);

  &:focus {
    box-shadow: 0 0 0 2px var(--primary-color);
  }
`;

export const ChampFormulaire = ({
  label,
  type = "text",
  placeholder,
  icone: Icon,
  requis = false,
  valeur,
  onChange,
  montrerMotDePasse,
  basculerMotDePasse,
  ...props
}) => (
  <ChampConteneur>
    <LabelChamp>
      {label} {requis && <span className="requis">*</span>}
    </LabelChamp>
    <ConteneurRelatif>
      {Icon && <Icon style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', height: '1.25rem', width: '1.25rem', color: '#6b7280' }} />}
      <InputChamp
        type={type === "password" && montrerMotDePasse ? "text" : type}
        placeholder={placeholder}
        value={valeur}
        onChange={onChange}
        data-avec-icone={!!Icon} // Utilise un attribut data- pour éviter l’erreur
        {...props}
      />
      {type === "password" && (
        <TogglePassword onClick={basculerMotDePasse}>
          {montrerMotDePasse ? <EyeOff size={20} /> : <Eye size={20} />}
        </TogglePassword>
      )}
    </ConteneurRelatif>
  </ChampConteneur>
);

export const ChampSelection = ({ label, options, valeur, onChange, requis = false, ...props }) => (
  <ChampConteneur>
    <LabelChamp>
      {label} {requis && <span className="requis">*</span>}
    </LabelChamp>
    <ConteneurRelatif>
      <SelectChamp value={valeur} onChange={onChange} {...props}>
        <option value="">Sélectionnez une option</option>
        {options.map((option, index) => (
          <option key={index} value={option.valeur}>
            {option.libelle}
          </option>
        ))}
      </SelectChamp>
    </ConteneurRelatif>
  </ChampConteneur>
);

export const ZoneTexte = ({ label, placeholder, valeur, onChange, requis = false, ...props }) => (
  <ChampConteneur>
    <LabelChamp>
      {label} {requis && <span className="requis">*</span>}
    </LabelChamp>
    <TextareaChamp placeholder={placeholder} value={valeur} onChange={onChange} {...props} />
  </ChampConteneur>
);

export const CaseCoche = ({ label, coche, onChange, ...props }) => (
  <ChampConteneur style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
    <CheckboxInput type="checkbox" checked={coche} onChange={onChange} {...props} />
    <LabelChamp style={{ cursor: 'pointer' }}>{label}</LabelChamp>
  </ChampConteneur>
);