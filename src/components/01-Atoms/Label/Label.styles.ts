import styled, { css } from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';

export interface LabelProps {
  medium?: boolean,
  bold?: boolean,
  color?: string,
  ColorPicker?: boolean
}

const Label = styled.label<LabelProps>`
  display: inline-block;
  color: inherit;
  font-size: ${typography.body.size.medium};
  text-transform: capitalize;
  cursor: pointer;

  ${props => props.color && css`
    color: ${props.color};
  `}

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
