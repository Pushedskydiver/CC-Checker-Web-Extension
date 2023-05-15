import styled from 'styled-components';
import { typography } from '../../../styles/settings.typography.styles';
import spacing from '../../../styles/settings.spacing.styles';

const SkipLink = styled.a`
  position: absolute;
  top: -${spacing.core * 3}px;
  left: 0;
  font-size: 1rem;
  font-variation-settings: 'wght' ${typography.weight.bold};
  line-height: normal;
  overflow: hidden;
  clip: rect(0 0 0 0);
  outline-offset: 4px;

  &:active,
  &:focus {
    clip: auto;
    overflow: visible;
    z-index: 20;
  }
`;

export default SkipLink;
