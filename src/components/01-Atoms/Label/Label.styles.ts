import styled, { css } from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';

export interface LabelProps {
  sr?: boolean,
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

  ${props => props.sr && css`
    position: absolute,
    width: 1px,
    height: 1px,
    padding: 0,
    margin: -1px,
    overflow: hidden,
    clip: rect(0, 0, 0, 0),
    white-space: nowrap,
    border-width: 0
  `}

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
