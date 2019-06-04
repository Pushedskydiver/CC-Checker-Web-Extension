import styled from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

const RatioStyles = styled.span`
  display: inline-block;
  margin-left: ${spacing.margin}px;
  font-size: ${typography.heading.size.regular};
  font-variation-settings: 'wght' ${typography.weight.medium};
  line-height: 1;
`;

export default RatioStyles;
