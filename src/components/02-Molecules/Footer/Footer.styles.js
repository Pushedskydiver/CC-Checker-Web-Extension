import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const FooterStyles = styled.footer`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: auto repeat(6, 50px) 1fr;

  ${props => props.expand === false && css`
    display: none;
  `}

  ${props => props.expand === true && css`
    margin-top: ${spacing.margin * 2}px;
  `}
`;

export default FooterStyles;
