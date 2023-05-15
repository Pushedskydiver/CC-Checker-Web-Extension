import styled, { css, keyframes } from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';
import { colors } from '../../../styles/settings.colors.styles';
import spacing from '../../../styles/settings.spacing.styles';

export interface TooltipProps {
  color: string | undefined,
  visible?: boolean
}

const FadeInOut = keyframes`
  0,100%% {
    opacity: 0;
  }

  5%,95% {
    opacity: 1;
  }
`;

const Tooltip = styled.span<TooltipProps>`
  position: absolute;
  top: calc(100% + ${spacing.core}px);
  left: 50%;
  padding: ${spacing.padding / 2}px ${spacing.padding}px;
  font-size: ${typography.body.size.regular};
  font-variation-settings: 'wght' ${typography.weight.bold};
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%);

  &:after {
    content: '';
    position: absolute;
    top: -10px;
    left: calc(50% - 5px);
    width: 0;
    height: 0;
    border: 5px solid transparent;
    pointer-events: none;
    transform: rotate(180deg);
  }

  ${props => props.color === '#222222' && css`
    background-color: ${props.color};
    color: ${colors.light};

    &:after {
      border-top-color: ${props.color};
    }
  `}

  ${props => props.color === '#ffffff' && css`
    background-color: ${props.color};
    color: ${colors.dark};

    &:after {
      border-top-color: ${props.color};
    }
  `}

  ${props => props.color !== '#222222' && props.color !== '#ffffff' && css`
    background-color: ${props.color};
    color: var(--background);

    &:after {
      border-top-color: ${props.color};
    }
  `}

  ${props => props.visible && css`
    width: auto;
    height: auto;
    animation: ${FadeInOut} 2s ease-in-out;
  `}
`;

export default Tooltip;
