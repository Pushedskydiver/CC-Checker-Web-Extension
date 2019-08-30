import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const Wcag = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
  margin-top: ${spacing.margin * 2}px;

  ${props => props.color && css`
    color: ${props.color};
  `}
`;

export default Wcag;
