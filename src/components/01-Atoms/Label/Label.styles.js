import styled, { css } from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';

const Label = styled.label`
  display: inline-block;
  color: inherit;
  font-size: ${typography.body.size.medium};
  cursor: pointer;

  ${props => props.ColorPicker && css`
    position: absolute;
    top: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
  `}

  ${props => props.medium && css`
    font-variation-settings: 'wght' ${typography.weight.medium};
  `}

  ${props => props.bold && css`
    font-variation-settings: 'wght' ${typography.weight.bold};
  `}
`;

export default Label;
