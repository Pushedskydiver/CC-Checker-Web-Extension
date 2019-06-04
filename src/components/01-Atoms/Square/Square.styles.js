import styled, { css } from 'styled-components';

const Square = styled.span`
  width: 1.3em;
  height: 1.3em;
  border: 1px solid #fff;

  ${props => props.background && css`
    background-color: var(--background);
  `}

  ${props => props.foreground && css`
    background-color: var(--foreground);
  `}
`;

export default Square;
