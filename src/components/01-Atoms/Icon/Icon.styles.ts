import styled from 'styled-components';

export interface IconProps {
  colorPicker?: boolean
}

const IconStyles = styled.svg<IconProps>`
  display: inline-block;
  vertical-align: middle;
`;

export default IconStyles;
