import styled from 'styled-components';
import spacing from './settings.spacing.styles';

export const Wrapper = styled.section`
  max-width: 1400px;
  margin: 0 auto;
`;

export const Container = styled(Wrapper)`
  position: relative;
  padding-top: ${spacing.padding * 6}px;
  padding-right:  ${spacing.padding * 2}px;
  padding-bottom: ${spacing.padding * 3}px;
  padding-left: ${spacing.padding * 2}px;
`;
