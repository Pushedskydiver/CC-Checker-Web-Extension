import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

const Flex = styled.div`
  display: grid;

  ${props => !props.noMargin && css`
    margin-bottom: ${spacing.margin * 2}px;
  `}

  ${props => props.columns && css`
    grid-template-columns: ${props.columns};
  `}

  ${props => props.rows && css`
    grid-template-rows: ${props.rows};
  `}

  ${props => props.gap && css`
    grid-gap: ${props.gap}px;
  `}

  ${props => props.columnGap && css`
    grid-column-gap: ${props.columnGap}px;
  `}

  ${props => props.rowGap && css`
    grid-row-gap: ${props.rowGap}px;
  `}

  ${props => props.align && css`
    align-items: ${props.align};
  `}

  ${props => props.expand === false && css`
    display: none;
  `}

  ${props => props.expand === true && css`
    margin-top: ${spacing.margin * 2}px;
  `}
`;

export default Flex;
