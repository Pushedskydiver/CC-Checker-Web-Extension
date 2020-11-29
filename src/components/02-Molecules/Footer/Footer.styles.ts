import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

export interface FooterProps {
  expand: boolean
}

const FooterStyles = styled.footer<FooterProps>`
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
