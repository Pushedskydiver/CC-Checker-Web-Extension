import styled from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';

const InputStyles = styled.input`
  width: 100%;
  color: inherit;
  font-size: ${typography.heading.size.tiny};
  font-variation-settings: 'wght' ${typography.weight.medium};
  text-align: right;
  transition: border-bottom-color 0.3s ease-in-out;
`;

export default InputStyles;
