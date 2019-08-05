import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const Link = styled.a`
  display: inline-block;

  ${props => props.iconLink && css`
    width: 30px;
    height: 30px;
    margin-right: ${30 + (spacing.margin * 1.5)}px;
    text-decoration: none;
    grid-column: 8;
    grid-row: 1;
    justify-self: end;
    align-self: center;

    &:last-of-type {
      margin-right: 0;
    }
  `}
`;

export default Link;
