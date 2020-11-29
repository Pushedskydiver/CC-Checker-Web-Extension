import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

export enum JustifyContentProps {
  start = 'flex-start',
  end = 'flex-end',
  center = 'center',
  between = 'space-between',
  around = 'space-around',
  evenly = 'space-evenly'
}

export enum AlignItemsProps {
  start = 'flex-start',
  end = 'flex-end',
  center = 'center',
  stretch = 'stretch',
  baseline = 'baseline'
}

export interface FlexProps {
  justify?: JustifyContentProps,
  align?: AlignItemsProps,
  noMargin?: boolean,
  move?: boolean
}

const Flex = styled.div<FlexProps>`
  display: flex;
  flex-wrap: wrap;

  ${props => !props.noMargin && !props.move && css`
    margin-bottom: ${spacing.margin * 2}px;
  `}

  ${props => props.justify === JustifyContentProps.between && css`
    justify-content: space-between;
  `}

  ${props => props.align === AlignItemsProps.center && css`
    align-items: center;
  `}

  ${props => props.align === AlignItemsProps.end && css`
    align-items: flex-end;
  `}
`;

export default Flex;
