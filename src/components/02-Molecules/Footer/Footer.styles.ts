import styled from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const FooterStyles = styled.footer`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: auto auto 1fr;
  margin-top: ${spacing.margin * 2}px;
`;

export default FooterStyles;
