import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const IconStyles = styled.svg`
  display: inline-block;
  vertical-align: middle;

  ${props => !props.select && !props.grade && !props.copy && css`
    width: 100%;
    height: 100%;
  `}

  ${props => props.copy && css`
    margin-left: ${spacing.margin / 2}px;
  `}

  ${props => props.select && css`
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: -1;
  `}
`;

export default IconStyles;
