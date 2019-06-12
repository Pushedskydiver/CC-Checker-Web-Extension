import styled from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

const RatioStyles = styled.span`
  display: inline-block;
  margin-right: ${spacing.margin * 2}px;
  margin-left: ${spacing.margin * 2}px;
  color: inherit;
  font-size: ${typography.heading.size.medium};
  font-variation-settings: 'wght' ${typography.weight.medium};
  line-height: 1;
`;

export default RatioStyles;
