import styled, { css } from 'styled-components';
import { colors } from '../../../styles/settings.colors.styles';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

export interface ButtonProps {
  color: string
}

const InputButton = styled.button`
  width: 25px;
  height: 25px;
  border: none;
  outline: none;

  &:active svg,
  &:focus svg {
    outline: -webkit-focus-ring-color auto 5px;
    outline-offset: -2px;
  }
`;

const OptionButton = styled.button<ButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  ${props => props.color === '#222222' && css`
    background-color: ${props.color};
    color: ${colors.light}
  `}

  ${props => props.color === '#ffffff' && css`
    background-color: ${props.color};
    color: ${colors.dark}
  `}

  ${props => props.color !== '#222222' && props.color !== '#ffffff' && css`
    background-color: ${props.color};
    color: var(--background);
  `}
`;

export const Button = styled.button<ButtonProps>`
  display: inline-block;
  padding: ${(spacing.padding * 1.3).toFixed(0)}px ${spacing.padding * 1.5}px;
  border-radius: 4px;
  font-size: ${typography.body.size.medium};
  font-variation-settings: 'wght' ${typography.weight.medium};
  vertical-align: middle;

  ${props => props.color === '#222222' && css`
    background-color: ${props.color};
    color: ${colors.light}
  `}

  ${props => props.color === '#ffffff' && css`
    background-color: ${props.color};
    color: ${colors.dark}
  `}

  ${props => props.color !== '#222222' && props.color !== '#ffffff' && css`
    background-color: ${props.color};
    color: var(--background);
  `}
`;

export const CopyButton = styled(InputButton)`
  position: relative;
`;

export const ShareButton = styled(OptionButton)`
  position: relative;
`;

export const ColorPickerButton = styled(InputButton)``;

export const CloseButton = styled(OptionButton)``;

export const SwapButton = styled(OptionButton)``;
