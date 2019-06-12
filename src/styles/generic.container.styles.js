import styled from 'styled-components';
import spacing from './settings.spacing.styles';

export const Wrapper = styled.div`
  position: relative;
`;

export const Container = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: ${spacing.padding * 3}px  ${spacing.padding * 2}px;
  background-color: var(--background);
  color: var(--foreground);
`;
