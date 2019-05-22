import styled, { css } from 'styled-components';
import { minWidth, maxWidth } from '../../../styles/settings.breakpoints.styles';
import spacing from '../../../styles/settings.spacing.styles';

export const BlockSection = styled.section`
  ${props => !props.sticky && css`
    position: relative;
  `}

  ${props => props.sticky && css`
    ${maxWidth('640', () => css`
      position: sticky;
      top: 0;
      background-color: var(--background);
      padding-top: ${spacing.padding}px;
      padding-bottom: ${spacing.padding}px;
      z-index: 10;
    `)}
  `}

  ${props => !props.noMargin && css`
    margin-bottom: ${spacing.margin * 3.5}px;
  `}

  ${props => props.flex && css`
    ${minWidth('992', () => css`
      display: flex;
      align-items: flex-end;
    `)}
  `}

  ${props => props.inputs && css`
    ${minWidth('992', () => css`
      width: 48%;
      margin-bottom: 0;
    `)}
  `}

  ${props => props.color && css`
    color: ${props.color};
  `}

  ${props => props.select && css`
    padding-bottom: ${spacing.padding / 2}px;
    border-bottom: 1px solid currentColor;

    ${minWidth('768', () => css`
      display: inline-flex;
      align-items: baseline;
    `)}
  `}
`;

export const BlockDiv = BlockSection.withComponent('div');
