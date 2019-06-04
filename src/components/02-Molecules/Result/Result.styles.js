import styled from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const Result = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.margin * 1.5}px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export default Result;
