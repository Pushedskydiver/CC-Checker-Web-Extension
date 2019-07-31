import styled, { css } from 'styled-components';
import { rgba } from '../../../styles/settings.colors.styles';
import spacing from '../../../styles/settings.spacing.styles';

const Range = styled.input`
  display: block;
  width: 100%;
  height: 6px;
  margin-top: ${spacing.margin}px;
  margin-bottom: ${spacing.margin}px;
  border-radius: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
  }

  ${props => props.color && css`
    background-color: ${rgba(props.color, 0.3)};

    &::-webkit-slider-thumb {
      background-color: ${props.color};
    }
  `}
`;

export default Range;
