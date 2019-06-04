import styled from 'styled-components';
import { colors } from '../../../styles/settings.colors.styles';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

export const Button = styled.button`
  padding: ${spacing.padding}px ${spacing.padding * 1.5}px;
  background-color: ${colors.dark};
  color: ${colors.light};
  border: 1px solid #141d26;
  border-radius: 4px;
  font-size: ${typography.body.size.regular};
  font-variation-settings: 'wght' ${typography.weight.medium};
`;
