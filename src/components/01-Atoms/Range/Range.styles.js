import styled from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const Range = styled.input`
  display: block;
  width: 100%;
  height: 6px;
  margin-top: ${spacing.margin}px;
  margin-bottom: ${spacing.margin}px;
  background-color: #141d26;
  border-radius: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    background-color: #141d26;
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
  }
`;

export default Range;
