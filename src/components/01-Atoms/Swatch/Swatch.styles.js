import styled, { css } from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';

const SwatchStyles = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  font-size: ${typography.body.size.large};
  font-variation-settings: 'wght' ${typography.weight.bold};
  line-height: 1;
  vertical-align: middle;
  cursor: pointer;
  appearance: none;

  ${props => props.background && css`
    background-color: ${props.background};
  `}

  ${props => props.foreground && css`
    border: 1px solid ${props.foreground};
    color: ${props.foreground};
  `}
`;

export default SwatchStyles;
