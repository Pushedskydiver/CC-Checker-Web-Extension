import styled, { css } from 'styled-components';
import spacing from '../../../styles/settings.spacing.styles';

export interface BlockProps {
  noMargin?: boolean,
  color?: string,
  flex?: boolean,
  select?: boolean
}

export const BlockSection = styled.section<BlockProps>`
  position: relative;

  ${props => !props.noMargin && css`
    margin-bottom: ${spacing.margin * 3.5}px;
  `}

  ${props => props.flex && css`
    display: flex;
    align-items: flex-end;
  `}

  ${props => props.color && css`
    color: ${props.color};
  `}

  ${props => props.select && css`
    display: inline-flex;
    align-items: baseline;
    padding-bottom: ${spacing.padding / 2}px;
    border-bottom: 1px solid currentColor;
  `}
`;

export const BlockDiv = BlockSection.withComponent('div');
