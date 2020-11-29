import styled from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';

const Grade = styled.span`
  display: block;
  color: inherit;
  font-size: ${typography.heading.size.tiny};
  font-variation-settings: 'wght' ${typography.weight.medium};
  line-height: 1;
`;

export default Grade;
