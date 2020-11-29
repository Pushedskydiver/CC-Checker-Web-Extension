import styled from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

const SkipLink = styled.a`
  position: absolute;
  top: -${spacing.core * 1.5}px;
  left: 0;
  font-variation-settings: 'wght' ${typography.weight.medium};
  line-height: normal;
  overflow: hidden;
  clip: rect(0 0 0 0);

  &:active,
  &:focus {
    clip: auto;
    overflow: visible;
    z-index: 20;
  }
`;

export default SkipLink;
