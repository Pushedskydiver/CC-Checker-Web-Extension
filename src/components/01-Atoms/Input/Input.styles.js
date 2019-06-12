import styled from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';

const InputStyles = styled.input`
  width: 100%;
  border-bottom: 3px solid currentColor;
  color: inherit;
  font-size: ${typography.heading.size.medium};
  font-variation-settings: 'wght' ${typography.weight.bold};
  transition: border-bottom-color 0.3s ease-in-out;
`;

export default InputStyles;
