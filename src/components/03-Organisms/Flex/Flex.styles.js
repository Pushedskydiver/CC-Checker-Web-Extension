import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${props => !props.noMargin && css`
    margin-bottom: ${spacing.margin * 3}px;
  `}

  ${props => props.justify === 'between' && css`
    justify-content: space-between;
  `}

  ${props => props.align === 'center' && css`
    align-items: center;
  `}

  ${props => props.align === 'end' && css`
    align-items: flex-end;
  `}
`;

export default Flex;
