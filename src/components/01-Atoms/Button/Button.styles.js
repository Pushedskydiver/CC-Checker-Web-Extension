import styled, { css } from 'styled-components';
import { colors } from '../../../styles/settings.colors.styles';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

export const Button = styled.button`
  display: inline-block;
  padding: ${(spacing.padding * 1.3).toFixed(0)}px ${spacing.padding * 1.5}px;
  border-radius: 4px;
  font-size: ${typography.body.size.regular};
  font-variation-settings: 'wght' ${typography.weight.medium};
  vertical-align: middle;

  &:first-child {
    margin-right: ${spacing.margin * 2}px;
  }

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

export const CopyButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  width: 25px;
  height: 25px;
  border: none;
  outline: none;
  transform : translateY(-50%);

  &:active svg,
  &:focus svg {
    outline: -webkit-focus-ring-color auto 5px;
    outline-offset: -2px;
  }
`;

export const ColourPickerButton = styled.button`
  position: absolute;
  top: 50%;
  right: 35px;
  width: 25px;
  height: 25px;
  border: none;
  outline: none;
  transform : translateY(-50%);

  &:active svg,
  &:focus svg {
    outline: -webkit-focus-ring-color auto 5px;
    outline-offset: -2px;
  }
`;
