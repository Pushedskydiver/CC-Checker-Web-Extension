import { css, createGlobalStyle } from 'styled-components';
import { colors } from './settings.colors.styles';
import { typography } from './settings.typography.styles';
import { maxWidth } from './settings.breakpoints.styles';
import spacing from './settings.spacing.styles';

const GlobalStyles = createGlobalStyle`
  :root {
    --background: ${colors.core};
    --foreground: ${colors.dark};
    --font: ${typography.family};
    --copy: inherit;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    color: inherit;
    font-weight: normal;
  }

  html {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 16px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    font-family: var(--font);
    font-variation-settings: 'wght' ${typography.weight.regular};
    line-height: ${typography.lineHeight.body};
    transition: background-color 0.3s ease-in-out;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  body ::-moz-selection {
    background: var(--foreground);
    color: var(--background);
  }

  body ::selection {
    background: var(--foreground);
    color: var(--background);
  }

  main {
    padding-top: ${spacing.padding * 2.25}px;
    padding-bottom: ${spacing.padding * 2.25}px;
    background-color: ${colors.dark};
    color: ${colors.light};

    ${maxWidth('992', () => css`
      display: none;
    `)}
  }

  h1,
  h2,
  p {
    margin-top: 0;
    margin-bottom: ${spacing.margin}px;
  }

  button {
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-family: inherit;
    cursor: pointer;
    appearance: none;
  }

  input,
  select {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-family: inherit;
    appearance: none;
  }
`;

export default GlobalStyles;
