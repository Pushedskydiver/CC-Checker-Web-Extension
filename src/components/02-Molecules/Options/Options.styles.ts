import styled from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

export const OptionsListStyles = styled.ul`
  position: absolute;
  top: 20px;
  right: ${spacing.margin * 2}px;
  display: flex;
`;

export const OptionsItemStyles = styled.li`
  margin-right: ${spacing.margin}px;

  &:last-child {
    margin-right: 0;
  }
`;
