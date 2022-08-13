import styled, { css } from 'styled-components';
import { colors } from '../../../styles/settings.colors.styles';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

const Badge = styled.span<CC.BadgeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.margin}px;
  padding: ${spacing.padding / 1.5}px ${spacing.padding}px;
  border-radius: 4px;
  font-size: ${typography.heading.size.small};
  font-variation-settings: 'wght' ${typography.weight.medium};
  line-height: normal;

  ${props => props.color === '#222222' && css`
    background-color: ${props.color};
    color: ${colors.light};
  `}

  ${props => props.color === '#ffffff' && css`
    background-color: ${props.color};
    color: ${colors.dark};
  `}

  ${props => props.color !== '#222222' && props.color !== '#ffffff' && css`
    background-color: ${props.color};
    color: var(--background);
  `}
`;

export default Badge;
