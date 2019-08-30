import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const ControlStyles = styled.div`
  margin-top: ${spacing.margin * 1.5}px;

  ${props => props.color && css`
    color: ${props.color};
  `}
`;

export default ControlStyles;
